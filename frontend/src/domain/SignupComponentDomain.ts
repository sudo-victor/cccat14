import Observable from "@/Observable";

export default class SignupComponentDomain extends Observable {
  isPassenger = false;
  isDriver = false;
  name = "";
  email = "";
  carPlate = "";
  cpf = "";
  step = 1;
  error = "";

  constructor() {
    super()
  }

  next() {
    this.error = ""
    if (this.step === 1 && !this.isPassenger && !this.isDriver) {
      this.error = "Select at least one option"
      return
    }
    if (this.step === 2 && this.name === "") {
      this.error = "Invalid name"
      return
    }
    if (this.step === 2 && this.email === "") {
      this.error = "Invalid email"
      return
    }
    if (this.step === 2 && this.cpf === "") {
      this.error = "Invalid cpf"
      return
    }
    if (this.step === 2 && this.isDriver && this.carPlate === "") {
      this.error = "Invalid car plate"
      return
    }
    this.step++
  }

  previous() {
    this.step--
  }

  isNextButtonVisible() {
    return (this.step < 3)
  }

  isPreviousButtonVisible() {
    return (this.step > 1 && this.step < 4)
  }

  isSubmitButtonVisible() {
    return (this.step === 3)
  }

  submit() {
    this.next()
    const data = {
      isPassenger: this.isPassenger,
      isDriver: this.isDriver,
      name: this.name,
      email: this.email,
      carPlate: this.carPlate,
      cpf: this.cpf,
    }
    this.notify({ name: "submitted", data })
  }
}