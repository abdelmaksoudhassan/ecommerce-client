<template>
    <el-button type="danger" :loading="removing" plain @click="removeIt()">X</el-button>
</template>
<script>
import {ref} from 'vue'
import {mapActions} from 'pinia'
import {useCartStore} from '../stores/useCartStore'
import {err_Msg} from '../helpers/functions'
export default{
    setup(){
        const removing = ref(false)
        return { removing }
    },
    props:{
        id:{
            required: true,
            type: String
        }
    },
    methods:{
        ...mapActions(useCartStore,['setCart']),
        removeIt(){
            this.removing = true
            this.$axios.authInstance().delete(`/remove-from-cart/${this.id}`).then(res=>{
                this.setCart(res.data)
                this.removing = false
            }).catch(err=>{
                this.$notify({ title: 'Error', type:'error', message: err_Msg() })
                console.log(err)
                this.removing = false
            })
        },
    }
}
</script>