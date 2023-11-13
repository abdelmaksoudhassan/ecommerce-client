<template>
    <el-carousel :interval="interval" height="150px">
        <el-carousel-item v-for="(image,index) in images" :key="index" style="display: flex; justify-content: center;">
            <el-image :src="getUrl(image)"></el-image>
        </el-carousel-item>
    </el-carousel>
</template>
<script setup>
    defineProps({
        interval:{
            type:Number,
            required: true
        },
        images:{
            type:Array,
            required:true
        }
    })
    const getUrl=(image)=>{
        return 'https://nodejs-ecommerce-o2e5.onrender.com/'+image
    }
</script>
<style>
.el-carousel__item {
  width: unset;
}
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>