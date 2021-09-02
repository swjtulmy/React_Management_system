import React, { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'antd';
import * as Icon from '@ant-design/icons'
import './index.less'
import menuList from '../../config/menuConfig';
import logo from '../../assets/keqing.jpg'

const { SubMenu } = Menu;

const LeftNav = () => {
  const { pathname } = useLocation();
  let key = '';

  const getMenuNodes = (function getMenu(menuList: any) {
    return menuList.map((item: any) => {
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
          key = item.key
        }
        return (
          <SubMenu key={item.key} title={item.title} icon={icon}>
            {
              getMenu(item.children)
            }
          </SubMenu>
        )
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
        defaultOpenKeys={[key]}
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