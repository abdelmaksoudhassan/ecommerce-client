<template>
  <div class="padding_v margin_h">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="Signup" name="Signup">
        <SignupForm @registered="activeName = 'Login'"></SignupForm>
      </el-tab-pane>
      <el-tab-pane label="Login" name="Login">
        <loginForm></loginForm>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import {ref} from 'vue'
import SignupForm from '../components/signup-form.vue'
import loginForm from '../components/login-form.vue'

const activeName = ref('Login')

</script>