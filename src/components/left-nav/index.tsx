import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'antd';
import * as Icon from '@ant-design/icons'
import './index.less'
import menuList from '../../config/menuConfig';
import logo from '../../assets/keqing.jpg'
import memoryUtils from "../../utils/memoryUtils";

const { SubMenu } = Menu;

const LeftNav = () => {
  const { pathname } = useLocation();
  let openkey = '';

  const hasAuth = (item: any) => {
    const { key, isPublic } = item

    const menus = memoryUtils.user.role.menus;
    const username = memoryUtils.user.username;
    /*
    1. 如果当前用户是admin
    2. 如果当前item是公开的
    3. 当前用户有此item的权限
     */
    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if (item.children) { // 4. 如果当前用户有此item的某个子item的权限
      return !!item.children.find((child: any) => menus.indexOf(child.key) !== -1)
    }

    return false;
  }


  const getMenuNodes = (function getMenu(menuList: any) {
    return menuList.map((item: any) => {
      if(hasAuth(item)) {
        const icon = React.createElement(
          Icon[item.icon as keyof typeof Icon] as any
        )
        if (!item.children) {
          return (
            <Menu.Item key={item.key} icon={icon}>
              <Link to={item.key}>
                {item.title}
              </Link>
            </Menu.Item>
          )
        } else {
          const cItem = item.children.find((cItem: any) => pathname.indexOf(cItem.key) === 0);
          if (cItem) {
            openkey = item.key;
          }
          return (
            <SubMenu key={item.key} title={item.title} icon={icon}>
              {
                getMenu(item.children)
              }
            </SubMenu>
          )
        }
      }
    })
  }
  )(menuList)

  return (
    <div className='left-nav'>
      <Link to="/" className="left-nav-header">
        <img src={logo} alt="logo" />
        <h2>swjtulmy</h2>
      </Link>
      <Menu
        defaultSelectedKeys={[pathname]}
        defaultOpenKeys={[openkey]}
        mode="inline"
        theme="dark"
        inlineCollapsed={false}
      >
        {
          getMenuNodes
        }
      </Menu>
    </div>
  )
}
export default LeftNav;