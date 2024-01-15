import LoggerConsole from "./infra/logger/LoggerConsole";
import MainController from "./infra/controller/MainController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import Registry from "./infra/di/Registry";
import Queue from "./infra/queue/Queue";
import SendReceipt from "./application/usecase/SendReceipt";
import QueueController from "./infra/queue/QueueController";
import RideRepositoryDatabase from "./infra/repository/RideRepositoryDatabase";
import AccountGatewayHttp from "./infra/gateway/AccountGatewayHttp";
import RequestRide from "./application/usecase/RequestRide";
import UpdateRideProjectionApiComposition from "./application/usecase/UpdateRideProjectionApiComposition";
import AxiosAdapter from "./infra/http/AxiosAdapter";

const httpServer = new ExpressAdapter()
const database = new PgPromiseAdapter()
const logger = new LoggerConsole()
const rideRepository = new RideRepositoryDatabase()
const accountGateway = new AccountGatewayHttp(new AxiosAdapter())
const queue = new Queue()
const sendReceipt = new SendReceipt()
const requestRide = new RequestRide(rideRepository, accountGateway, logger)
const updateRideProjection = new UpdateRideProjectionApiComposition(database, accountGateway)

const registry = Registry.getInstance();
registry.register("httpServer", httpServer);
registry.register("queue", queue);
registry.register("sendReceipt", sendReceipt);
registry.register("requestRide", requestRide);
registry.register("updateRideProjection", updateRideProjection);

new MainController()
new QueueController()
httpServer.listen(3000)