import axios from "axios";
import PaymentGateway from "../../application/gateway/PaymentGateway";

export default class PaymentGatewayHttp implements PaymentGateway {
  async processPayment(input: any): Promise<void> {
    const resp = await axios.post('http://localhost:3002/process_payment', input);
  } 
}