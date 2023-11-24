<template>
  <div style="display: flex;flex-direction: column;align-items: center;width: 100%;height: 100%;background-color: #ccc;">
    <div style="width: 70%;height: 100%;" class="home-container">
      <el-row style="flex: 1;">
        <el-col style="display: flex;flex-direction: column;" :span="6">
          <h3>参数设置</h3>
          <div>
            <p title="插件自由度">插件自由度</p>
            <el-slider style="width: 200px;" :show-tooltip="notShow" v-model="maxItem" />
          </div>
          <div style="display: flex;flex-direction: row;align-items: center;">
            <p style="margin-right: 50px;" title="开启流式输出">流式输出</p>
            <el-switch v-model="stream" />
          </div>
          <div>
            <p>ins</p>
            <el-select placeholder="none" v-model="ins">
              <el-option v-for="item in inses" :key="item.label" :label="item.label" :value="item.value">{{ item.label
              }}</el-option>
            </el-select>
          </div>
        </el-col>
        <el-col style="display: flex;flex-direction: column;" :span="18">
          <div style="display: flex;flex-direction: row;align-items: center;">
            <img class="home-logo" src="../../assets/img/th.jpg" alt="">
            <div style="display: flex;flex-direction: column;">
              <h3 style="text-align: left;">山海百科</h3>
              <p style="margin: 0;color: #9e9e9e;">chatcompletion_pro所基于的模型abab5.5-chat</p>
            </div>
          </div>
          <!-- chat -->
          <div class="home-chat-container">
            <div class="home-chat">
              <div class="home-chat-user">
                <div ref="scorllContainer" @scroll="handleScorll" style="overflow-y: scroll;">
                  <div v-for="item in messagesInfo" :key="item.timestep">
                    <div v-show="item.user"
                      style="display: flex;flex-direction: row; justify-content: flex-end;width: 100%;">
                      <div>
                        <div class="message-text">{{ item.text }}</div>
                        <div class="message-user">
                          <p style="color: #656873;margin-right: 10px;">{{ nick_name }}</p>
                          <p style="margin-right: 10px;">{{ item.time }}</p>
                          <img class="user-avatar" src="../../assets/img/emoji/clown-face.png" alt="">
                        </div>
                      </div>
                    </div>
                    <div v-show="!item.user"
                      style="display: flex;flex-direction: row;justify-content: flex-start;width: 100%;">
                      <div class="message-box">
                        <div class="message-backend-text" id="bufferString">{{ item.text }}
                        </div>
                        <div class="message-user">
                          <img style="margin-right: 10px;" class="user-avatar" src="../../assets/img/emoji/clown-face.png"
                            alt="">
                          <p style="margin-right: 10px;">{{ name }}</p>
                          <p style="color: #656873;,margin-left: 10px;">{{ item.time }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div class="send-box">
                <el-input :rows="1" :disabled="isDisabled" ref="sendIpt" style="flex: 1;font-size: 20px;"
                  @keydown.enter="keyDown" v-model="chatIpt" type="textarea"></el-input>
                <div @click="handleSendMessage" class="send-btn">
                  <img style="width: 70%;height: 70%;" src="../../assets/img/emoji/rocket.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </el-col>

      </el-row>
    </div>
  </div>
</template>
<script setup>
// import { ref } from 'vue'
import { reqSendMessage } from '@/api/user'
import useUserStore from '@/store/modules/user'
import { getNowTime } from '../../utils/util'
const userStore = useUserStore()
import { ref, reactive, computed, nextTick, watch, VueElement, watchEffect } from 'vue'
const ins = ref('')
const inses = reactive([{ label: 'bm25', value: 'bm25' }, { label: 'embedding', value: 'embedding' }, { label: 'none', value: 'null' }])
const maxItem = ref(0)
const stream = ref(true)
const chatIpt = ref('')
const notShow = ref(false)
const messagesInfo = ref([])
const homeChatUser = ref()
const isDisabled = ref(false)
const name = localStorage.getItem("name")
const id = localStorage.getItem("ID")
const nick_name = localStorage.getItem("NickName")
// let transfer = ref('')
let allMessages = reactive([])
const sendIpt = ref()
// const option = reactive({})
const scorllContainer = ref()

const sendMessageParams = reactive({
  user_id: localStorage.getItem("ID"),
  stream: stream.value,
  ins: ins.value,
  max_items: Math.ceil(maxItem.value / 100 * 5),
  messages: []
})
// watch(scorllContainer, (val, newVal) => {
//   if (val.offsetHeight) {
//     val.scrollTop = val.scrollHeight - val.offsetHeight
//   }
// })
const keyDown = () => {
  handleSendMessage()
}
const handleSendMessage = async () => {
  isDisabled.value = true
  if (chatIpt.value) {
    let userQuestion = {}
    userQuestion.text = chatIpt.value
    userQuestion.timestep = Date.now()
    userQuestion.user = true
    userQuestion.time = getNowTime()
    messagesInfo.value.push(userQuestion)
    sendMessageParams.messages.push({
      user: true,
      sender_name: nick_name,
      sender_type: 'USER',
      text: userQuestion.text
    })
    sendMessageParams.stream = stream.value
    if (sendMessageParams.ins === '') {
      sendMessageParams.ins = 'null'
    }
    if (sendMessageParams.max_items === 0) {
      sendMessageParams.max_items = 1
    }
    if (!sendMessageParams.stream) {
      let res = await reqSendMessage(sendMessageParams)
      if (res) {
        let option = {}
        option.text = res.reply
        option.time = getNowTime()
        messagesInfo.value.push(option)
        sendMessageParams.messages.push({
          sender_name: name,
          sender_type: 'BOT',
          text: option.text
        })
      }
      nextTick(() => {
        isDisabled.value = false
        sendIpt.value.focus()
        scorllContainer.value.scrollTop = scorllContainer.value.scrollHeight - scorllContainer.value.offsetHeight
      })
    } else {
      const url = `/api/chatcompletion_pro/${id}`
      async function getResponse(content) {
        let data = JSON.stringify({ ...content });
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userStore.token}`
          },
          body: data
        })
        const reader = await res.body.getReader()
        const decoder = new TextDecoder()
        const option = reactive({})
        option.text = "";
        isDisabled.value = true
        let reg = true
        let resData = "";
        while (1) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }
          if (reg) {
            option.time = getNowTime()
            messagesInfo.value.push(option)
            reg = false
          }
          const text = decoder.decode(value)
          // console.log(text);
          let jsonData;
          try {
            jsonData = JSON.parse(text.substring(5))
          } catch (err) {
            resData += text;
            // console.log(resData, "--------------");
            try {
              jsonData = JSON.parse(resData.substring(5))
              resData = "";
            } catch (err) {
              continue;
            }
          }
          if (jsonData.choices) {
            for (let i = 0; i < jsonData.choices.length; i++) {
              let choise = jsonData.choices[i];
              if (choise.finish_reason === 'stop') {
                break;
              }
              if (choise.messages) {
                for (let j = 0; j < choise.messages.length; j++) {
                  option.text = option.text + choise.messages[j].text
                  // watchEffect(() => {

                  //   scorllContainer.value.scrollTop = scorllContainer.value.scrollHeight - scorllContainer.value.offsetHeight + 30
                  // })
                }
              }
            }
          }
          else {
            ElMessageBox.alert('系统错误', '错误', {
              confirmButtonText: 'OK',
              callback: (action) => {
                ElMessage({
                  type: 'error',
                  message: `action: ${action}`,
                })
              },
            })
            break
          }

          scorllContainer.value.scrollTop = scorllContainer.value.scrollHeight - scorllContainer.value.offsetHeight
        }
        sendMessageParams.messages.push({
          sender_name: name,
          sender_type: 'BOT',
          text: option.text
        })
        nextTick(() => {
          sendIpt.value.focus()
        })
        isDisabled.value = false
      }
      getResponse(sendMessageParams)

      // for (let i = 0; i < messagesInfo.value.length; i++) {
      //   if (!messagesInfo.value[i].user) {
      //     messagesInfo.value[i].sender_type = 'BOT',
      //       messagesInfo.value[i].sender_name = name
      //   } else {
      //     messagesInfo.value[i].sender_type = 'USER',
      //       messagesInfo.value[i].sender_name = nick_name
      //   }
      //   allMessages.push(messagesInfo.value[i])
      // }

      // sendMessageParams.messages = allMessages
      // allMessages = []
      // console.log(sendMessageParams, '接口入参');
    }
  }

  chatIpt.value = ''
  // scrollBottom()
  // console.log(sendMessageParams);
}
// computed(() => {
//   return questionArr
// })
// let write = (words, container) => {
//   if (words.length > 0) {
//     let span = document.createElement("span")
//     let del = words.shift()
//     span.innerHTML = del
//     container.appendChild(span)
//   }
// }
</script>



<style scoped lang="scss">
.home-container {
  background-color: #272a37;
  padding: 20px;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
  // overflow-y: scroll;
  position: relative;

  :deep(.el-switch__core) {
    width: 50px;
  }

  .user-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  .message-user {
    display: flex;
    flex-direction: row;
    text-align: right;
    align-items: center;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .home-chat-container {
    // height: 100%;
    flex: 1;
    box-sizing: border-box;
    padding: 10px;

    // padding-right: 10px;


    .home-chat {
      height: 100%;
      background-color: rgb(50, 54, 68);
      border-radius: 40px;
      // padding: 30px;
      display: flex;
      padding: 20px;
      flex-direction: column;



      .home-chat-user {
        // overflow-y: hidden;
        // height: 100%;
        flex: 1 0 auto;
        height: 0;
        padding: 20px;
        display: flex;
        flex-direction: column;
        // overflow-y: scroll;

        .message-text {
          padding: 15px;
          max-width: 90%;
          border-radius: 20px 20px 5px 20px;
          background-color: #95ec69;
          color: #000;
          font-size: 14px;
          word-break: break-all;
          // display: flex;
        }

        .message-box {
          display: flex;
          flex-direction: column;



          .message-backend-text {
            padding: 15px;
            max-width: 90%;
            border-radius: 20px 20px 20px 5px;
            background-color: #fff;
            color: #000;
            font-size: 14px;
            word-break: break-all;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }


        }
      }

      .send-box {
        width: 100%;
        padding: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        max-height: 150px;
        // position: absolute;
        right: 20px;
        bottom: 40px;
        height: 85px;

        .send-btn {
          width: 45px;
          height: 45px;
          background-color: #08f;
          margin-left: 20px;
          border-radius: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

      }
    }
  }

  .home-logo {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    border: 2px solid #fff;
    margin-right: 20px;
  }

  h4,
  h3 {
    margin: 0;
    color: #fff;
  }

  h3 {
    text-align: center;

  }
}
</style>



