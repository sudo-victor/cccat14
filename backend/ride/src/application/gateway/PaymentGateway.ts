export default interface PaymentGateway {
  processPayment(input: any): Promise<void>
}