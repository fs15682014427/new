// 用户仓库

import { defineStore } from 'pinia'
import { reqLogin, reqGetUserInfo } from '@/api/user'

let useUserStore = defineStore('User', {
  state: () => {
    return {
      token: localStorage.getItem('TOKEN'),
      userId: localStorage.getItem("ID"),
      userInfo: localStorage.getItem("userInfo"),
      messages: []
    }
  },
  actions: {
    // 用户登录
    async userLogin(data) {
      console.log('登录')
      let res = await reqLogin(data)
      if (res.code == 200) {
        this.token = res.data.token
        this.userId = res.data.id
        localStorage.setItem('TOKEN', res.data.token)
        localStorage.setItem("ID", res.data.id)
        localStorage.setItem("NickName", res.data.nick_name)
        return 'OK'
      } else {
        return Promise.reject(new Error(res.data.msg))
      }
    },
    async reqGetUserInfo() {
      let result = await reqGetUserInfo(this.userId)
      console.log(result);
      if (result.code == 200) {
        localStorage.setItem('userInfo', JSON.stringify(result))
        return result
      } else {
        return Promise.reject(new Error(res.data.msg))
      }
    },
    async setMessages(messages) {
      return this.messages = messages
    }
  },
  getters: {

  }
})

export default useUserStore