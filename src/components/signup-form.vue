<template>
    <el-form>
        <InputField @updateField="user.email=$event; v$.email.$touch();" :text="user.email" label="Email" type="text">
        </InputField>
        <Alert :show="v$.email.$dirty&&!v$.email.$model">
            Email Is Required
        </Alert>
        <Alert :show="v$.email.$dirty&&v$.email.$error">
            Email Must Be In Avalid Format
        </Alert>
        <Alert :show="!!errMsg">{{errMsg}}</Alert>

        <InputField @updateField="user.password=$event; v$.password.$touch();" :text="user.password" label="Password" type="password">
        </InputField>
        <Alert :show="v$.password.$dirty&&!v$.password.$model">
            Password Is Required
        </Alert>
        <Alert :show="v$.password.$dirty&&v$.password.$invalid">
            {{ v$.password.minLength.$message }}
        </Alert>

        <InputField @updateField="user.confirmPassword=$event; v$.confirmPassword.$touch();" :text="user.confirmPassword" label="Confirm password" type="password">
        </InputField>
        <Alert :show="v$.confirmPassword.$dirty&&!v$.confirmPassword.$model">
            Confirm Password Is Required
        </Alert>
        <Alert :show="v$.confirmPassword.$dirty&&passwordOk">
            Confirm Password And Password Must Be Same
        </Alert>
    <el-form-item>
        <el-button :loading="loading" :disabled="v$.$invalid||passwordOk" type="success" @click="submitForm">Signup</el-button>
        <el-button @click="resetForm" type="warning" >Reset</el-button>
    </el-form-item>
    </el-form>
</template>
<script>
import { useVuelidate } from '@vuelidate/core'
import { email,required,minLength } from '@vuelidate/validators'
import {ref,reactive} from 'vue'
import Alert from '../components/alert.vue'
import InputField from '../components/input-field.vue'
import { err_Msg } from '../helpers/functions'
export default {
    components:{ Alert, InputField },
    setup(){
        var user = reactive({
            email:'',
            password:'',
            confirmPassword:''
        })
        const rules = {
            email: { required, email },
            password: { required, minLength:minLength(6) },
            confirmPassword: { required }
        }
        const v$ = useVuelidate(rules, user)
        const errMsg = ref(null)
        const loading = ref(false)

        return { user, errMsg, loading, v$ }
    },
    computed:{
        passwordOk(){
            return this.user.password != this.user.confirmPassword
        }
    },
    methods:{
        submitForm(){
            this.loading = true
            this.$axios.instance().post('user/signup',{...this.user}).then(response=>{
                const {message} = response.data
                this.loading = false
                this.resetForm()
                this.$notify({ title: 'Success', type:'success', message })
                this.$emit('registered')
            }).catch(err=>{
                this.loading = false
                if(err.response.status == 406){
                    const {message} = err.response.data
                    return this.errMsg = message
                }
                this.$notify({ title: 'Error', type:'error', message: err_Msg() })
                console.log(err)
            })
        },
        resetForm(){
            this.user.email=''
            this.user.password=''
            this.user.confirmPassword=''
            this.v$.$reset()
        }
    }
}
</script>