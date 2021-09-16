import React, { FC } from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav'
import Header from '../../components/header';
import Home from '../home'
import Category from '../category'
import Product from '../product'
import Role from '../role'
import User from '../user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import Order from '../order/'
import NotFound from '../not-found'
import { connect } from 'react-redux'

const { Footer, Sider, Content } = Layout;
interface Iprops {
  user: any
}
const admin: FC<Iprops> = ({
  user
}) => {
  if (!user || !user._id) {
    return <Redirect to='/login' />
  }
  return (
    <Layout style={{ minHeight: '100%' }}>
      <Sider>
        <LeftNav />
      </Sider>
      <Layout>
        <Header />
        <Content style={{ margin: 20, backgroundColor: '#fff' }}>
          <Switch>
            <Redirect exact from='/' to='/home' />
            <Route path='/home' component={Home} />
            <Route path='/category' component={Category} />
            <Route path='/product' component={Product} />
            <Route path='/role' component={Role} />
            <Route path='/user' component={User} />
            <Route path='/charts/bar' component={Bar} />
            <Route path='/charts/line' component={Line} />
            <Route path='/charts/pie' component={Pie} />
            <Route path="/order" component={Order} />
            <Route component={NotFound} /> {/*上面没有一个匹配, 直接显示*/}
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center', color: '#cccccc' }}>推荐使用谷歌浏览器</Footer>
      </Layout>
    </Layout>
  )
}

export default connect(
  (state: any) => ({ user: state.user })
)(admin);
