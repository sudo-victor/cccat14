export default interface AccountGateway {
  signup(input: Input): Promise<Output>;
}

export type Input = {
  isPassenger: boolean;
  isDriver: boolean;
  name: string;
  cpf: string;
  email: string;
  carPlate: string;
}

export type Output = {
  accountId: string
}