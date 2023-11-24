import request from "@/utils/request";

const API = {
  LOGIN_URL: "/login",
  GET_USERINFO: '/user',
  KNOWLEDGE_GET_ALL: '/knowledge_base/findAll',
  KNOWLEDGE_CREATE: '/knowledge_base/create',
  KNOWLEDGE_UPDATE: '/knowledge_base',
  KNOWLEDGE_DELETE: '/knowledge_base',
  SETTING_SAVE: '/param/save',
  SEND_MESSAGE: '/chatcompletion_pro'
}

export const reqLogin = (data) => request.post(API.LOGIN_URL, data)
export const reqGetAllKnowledge = () => request.post(API.KNOWLEDGE_GET_ALL)
export const reqAddOrUpdateKnowledge = (data) => {
  if (data.id) {
    return request.put(API.KNOWLEDGE_UPDATE + `/${data.id}`, data)
  } else {
    return request.post(API.KNOWLEDGE_CREATE, data)
  }
}
export const reqDeleteKnowledge = (id) => request.delete(API.KNOWLEDGE_DELETE + `/${id}`)
export const reqSaveSetting = (data) => request.post(API.SETTING_SAVE, data)
export const reqSendMessage = (data) => request.post(API.SEND_MESSAGE + `/${data.user_id}`, data)

export const reqGetUserInfo = (id) => request.get(API.GET_USERINFO + `/${id}`)