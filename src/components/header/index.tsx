import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'

import './index.less'
import LinkButton from '../link-button'
import memoryUtils from '../../utils/memoryUtils'
import { removeUser } from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
import { formateDate } from '../../utils/fomateDate'
import { reqWeather } from '../../api'
import { useHistory, useLocation } from 'react-router-dom'

interface weatherInf {
  temperature: string;
  weather: string;
}

const Header = () => {

  const location = useLocation();
  const history = useHistory();
  const [currentTime, setcur] = useState(formateDate(Date.now()));
  const [weather, setweather] = useState({
    temperature: "",
    weather: "",
  })

  let intervalId: NodeJS.Timeout;

  useEffect(() => {
    getTime();
    getWeather();
    return () => {
      clearInterval(intervalId)
    }
  }, [])
  const getTime = () => {
    // 每隔1s获取当前时间, 并更新状态数据currentTime
    intervalId = setInterval(() => {
      const cur = formateDate(Date.now());
      setcur(cur);
    }, 1000)
  }
  const getWeather = async () => {
    const { temperature, weather } = await reqWeather('110000') as weatherInf;
    setweather({ temperature, weather });
  }

  const getTitle = () => {
    const path = location.pathname;
    let title;
    menuList.forEach((cItem) => {
      if (cItem.key === path) {
        title = cItem.title;
      } else if (cItem.children) {
        // 在所有子item中查找匹配的
        const it = cItem.children.find(cIt => path.indexOf(cIt.key) === 0)
        // 如果有值才说明有匹配的
        if (it) {
          // 取出它的title
          title = it.title;
        }
      }
    })
    return title;
  }

  const logout = () => {
    // 显示确认框
    Modal.confirm({
      content: '确定退出吗?',
      onOk: () => {
        // 删除保存的user数据
        removeUser();
        memoryUtils.user = {}
        // 跳转到login
        history.replace('/login')
      }
    })
  }
  const user: any = memoryUtils.user;
  return (
    <div className='header'>
      <div className="header">
        <div className="header-top">
          <span>欢迎, {user.username}</span>
          <LinkButton onClick={logout} >退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{getTitle()}</div>
          <div className="header-bottom-right">
            <span style={{ marginRight: "30px" }}>{currentTime}</span>
            <span>{weather.temperature}℃</span>
            <span>{weather.weather}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Header;