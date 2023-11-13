<template>
    <h1 class="center">Profile Setting</h1>
        <div class="padding_v">
            <!-- change avatar -->
            <div class="center">
                <UploadImage
                    :url=url
                    :headers="headers"
                    @imageChanged="changeImage"
                >
                </UploadImage>
                <span><b>change profile</b></span>
            </div>
            <!-- change name -->
            <div class="splitter"></div>
            <el-form class="margin_h">
                <InputField @updateField="name.first=$event; v$_name.first.$touch();" :text="name.first" label="Fisrt Name" type="text">
                </InputField>
                <Alert :show="v$_name.first.$dirty&&!v$_name.first.$model">
                    First Name Is Required
                </Alert>
                <Alert :show="v$_name.first.minLength.$invalid && v$_name.first.$dirty">
                    {{ v$_name.first.minLength.$message }}
                </Alert>
                <Alert :show="v$_name.first.maxLength.$invalid && v$_name.first.$dirty">
                    {{ v$_name.first.maxLength.$message }}
                </Alert>
                <Alert :show="v$_name.first.alpha.$invalid &&v$_name.first.$dirty">
                    First Name Must Be Only Letters
                </Alert>

                <InputField @updateField="name.last=$event; v$_name.last.$touch();" :text="name.last" label="Last Name" type="text">
                </InputField>
                <Alert :show="v$_name.last.$dirty&&!v$_name.last.$model">
                    Last Name Is Required
                </Alert>
                <Alert :show="v$_name.last.minLength.$invalid && v$_name.last.$dirty">
                    {{ v$_name.last.minLength.$message }}
                </Alert>
                <Alert :show="v$_name.last.maxLength.$invalid && v$_name.last.$dirty">
                    {{ v$_name.last.maxLength.$message }}
                </Alert>
                <Alert :show="v$_name.last.alpha.$invalid &&v$_name.last.$dirty">
                    Last Name Must Be Only Letters
                </Alert>
                <el-form-item>
                    <el-button :loading="loading" :disabled="v$_name.$invalid" type="success" @click="submitForm">Save</el-button>
                    <el-button @click="resetNameForm" type="warning">Reset</el-button>
                </el-form-item>
            </el-form>
            <!-- change password -->
            <div class="splitter"></div>
            <el-form class="margin_h">
            <InputField @updateField="password.old=$event" @inFocus="errMsg=''" :text="password.old" label="Old Password" type="password">
            </InputField>
            <Alert :show="!!errMsg">{{ errMsg }}</Alert>

            <InputField @updateField="password.new=$event; v$_password.new.$touch();" :text="password.new" label="New Password" type="password">
            </InputField>
            <Alert :show="v$_password.new.$dirty && !v$_password.new.$model">
                Confirm Password Is Required
            </Alert>
            <Alert :show="v$_password.new.minLength.$invalid && v$_password.new.$dirty">
                {{ v$_password.new.minLength.$message }}
            </Alert>
            <el-form-item>
                <el-button :loading="ploading"  :disabled="v$_password.$invalid" type="success" @click="submitPassword">Save</el-button>
                <el-button @click="resetPasswordForm" type="warning">Reset</el-button>
            </el-form-item>
            </el-form>
            <!-- delete account -->
            <div class="splitter"></div>
            <el-button :loading="deleting" @click="deleteMyAccount" type="danger" class="margin_h">
                <el-icon :size="20" style="margin-right: 5px;">
                    <Delete />
                </el-icon>
                Delete my account
            </el-button>
        </div>
</template>
<script>
import UploadImage from '../components/upload-image.vue'
import InputField from '../components/input-field.vue'
import Alert from '../components/alert.vue'
import {ref,reactive} from 'vue'
import { getToken,err_Msg,clearToken } from '../helpers/functions'
import { useAuthStore } from '../stores/useAuthStore'
import { useCartStore } from '../stores/useCartStore'
import { useVuelidate } from '@vuelidate/core'
import { required,minLength,maxLength,alpha } from '@vuelidate/validators'
import { mapActions } from 'pinia'
export default {
    components:{ UploadImage,InputField,Alert },
    setup(){
        const url = ref("https://nodejs-ecommerce-o2e5.onrender.com/user/change-photo")
        const headers = reactive({ 'Token': getToken() })
        const name = reactive({ first:'', last:'' })
        const password = reactive({ old:'', new:'' })
        const deleting = ref(false)
        const loading = ref(false)
        const ploading = ref(false)
        const errMsg = ref('')
        const authStore = useAuthStore()
        const cartStore = useCartStore()
        const nameRules = {
            first:{
                required,
                minLength:minLength(3),
                maxLength:maxLength(10),
                alpha
            },
            last:{
                required,
                minLength:minLength(3),
                maxLength:maxLength(10),
                alpha
            }
        }
        const passwordRules= {
            new:{
                required,
                minLength:minLength(6)
            }
        }
        const v$_name = useVuelidate(nameRules,name)
        const v$_password = useVuelidate(passwordRules, password)
        return{ 
            url,headers,authStore,name,password,loading,ploading,v$_name,v$_password,deleting,errMsg,cartStore
        }
    },
    methods:{
        ...mapActions(useAuthStore,['changeName']),
        changeImage(event){
            this.authStore.changeImage(event)
        },
        submitForm(){
            this.loading = true
            this.$axios.authInstance().patch('/user/change-name',{
                firstName:this.name.first,
                lastName:this.name.last
            }).then(response=>{
                this.loading = false
                const {firstName,lastName} = response.data
                this.changeName(firstName,lastName)
                this.$notify({ title: 'Success', message: 'User Name Updated', type:'success' });
                this.resetNameForm()
            }).catch(err=>{
                this.$notify({ title: 'Error', message: err_Msg(), type:'error' });
                console.log(err)
                this.loading = false
            })
        },
        resetNameForm(){
            this.name.first=''
            this.name.last=''
            this.v$_name.$reset()
        },
        submitPassword(){
            this.ploading = true
            this.$axios.authInstance().patch('/user/change-password',{
                oldPassword:this.password.old,
                newPassword:this.password.new
            }).then(()=>{
                this.ploading = false
                this.resetForm()
                this.$notify({ title: 'Success',message: 'Password Updated',type:'success' });
            }).catch(err=>{
                this.ploading = false
                if(err.response.status == 401){
                    const message = err.response.data.message
                    this.errMsg = message
                    return
                }
                this.$notify({ title: 'Error', message: err_Msg(), type:'error' });
                console.log(err)
            })
        },
        resetPasswordForm(){
            this.password.old=''
            this.password.new=''
            this.v$_password.$reset()
        },
        deleteMyAccount(){
            this.deleting = true
            this.$axios.authInstance().delete('/user/delete-my-account').then(res=>{
                this.deleting = false
                const {message} = res.data
                this.$notify({ title: 'Warning', message, type:'warning' });
                this.$router.push('/')
                this.authStore.$reset()
                this.cartStore.$reset()
                clearToken()
            }).catch(err=>{
                this.$notify({ title: 'Error', message: err_Msg(), type:'error' });
                console.log(err)
                this.deleting = false
            })
        }
    }
}
</script>