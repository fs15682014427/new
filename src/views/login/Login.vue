<script setup>
import { ref } from "vue";
import { User, Lock } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'
import { useRouter } from "vue-router";
import { ElNotification } from 'element-plus'
import { validPhone } from '@/utils/validate'

let router = useRouter()
let userStore = useUserStore()
let loginForm = ref({
  phone: "18892238280",
  password: "123456",
});
let loginForms = ref()

const validatorUsername = (rule, value, callback) => {
  if (value == '') {
    callback(new Error('请输入账号'))
  } else if (!validPhone(value)) {
    callback(new Error('手机号码格式错误'))
  } else {
    callback()
  }
}

const validatorPassword = (rule, value, callback) => {
  if (value == '') {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}

const rules = {
  phone: [{ trigger: 'blur', validator: validatorUsername }],
  password: [{ trigger: 'blur', validator: validatorPassword }]
}

const onClickLogin = async () => {
  router.push('/setting')
  // if(!loginForms.value.validate()) return
  try {
    await userStore.userLogin(loginForm.value)
    await userStore.reqGetUserInfo()

  } catch (error) {
    console.log(error, 'error')
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-content">
        <el-row>
          <el-col :span="12">
            <div style="font-size: 0;">
              <img src="@/assets/bgimg.png" alt="" />
            </div>
          </el-col>
          <el-col :span="12" class="login-col">
            <div class="login-form">
              <h1>后台管理系统</h1>
              <el-form :model="loginForm" :rules="rules" ref="loginForms">
                <el-form-item prop="phone">
                  <el-input v-model="loginForm.phone" type="text" :prefix-icon="User" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="loginForm.password" type="password" :prefix-icon="Lock" placeholder="请输入密码"
                    show-password></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" class="login-btn" @click="onClickLogin">登录</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/style/login.scss";
</style>
