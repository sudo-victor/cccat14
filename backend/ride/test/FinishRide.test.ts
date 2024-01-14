import LoggerConsole from "../src/infra/logger/LoggerConsole";
import RequestRide from "../src/application/usecase/RequestRide";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";
import AcceptRide from "../src/application/usecase/AcceptRide";
import StartRide from "../src/application/usecase/StartRide";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import DatabaseConnection from "../src/infra/database/DatabaseConnection";
import UpdatePosition from "../src/application/usecase/UpdatePosition";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepositoryDatabase";
import FinishRide from "../src/application/usecase/FinishRide";
import AccountGateway from "../src/application/gateway/AccountGateway";
import AccountGatewayHttp from "../src/infra/gateway/AccountGatewayHttp";
import PaymentGateway from "../src/application/gateway/PaymentGateway";
import PaymentGatewayHttp from "../src/infra/gateway/PaymentGatewayHttp";
import Queue from "../src/infra/queue/Queue";
import GetRideCompleteApiComposition from "../src/application/usecase/GetRideCompleteApiComposition";
import GetRideQuery from "../src/application/query/GetRideQuery";
import GetRideQueryProjection from "../src/application/query/GetRideQueryProjection";

let accountGateway: AccountGateway;
let paymentGateway: PaymentGateway;
let requestRide: RequestRide;
let getRide: GetRideQuery;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let finishRide: FinishRide;
let database: DatabaseConnection;

beforeEach(() => {
	database = new PgPromiseAdapter()
	const rideRepository = new RideRepositoryDatabase()
	const positionRepository = new PositionRepositoryDatabase(database)
	const logger = new LoggerConsole()
	const queue = new Queue()
	accountGateway = new AccountGatewayHttp()
	paymentGateway = new PaymentGatewayHttp()
	requestRide = new RequestRide(rideRepository, accountGateway, logger)
	getRide = new GetRideQuery(database)
	acceptRide = new AcceptRide(rideRepository, accountGateway)
	startRide = new StartRide(rideRepository)
	updatePosition = new UpdatePosition(rideRepository, positionRepository)
	finishRide = new FinishRide(rideRepository, paymentGateway, queue)
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
	const inputUpdatePosition1 = {
		rideId: outputRequestRide.rideId,
		lat: 37.7749,
		long: -122.4194
	}
	await updatePosition.execute(inputUpdatePosition1)
	const inputUpdatePosition2 = {
		rideId: outputRequestRide.rideId,
		lat: 34.0522,
		long: -118.2437
	}
	await updatePosition.execute(inputUpdatePosition2)
	const inputFinishRide = {
    rideId: outputRequestRide.rideId
  }
  await finishRide.execute(inputFinishRide)
	const outputGetRide = await getRide.execute(outputRequestRide.rideId)
	expect(outputGetRide.status).toBe("completed")
	expect(outputGetRide.distance).toBe(559)
	expect(outputGetRide.passengerName).toBe("Jhon Doe")
	expect(outputGetRide.driverCarPlate).toBe("AAA9999")
	expect(outputGetRide.fare).toBe(1173.9)
	// expect(outputGetRide.fare).toBe(2795)
})