<template>
  <NavBar></NavBar>
  <RouterView />
</template>
<script>
import { RouterView } from 'vue-router'
import {useAuthStore} from './stores/useAuthStore'
import {useCartStore} from './stores/useCartStore'
import NavBar from './components/nav-bar.vue'
import { io } from './helpers/socket'
export default{
  components:{ NavBar },
  setup(){
    const authStore = useAuthStore()
    const cartStore = useCartStore()
    return { authStore,cartStore }
  },
  async created(){
    try{
      const user = (await this.$axios.authInstance().post('/user/auto-login')).data
      const {cart} = user
      delete user.cart
      this.authStore.$patch({user,authenticated:true})
      this.cartStore.$patch({cart})
      io.connect()  // connect socket
    }
    catch(e){
      return
    }
  },
}
</script>