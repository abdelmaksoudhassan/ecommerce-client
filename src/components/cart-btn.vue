<template>
    <div v-loading="loading">
        <el-row v-if="counter == 0">
            <el-button class="add" type="primary" @click="startConter()" size="small" icon="el-icon-shopping-cart-1">Add</el-button>
        </el-row>
        <el-row v-else>
            <div class="after-add">
                <el-button type="warning" @click="decreaseCounter()" size="small">-</el-button>
                <span>{{counter}}</span>
                <el-button type="info" @click="increaseCounter()" size="small">+</el-button>
            </div>
        </el-row>
    </div>
</template>
<script>
import {ref} from 'vue'
import { mapState,mapActions } from 'pinia'
import {useCartStore} from '../stores/useCartStore'
import {err_Msg} from '../helpers/functions'
export default {
    props:{
        productId:{
            required:true,
            type:String
        }
    },
    setup(){
        const counter=ref(0)
        const loading=ref(false)
        return{ counter,loading }
    },
    computed:{
        ...mapState(useCartStore,['cart'])
    },
    created(){
        this.loading = true
        setTimeout(()=>{
            for (let index = 0; index < this.cart.length; index++) {
                const element = this.cart[index];
                if(element.productId._id == this.productId){
                    this.counter = element.quantity
                    break
                }else{
                    continue
                }
            }
            this.loading = false
        },1000)
    },
    methods:{
        ...mapActions(useCartStore,['setCart']),
        startConter(){
            this.loading = true
            this.$axios.authInstance().post(`add-to-cart/${this.productId}`).then(response=>{
                this.loading = false
                this.counter = 1
                this.setCart(response.data)
            }).catch(err=>{
                this.$message.error(err_Msg());
                console.log(err)
                this.loading = false
            })
        },
        increaseCounter(){
            this.loading = true
            this.$axios.authInstance().post(`add-to-cart/${this.productId}`).then(response=>{
                this.loading = false
                this.counter += 1
                this.setCart(response.data)
            }).catch(err=>{
                console.log(err)
                this.$message.error(err.response.data.message || err_Msg());
                this.loading = false
            })
        },
        decreaseCounter(){
            this.loading = true
            this.$axios.authInstance().post(`decrease-quantity/${this.productId}`).then(response=>{
                this.loading = false
                this.counter -= 1
                this.setCart(response.data)
            }).catch(err=>{
                this.$message.error(err.response.data.message || err_Msg());
                console.log(err)
                this.loading = false
            })
        }
    }
}
</script>
<style scoped>
.add{
    width: 100%;
}
.after-add{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>