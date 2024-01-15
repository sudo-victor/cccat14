<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import SignupComponentDomain from "./domain/SignupComponentDomain";
import type AccountGateway from "./infra/gateway/AccountGateway"

const signupForm = ref(new SignupComponentDomain())
const accountId = ref("")
let accountGateway: AccountGateway

signupForm.value.register(async function (event: any) {
  if(event.name === "submitted") {
  const input = event.value
  const output = await accountGateway.signup(input)
  accountId.value = output.accountId
}
})

onMounted(() => {
  accountGateway = inject("accountGateway") as AccountGateway
})
</script>

<template>
  <div id="step">Step {{ signupForm.step }}</div>
  <div v-if="signupForm.step === 1">
    <div>
      <label>
        <input type="checkbox" id="is-passenger" v-model="signupForm.isPassenger">
        Passenger
      </label>
    </div>
    <div>
      <label>
        <input type="checkbox" id="is-driver" v-model="signupForm.isDriver">
        Driver
      </label>
    </div>
  </div>

  <div v-if="signupForm.step === 2">
    <div>
      <div>
        <label>Name:</label>
        <input type="text" id="input-name" v-model="signupForm.name">
      </div>
    </div>
    <div>
      <div>
        <label>E-mail:</label>
        <input type="email" id="input-email" v-model="signupForm.email">
      </div>
    </div>
    <div>
      <div>
        <label>Cpf:</label>
        <input type="text" id="input-cpf" v-model="signupForm.cpf">
      </div>
    </div>
    <div>
      <div>
        <label>Car plate:</label>
        <input type="text" id="input-car-plate" v-if="signupForm.isDriver" v-model="signupForm.carPlate">
      </div>
    </div>
  </div>

  <div v-if="signupForm.step === 3">
    <div id="name">Name: {{ signupForm.name }}</div>
    <div id="email">E-mail: {{ signupForm.email }}</div>
    <div id="cpf">Cpf: {{ signupForm.cpf }}</div>
    <div v-if="signupForm.isDriver" id="car-plate">Car plate: {{ signupForm.carPlate }}</div>
  </div>

  <div v-if="signupForm.step === 4">
    <div id="account-id" v-if="accountId">{{ accountId }}</div>
  </div>
  <br>

  <button id="previous-button" v-if="signupForm.isPreviousButtonVisible()"
    @click="signupForm.previous()">Previous</button>
  <button id="next-button" v-if="signupForm.isNextButtonVisible()" @click="signupForm.next()">Next</button>
  <button id="submit-button" v-if="signupForm.isSubmitButtonVisible()" @click="signupForm.submit()">Submit</button>
  <div id="error">{{ signupForm.error }}</div>
</template>

<style scoped></style>
