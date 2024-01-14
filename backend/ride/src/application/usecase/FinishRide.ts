import DomainEvent from "../../domain/events/DomainEvent";
import Queue from "../../infra/queue/Queue";
import PaymentGateway from "../gateway/PaymentGateway";
import RideRepository from "../repository/RideRepository";

export default class FinishRide {
	constructor(private rideRepository: RideRepository, private paymentGateway: PaymentGateway, private queue: Queue) { }

	async execute(input: Input): Promise<void> {
		const ride = await this.rideRepository.getById(input.rideId)
		if (!ride) throw new Error("Ride not found")
		ride?.register(async (event: DomainEvent) => {
			await this.queue.publish(event.name, event)
		})
		if (ride.getStatus() !== "in_progress") throw new Error("To update position ride must be in progress")
		ride.finish()
		await this.rideRepository.update(ride)
	}
}

type Input = {
	rideId: string,
}