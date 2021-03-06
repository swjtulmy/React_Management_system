import React, {FC} from 'react'
import { useHistory,  Redirect } from 'react-router-dom'
import './login.less'
import logo from './images/keqing.jpg'
import { Form, Input, Button, message, Result } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {login} from '../../redux/actions'
import {connect} from 'react-redux'

interface Iprops {
  user: any;
  login: Function
}

const Login:FC<Iprops> = ({
  user,login
}) => {
  if (user && user._id) {
    return <Redirect to='/home' />
  }

  const onFinish = async (values: any) => {
    console.log(values);
    login(values);
  };
  return (
    <div className="login">
      <header className="login-header">
        <img src={logo} alt="" />
        <h1>swjtulmy</h1>
      </header>
      <section className="login-content">
        <h2>用户登陆</h2>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "用户名必须输入",
              },
              {
                pattern: /^[A-Za-z\d_]{4,12}$/,
                message: "4-12个字符，为数字字母下划线的组合"
              }
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "密码必须输入",
              },
              {
                pattern: /^[A-Za-z\d$@$!%*#?&]{4,}$/,
                message: "至少4个字符，不能有特殊字符和空格"
              }
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </section>
    </div>
  )
}

export default connect(
  (state: any) => ({user: state.user}),
  {login}
)(Login);
