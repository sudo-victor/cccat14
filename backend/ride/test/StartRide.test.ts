import LoggerConsole from "../src/infra/logger/LoggerConsole";
import RequestRide from "../src/application/usecase/RequestRide";
import GetRide from "../src/application/usecase/GetRide";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";
import AcceptRide from "../src/application/usecase/AcceptRide";
import StartRide from "../src/application/usecase/StartRide";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepositoryDatabase";
import AccountGateway from "../src/application/gateway/AccountGateway";
import AccountGatewayHttp from "../src/infra/gateway/AccountGatewayHttp";

let accountGateway: AccountGateway;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let database: DatabaseConnection;

beforeEach(() => {
	database = new PgPromiseAdapter()
	const rideRepository = new RideRepositoryDatabase()
	const positionRepository = new PositionRepositoryDatabase(database)
	const logger = new LoggerConsole()
	accountGateway = new AccountGatewayHttp()
	requestRide = new RequestRide(rideRepository, accountGateway, logger)
	getRide = new GetRide(rideRepository, logger)
	acceptRide = new AcceptRide(rideRepository, accountGateway)
	startRide = new StartRide(rideRepository)
})

afterEach(async () => {
	await database.close()
})

test("Deve iniciar uma corrida", async function () {
	const inputSignupPassenger = {
		name: "Jhon Doe",
		email: `jhon.doe${Math.random()}@gmail.com`,
		cpf: "50207214093",
		isPassenger: true,
		password: "123456"
	};
	const outputSignupPassanger = await accountGateway.signup(inputSignupPassenger)
	const inputSignupDriver = {
		name: "Jhon Doe",
		email: `jhon.doe${Math.random()}@gmail.com`,
		cpf: "50207214093",
		isDriver: true,
		carPlate: "AAA9999",
		password: "123456"
	};
	const outputSignupDriver = await accountGateway.signup(inputSignupDriver)
	const inputRequestRide = {
		passengerId: outputSignupPassanger.accountId,
		"fromLat": 37.7749,
		"fromLong": -122.4194,
		"toLat": 34.0522,
		"toLong": -118.2437
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide)
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
	await acceptRide.execute(inputAcceptRide)
	const inputStartRide = {
		rideId: outputRequestRide.rideId
	}
	await startRide.execute(inputStartRide)
	const outputGetRide = await getRide.execute(outputRequestRide.rideId)
	expect(outputGetRide.status).toBe("in_progress")
})