import axios from 'axios';
import { message } from 'antd';

const ajax = (url: string, data={}, type="GET") => {
  let promise;
  return new Promise((resolve,reject) => {
    if(type === 'GET') {
      promise =  axios.get(url, {
        params: data
      })
    } else {
      promise = axios.post(url, data);
    }

    promise.then((res) => {
      resolve(res.data);
    }).catch((err) => {
      message.error('请求出错了: ' + err.message);
    })
  })
  
}

export default ajax;