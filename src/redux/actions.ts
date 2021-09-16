import {
  SET_HEAD_TITLE,
  RECEIVE_USER,
  SHOW_ERROR_MSG,
  RESET_USER
} from './action-types'
import { removeUser } from '../utils/storageUtils'
import { reqLogin } from '../api'
import {saveUser} from '../utils/storageUtils'

export const setHeadTitle = (headTitle: string) => ({type: SET_HEAD_TITLE, data: headTitle})
/*
接收用户的同步action
 */
export const receiveUser = (user: any) => ({type: RECEIVE_USER, user})
/*
显示错误信息同步action
 */
export const showErrorMsg = (errorMsg: string) => ({type: SHOW_ERROR_MSG, errorMsg})

/*
退出登陆的同步action
 */
export const logout = () =>  {
  // 删除local中的user
  removeUser()
  // 返回action对象
  return {type: RESET_USER}
}


export const login = (value: any) => {
  return async (dispatch: Function) => {
    // 1. 执行异步ajax请求
    const result: any = await reqLogin(value)  // {status: 0, data: user} {status: 1, msg: 'xxx'}
    // 2.1. 如果成功, 分发成功的同步action
    if(result.status===0) {
      const user = result.data
      // 保存local中
      saveUser(user)
      // 分发接收用户的同步action
      dispatch(receiveUser(user))
    } else { // 2.2. 如果失败, 分发失败的同步action
      const msg = result.msg
      // message.error(msg)
      dispatch(showErrorMsg(msg))
    }
  }
}
