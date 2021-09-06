import { message } from 'antd'
import ajax from './ajax'
import jsonp from 'jsonp'

// const BASE = 'http://localhost:5000'
const BASE = ''

export const reqLogin = (data = {}) => ajax(BASE + "/login", data, "POST");

// 获取一级/二级分类的列表
export const reqCategorys = (parentId="0") => ajax(BASE + '/manage/category/list', {parentId})

// 添加分类
export const reqAddCategory = (categoryName="", parentId=0) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')

// 更新分类
export const reqUpdateCategory = (categoryId="", categoryName="") => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

// 获取一个分类
export const reqCategory = (categoryId="") => ajax(BASE + '/manage/category/info', {categoryId})

export const reqWeather = (city = "110000") => {

  return new Promise((resolve, reject) => {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=155f75bc3157029fc2da5ed6271ad14c&city=${city}`
    // 发送jsonp请求
    jsonp(url, {}, (err, data) => {
      console.log('jsonp()', err, data)
      //如果成功了
      if (!err && data.info === "OK") {
        // 取出需要的数据
        const { temperature, weather } = data.lives[0];
        resolve({ temperature, weather })
      } else {
        // 如果失败了
        message.error('获取天气信息失败!')
      }
    })
  })
}