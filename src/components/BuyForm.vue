<template>
  <form @submit.prevent="submitForm" class="mb-3">
    <div>
      <label class="float-left"><b>Input</b></label>
      <span class="float-right text-muted">Balance: {{ toHuman(ethBalance) }}</span>
    </div>
    <div class="input-group mb-4">
      <input 
        type="text" 
        class="form-control form-control-lg" 
        placeholder="0" 
        v
        v-model="input"
        required 
      />
      <div class="input-group-append">
        <div class="input-group-text">
          <img :src="ethLogo" height="32" alt="">
          &nbsp;&nbsp; ETH
        </div>
      </div>
    </div>
    <div>
      <label class="float-left"><b>Output</b></label>
      <span class="float-right text-muted" >Balance: {{ toHuman(tokenBalance) }}</span>
    </div>
    <div class="input-group mb-2">
      <input 
        type="text"
        class = "form-control form-control-lg"
        placeholder = '0'
        v-model="output"
        disabled
      />
      <div class="input-group-append">
        <div class="input-group-text" >
          <img :src="tokenLogo" height="32" alt="">
          &nbsp;&nbsp; ENU
        </div>
      </div>
    </div>
    <div class="mb-5">
      <span class="float-left text-muted">Exchange Rate</span>
      <span class="float-right text-muted">1 ETH = 100 ENU</span>
    </div>
    <button type="submit" class="btn btn-primary btn-block btn-lg" >SWAP!</button>
  </form>
</template>

<script>

import TokenLogo from '../enu.png'
import EthLogo from '../eth-logo.png'
import { ref, watch } from 'vue'

export default {
    name: 'BuyForm',
    props: ['toHuman', 'ethBalance', 'tokenBalance', 'buyTokens'],
    setup(props) {
      const tokenLogo = ref(TokenLogo)
      const ethLogo = ref(EthLogo)
      const input = ref('')
      const output = ref('')

      const submitForm = (event) => {
        let etherAmount
        etherAmount = input.value.toString()
        etherAmount = window.web3.utils.toWei(etherAmount, 'ether')
        props.buyTokens(etherAmount)
      }

      watch(input, (currentValue, oldValue) => {
        output.value = currentValue * 100
      })  

      return { tokenLogo, ethLogo, submitForm, input, output }
    }
}
</script>

<style scoped>

</style>