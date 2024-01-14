import AccountGateway from "../gateway/AccountGateway";
import RideRepository from "../repository/RideRepository";

export default class GetRideCompleteApiComposition {
	constructor(private rideRepository: RideRepository, private accountGateway: AccountGateway) { }

	async execute(rideId: string): Promise<Output> {
		const ride = await this.rideRepository.getById(rideId)
		if (!ride) throw new Error("Ride not found")
		const passenger = await this.accountGateway.getById(ride.passengerId)
		if(!passenger) throw new Error("Passenger not found")
		let driver;
		if (ride.getDriverId()) {
			driver = await this.accountGateway.getById(ride.getDriverId() as string)
		}
		return {
			rideId: ride.rideId,
			status: ride.getStatus(),
			driverId: ride.getDriverId(),
			passengerId: ride.passengerId,
			distance: ride.getDistance(),
			fare: ride.getFare(),
			passengerName: passenger.name,
			passengerCpf: passenger.cpf,
			driverCarPlate: driver?.carPlate
		}
	}
}

type Output = {
	rideId: string,
	status: string,
	driverId: string | undefined,
	passengerId: string,
	distance?: number
	fare?: number
	passengerName: string
	driverCarPlate?: string
	passengerCpf: string
}