<template>
  <el-collapse v-model="activeName" accordion v-if="arr.length > 0">
    <el-collapse-item v-for="(item,index) in arr" :title="$filters.fromNow(item.createdAt)" :name="index">
        <ol style="list-style:upper-roman;">
          <li v-for="(product,idx) in item.products" :key="idx" style="font-size: 15px">
            ( {{ product.quantity }} ) {{ product.productId.title }} with Price
            {{ $filters.dollarSign(product.quantity * product.productId.price)}}
          </li>
        </ol>
    </el-collapse-item>
  </el-collapse>
  <Alert type="info" :show="arr.length == 0">Empty orders list</Alert>
</template>
<script setup>
import { ref } from 'vue'
import Alert from '../components/alert.vue'
const activeName = ref('0')
defineProps({
  arr:{
    type: Array,
    required: true
  }
})
</script>