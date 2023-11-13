<template>
    <h1 class="center">My Orders</h1>
    <div  v-loading="loading" class="margin_h">
        <Accordion :arr="orders"></Accordion>
    </div>
</template>
<script>
import Accordion from '../components/accordion.vue'
import { ref } from 'vue'
import {err_Msg} from '../helpers/functions'
import {io} from '../helpers/socket'
export default{
    components:{ Accordion },
    setup(){
        const orders = ref([])
        const loading = ref(false)
        return { orders, loading }
    },
    created(){
        this.loading = true
        this.$axios.authInstance().get('/my-orders').then(res=>{
            this.orders = res.data
            this.loading = false
        }).catch(err=>{
            this.$notify({ title: 'Error', type:'error', message: err_Msg() })
            console.log(err)
            this.loading = false
        })
    },
    mounted(){
        io.on('removeOrder',(id)=>{
            console.log(this.orders)
            this.orders = this.orders.filter(order=> order._id != id)
            this.$message({message: `one order deleted`, type: 'error', showClose: true })
            console.log(this.orders)
        }),
        io.on('removeAllOrders',()=>{
            this.orders = []
            this.total=0
            this.currentPage =1
            this.$message({message: `all orders removed`, type: 'error', showClose: true })
        })
    }
}
</script>