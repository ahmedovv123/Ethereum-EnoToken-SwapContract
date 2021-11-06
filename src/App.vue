<template>
  <div>
    <Navbar :account="account" />
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 ml-auto mr-auto" style="max-width: 600px" >
          <div className="content mr-auto ml-auto">
            <a
              href="http://www.dappuniversity.com/bootcamp"
              target="_blank"
              rel="noopener noreferrer"
            >
            </a>
            <p v-if="loading" id="loader" className="text-center" >Loading...</p>
            <Main 
              :buyTokens="buyTokens"  
              :ethBalance="ethBalance" 
              :tokenBalance="tokenBalance"
              :sellTokens="sellTokens"  
              v-else
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref } from 'vue';
import Web3 from 'web3'
import Navbar from './components/Navbar.vue'
import Main from './components/Main.vue'
import EthSwap from './abis/EthSwap.json'
import Token from './abis/Token.json'

export default {
  name: "App",
  components: {
    Navbar,
    Main
  },
  setup() {

    const account = ref('')
    const ethBalance = ref('0')
    const token = ref('')
    const tokenBalance = ref('0')
    const ethSwap = ref({})
    const loading = ref(true)

    onBeforeMount(async () => {
      await loadWeb3()
      await loadBlockchainData()
      loading.value = false
    })

    const loadBlockchainData = async () => {
      const web3 = window.web3

      const accounts = await web3.eth.getAccounts()
      account.value = accounts[0]

      ethBalance.value = await web3.eth.getBalance(account.value)

      // Load Token
      const networkId = await web3.eth.net.getId()
      const tokenData = Token.networks[networkId]
      if (tokenData) {
        token.value = new web3.eth.Contract(Token.abi, tokenData.address)
        let balance = await token.value.methods.balanceOf(account.value).call()
        tokenBalance.value = balance.toString()
      } else {
        window.alert('Token contract not deployed to detected network')
      }

      // Load EthSwap
      const ethSwapData = EthSwap.networks[networkId]
      if (ethSwapData) {
        ethSwap.value = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      } else {
        window.alert('EthSwap contract not deployed to detected network')
      }
      
    }

    const loadWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      }
      else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    }

    const buyTokens = (etherAmount) => {
      loading.value = true
      ethSwap.value.methods.buyTokens().send({ value: etherAmount, from: account.value}).on('transactionHash', (hash) => {
        loading.value = false
      })
    }

    const sellTokens = (tokenAmount) => {
      loading.value = true
      token.value.methods.approve(ethSwap.value.address, tokenAmount).send({ from: account.value }).on('transactionHash', (hash) => {
        ethSwap.value.methods.sellTokens(tokenAmount).send({from: account.value }).on('transactionHash', (hash) => {
          loading.value = false
        })
      }) 
    }

    return { account, loading, ethBalance, tokenBalance, buyTokens, sellTokens }

  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
