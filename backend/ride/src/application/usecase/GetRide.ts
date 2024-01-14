import Logger from "../logger/Logger";
import RideRepository from "../repository/RideRepository";

export default class GetRide {
	constructor(private rideRepository: RideRepository, private logger: Logger) { }

	async execute(rideId: string): Promise<Output> {
		this.logger.log(`getRide`)
		const ride = await this.rideRepository.getById(rideId)
		if (!ride) throw new Error("Ride not found")
		return {
			rideId: ride.rideId,
			status: ride.getStatus(),
			driverId: ride.getDriverId(),
			passengerId: ride.passengerId,
			distance: ride.getDistance(),
			fare: ride.getFare()
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
}