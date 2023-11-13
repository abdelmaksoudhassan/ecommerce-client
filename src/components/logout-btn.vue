<template>
    <el-button type="danger" style="width: 100%;" @click="logout">Log Out</el-button>
</template>
<script>
import {useAuthStore} from '../stores/useAuthStore'
import {useCartStore} from '../stores/useCartStore'
import {clearToken,err_Msg} from '../helpers/functions'
import { io } from '../helpers/socket'

export default{
  methods:{
    logout(){
      this.$axios.authInstance().post('/user/logout').then(()=>{
        useAuthStore().$reset()
        useCartStore().$reset()
        this.$router.push({name:'home'})
        clearToken()
        io.disconnect()
      }).catch(err=>{
        this.$notify({ title: 'Error', type:'error', message: err_Msg() })
        console.log(err)
      })
      }
  }
}
</script>