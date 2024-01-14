import { randomUUID } from "node:crypto"
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import RequestRide from "../src/application/usecase/RequestRide";
import GetRide from "../src/application/usecase/GetRide";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepositoryDatabase";
import AccountGatewayHttp from "../src/infra/gateway/AccountGatewayHttp";
import AccountGateway from "../src/application/gateway/AccountGateway";
import axios from "axios";
import GetRideByPassengerId from "../src/application/usecase/GetRideByPassengerId";

let requestRide: RequestRide;
let getRide: GetRide;
let getRideByPassengerId: GetRideByPassengerId
let accountGateway: AccountGateway
let database: DatabaseConnection;

function sleep(ms: number) {
	return new Promise((resolve, reject) => {
		setTimeout(() => { resolve("") }, ms)
	})
}

beforeEach(() => {
	database = new PgPromiseAdapter()
	const rideRepository = new RideRepositoryDatabase()
	const logger = new LoggerConsole()
	accountGateway = new AccountGatewayHttp()
	getRideByPassengerId = new GetRideByPassengerId(rideRepository, logger)
	requestRide = new RequestRide(rideRepository, accountGateway, logger)
	getRide = new GetRide(rideRepository, logger)
})

afterEach(async () => {
	await database.close()
})


test("Deve solicitar uma corrida", async function () {
	const inputSignup = {
		name: "Jhon Doe",
		email: `jhon.doe${Math.random()}@gmail.com`,
		cpf: "50207214093",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await accountGateway.signup(inputSignup)
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		"fromLat": 37.7749,
		"fromLong": -122.4194,
		"toLat": 34.0522,
		"toLong": -118.2437
	}
	// const outputRequestRide = await requestRide.execute(inputRequestRide)
	await axios.post("http://localhost:3000/request_ride_async", inputRequestRide)
	await sleep(500)
	const outputGetRide = await getRideByPassengerId.execute(inputRequestRide.passengerId)
	expect(outputGetRide.status).toBe("requested")
})
