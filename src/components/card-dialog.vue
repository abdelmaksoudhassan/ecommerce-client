<template>
    <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 8px">
        <div class="hvr" @click="dialogTableVisible = true">
            <el-image class="vu-img" :src="getUrl(product.images[0])" style="margin-top: 10px;"></el-image>
        </div>
        <div class="data">
            <span>{{product.title}}</span>
            <span type="text">{{$filters.dollarSign(product.price)}}</span>
        </div>
        <CartBtn :productId="product._id" v-if="authStore.authenticated"></CartBtn>
    </el-card>
    <el-dialog :title="product.title" v-model="dialogTableVisible">
        <Slider :images="product.images" :interval="2000"></Slider>
        <div class="splitter"></div>
        <div><strong>Price : </strong>{{$filters.dollarSign(product.price)}}</div>
        <div><strong>Available Quantity :</strong>{{product.quantity}}</div>
        <div><strong>Category</strong>{{product.categoryId.title}}</div>
        <div>
            <strong>Description : </strong>
            <span>
                <li v-for="(item,index) in product.description" :key="index">
                {{item}}
                </li>
            </span>
        </div>
        <div><strong>Owner : </strong>{{product.publisherId.email}}</div>
        <div><strong>Created : </strong>{{$filters.fromNow(product.createdAt)}}</div>
        <div><strong>Updated : </strong>{{$filters.fromNow(product.updatedAt)}}</div>
    </el-dialog>
</template>
<script setup>
import {ref} from 'vue'
import Slider from './slider.vue'
import CartBtn from './cart-btn.vue'
import {useAuthStore} from '../stores/useAuthStore'
const dialogTableVisible=ref(false)
const authStore = useAuthStore()
defineProps({
    product:{
        type: Object,
        requiered: true
    }
})
const getUrl=(img)=>{
    return 'https://nodejs-ecommerce-o2e5.onrender.com/' + img
}
</script>
<style scoped>
 .vu-img{
    height: 200px;
  }
  @media (max-width: 500px) {
    .vu-img{
        height: 100px;
    }
}
.data{
    padding: 10px;
    display: flex;
    flex-direction: column;
}
.hvr{
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
}
  .hvr:hover{
    cursor: pointer;
    transition:500ms;
    opacity: 0.8;
  }</style>
