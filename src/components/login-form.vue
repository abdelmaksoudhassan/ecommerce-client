<template>
    <el-form>
        <InputField @updateField="user.email=$event" @inFocus="errMsg=null" :text="user.email" label="Email" type="text">
        </InputField>

        <InputField @updateField="user.password=$event" @inFocus="errMsg=null"  :text="user.password" label="Password" type="password">
        </InputField>

        <Alert :show="!!errMsg">{{ errMsg }}</Alert>
        
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="loading">Login</el-button>
            <el-button type="danger" @click="resetForm" >Reset</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import {reactive,ref} from 'vue'
import Alert from '../components/alert.vue'
import InputField from '../components/input-field.vue'
import { useAuthStore } from '../stores/useAuthStore'
import { useCartStore } from '../stores/useCartStore'
import { saveToken, err_Msg } from '../helpers/functions'
import { io } from '../helpers/socket'
export default{
    components:{ InputField, Alert },
    setup(){
        const authStore = useAuthStore()
        const cartStore = useCartStore()
        const user = reactive({
            email:'user@gmail.com',
            password:'123456'
        })
        const errMsg = ref(null)
        const loading = ref(false)
        return { authStore, user, errMsg, loading,cartStore }
    },
    methods:{
        resetForm(){
            user.email=''
            user.password=''
        },
        submitForm(){
            this.loading = true
            this.$axios.instance().post('/user/login',{...this.user}).then(response=>{
                this.loading = false
                const {token,user} = response.data
                const {cart} = user
                delete user.cart
                saveToken(token)
                this.authStore.$patch({user,authenticated:true})
                this.cartStore.$patch({cart})
                this.$router.back()
                io.connect()  // connect socket
            }).catch(error=>{
                this.loading = false
                if(error.response.status == 401 || error.response.status == 404){
                    return this.errMsg = error.response.data.message
                }
                this.$notify({ title: 'Error', type:'error', message: err_Msg() })
                console.log(error)
            })
        }
    }
}
</script>
