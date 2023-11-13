<template>
  <el-menu :default-active="$route.name" mode="horizontal" :router="true">
    <el-menu-item index="home" :route="{name:'home'}">Home</el-menu-item>
    <el-menu-item index="cart" v-show="!!user" :route="{name:'cart'}">
      <span>Shopping Cart <span class="badge">{{ items }}</span></span>
    </el-menu-item>
    <el-menu-item index="myorders" v-show="!!user" :route="{name:'myorders'}">My Orders</el-menu-item>
    <el-menu-item index="Authentication" v-if="!user" :route="{name:'authentication'}">
      Authentication
    </el-menu-item>
    <el-menu-item index="profile" v-if="!!user" :route="{name:'profile'}">Profile</el-menu-item>
    <el-sub-menu index="home" trigger="click" v-if="!!user">
      <template #title>
        <span>{{name}}</span><el-avatar style="margin-left: 10px;" :size="40" :src="imageUrl"></el-avatar>
      </template>
      <logoutBtn></logoutBtn>
    </el-sub-menu>
  </el-menu>
</template>
<script setup>
import {useAuthStore} from '../stores/useAuthStore'
import {useCartStore} from '../stores/useCartStore'
import logoutBtn from './logout-btn.vue'
import {computed} from 'vue'

const items = computed(()=>{ return useCartStore().items})
const name= computed(()=>{ return useAuthStore().name })
const user= computed(()=>{ return useAuthStore().user })
const imageUrl= computed(()=>{ return useAuthStore().imageUrl })

</script>
<style scoped>
.badge{
  background-color: rgb(221, 47, 82);
  padding: 5px;
  color: white;
  border-radius: 30%;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
}
</style>
