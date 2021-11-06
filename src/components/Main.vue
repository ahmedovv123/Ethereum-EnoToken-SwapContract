<template>
  <div id="content" class="mt-3">
    <div class="d-flex justify-content-between mb-3">
      <button @click="buyForm = true" class="btn btn-light">Buy</button>
      <span class="text-muted">&lt; &nbsp; &gt;</span>
      <button @click='buyForm = false' class="btn btn-light">Sell</button>
    </div>
    <div class="card mb-4">
        <div class="card-body">
          <BuyForm v-if="buyForm"
            :ethBalance="ethBalance" 
            :tokenBalance="tokenBalance" 
            :buyTokens="buyTokens" 
            :toHuman="toHuman" 
          />

          <SellForm v-else
            :ethBalance="ethBalance" 
            :tokenBalance="tokenBalance" 
            :sellTokens="sellTokens" 
            :toHuman="toHuman" 
          />
         
        </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import BuyForm from './BuyForm.vue'
import SellForm from './SellForm.vue'

export default {
  name: 'Main',
  components: {
    BuyForm,
    SellForm 
  },
  props: ['ethBalance', 'tokenBalance', 'buyTokens', 'sellTokens'],
  setup(){
    const buyForm = ref(true)

    const toHuman = (balance) => {
      return window.web3.utils.fromWei(balance, 'ether')
    }


    return { toHuman, buyForm }
  }
}
</script>

<style scoped>

</style>