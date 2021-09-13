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

// 获取商品分页列表
export const reqProducts = (pageNum=1, pageSize=3) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId="0", status=1) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')

// 添加/更新用户
export const reqAddOrUpdateUser = (user: any) => ajax(BASE + '/manage/user/'+(user._id? 'update' : 'add'), user, 'POST')
// 删除指定名称的图片
export const reqDeleteImg = (name: any) => ajax(BASE + '/manage/img/delete', {name}, 'POST')
// 添加/修改商品
export const reqAddOrUpdateProduct = (product: any) => ajax(BASE + '/manage/product/' + ( product._id?'update':'add'), product, 'POST')
/*
搜索商品分页列表 (根据商品名称/商品描述)
searchType: 搜索的类型, productName/productDesc
 */
export const reqSearchProducts = (pageNum=1, pageSize=3, searchName="", searchType="productName") => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName,
})
// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')
// 添加角色
export const reqAddRole = (roleName: any) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')
// 添加角色
export const reqUpdateRole = (role: any) => ajax(BASE + '/manage/role/update', role, 'POST')


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