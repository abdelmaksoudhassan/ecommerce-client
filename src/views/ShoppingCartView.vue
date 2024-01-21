<template>
  <h1 class="center">Shopping Cart</h1>
  <div class="margin_h">
    <el-table :data="cart" v-loading="loading">
      <el-table-column fixed="left" label="Product">
        <template #default="scope">
          <div class="flex-col">
            <el-avatar shape="square" :size="50"  :src="'https://nodejs-ecommerce-kd41.onrender.com/'+scope.row.productId.images[0]"></el-avatar>
            <span>{{scope.row.productId.title}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="Quantity"></el-table-column>
      <el-table-column label="Price">
        <template #default="scope">
          {{$filters.dollarSign(scope.row.quantity*scope.row.productId.price)}}
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="scope">
          <DeleteBtn :id="scope.row.productId._id"></DeleteBtn>
        </template>
      </el-table-column>
    </el-table>
    <div class="mini-splitter"></div>
    <div>
      <strong>Total Price : </strong> {{$filters.dollarSign(totalPrice)}}
    </div>
    <div class="mini-splitter"></div>
    <div>
      <el-button :disabled="!totalPrice" type="primary" @click="goCheckOut">Check out</el-button>
      <el-button  :loading="clearing" :disabled="!totalPrice" type="danger" @click="clrCart">Clear Cart</el-button>
    </div>
  </div>
</template>
<script>
import {mapState,mapActions} from 'pinia'
import {useCartStore} from '../stores/useCartStore'
import {ref} from 'vue'
import Alert from '../components/alert.vue'
import DeleteBtn from '../components/delete-btn.vue'
import { err_Msg } from '../helpers/functions'
export default {
  components:{ Alert, DeleteBtn },
  computed:{
    ...mapState(useCartStore,['cart','totalPrice'])
  },
  setup(){
    const loading = ref(false)
    const clearing = ref(false)
    const cartStore = useCartStore()
    return{ clearing,cartStore,loading }
  },
  methods:{
    ...mapActions(useCartStore,['setCart','clearCart']),
    clrCart(){
      this.clearing = true
      this.$axios.authInstance().delete('/clear-cart').then(()=>{
        this.clearCart()
        this.clearing = false
      }).catch(err=>{
        this.$notify({ title: 'Error', type:'error', message: err_Msg() })
        console.log(err)
        this.clearing = false
      })
    },
    goCheckOut(){
      this.$router.push({name:'checkout'})
    }
  }
}
</script>
