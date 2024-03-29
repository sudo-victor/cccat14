import Position from "../../domain/entities/Position";

export default interface PositionRepository {
  save(position: Position): Promise<void>;
  listByRideId(rideId: string): Promise<Position[]>
}