<template>
    <h1 class="center">Checkout</h1>
        <div class="margin_h" style="font-size: large;">
            <el-card>
                <div>
                <h2>Order Summary</h2>
                <span>You have <strong>{{items}}</strong> items in your shopping cart</span>
                </div>
                <div class="mini-splitter"></div>
                <ol style="list-style:upper-roman;">
                    <li v-for="(item,index) in cart" :key="index">
                        ({{ item.quantity }}) {{ item.productId.title }} with Price
                        {{ $filters.dollarSign(item.quantity * item.productId.price)}}
                    </li>
                </ol>
                <el-divider></el-divider>
                <div>
                <strong>Total : </strong> {{$filters.dollarSign(totalPrice)}}
                </div>
            </el-card>
            <div class="mini-splitter"></div>
            <el-button :disabled="emptyCart" type="warning" plain @click="makeOrder" :loading="loading">
                <el-icon><Position /></el-icon> Make order
            </el-button>
        </div>
</template>
<script>
import { useCartStore } from '../stores/useCartStore'
import {ref} from 'vue'
import { mapState } from 'pinia'
import {err_Msg} from '../helpers/functions'

export default{
    setup(){
        const loading = ref(false)
        const cartStore = useCartStore()
        return { loading, cartStore }
    },
    computed:{
        ...mapState(useCartStore,['items','cart','totalPrice']),
        emptyCart(){
            return (this.cart.length == 0 ? true : false)
        }
    },
    methods:{
        makeOrder(){
            this.loading = true
            this.$axios.authInstance().post('/order').then((res)=>{
                this.cartStore.$reset()
                this.loading = false
                this.$notify({ title: 'Success', type:'success', message: 'order sent' })
            }).catch(err=>{
                this.$notify({ title: 'Error', type:'error', message: err_Msg() })
                console.log(err)
                loading.value = false
            })
        }
    }
}
</script>