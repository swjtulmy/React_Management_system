import React, { FC } from 'react'
import {
  Form,
  Select,
  Input
} from 'antd'

interface Iprops {
  form: any;
  roles: any;
  user: any;
}

const Item = Form.Item
const Option = Select.Option

const UserForm: FC<Iprops> = ({
  roles, user, form
}) => {
  console.log(user);

  const formItemLayout = {
    labelCol: { span: 4 },  // 左侧label的宽度
    wrapperCol: { span: 15 }, // 右侧包裹的宽度
  }
  return (
    <Form {...formItemLayout} form={form}>
      <Item name="username" label='用户名' initialValue={user ? user.username : ""}>
        <Input placeholder='请输入用户名' />
      </Item>
      {
        user ? null : (
          <Item name="password" label='密码' initialValue="">
            <Input type='password' placeholder='请输入密码' />
          </Item>
        )
      }
      <Item name="phone" label='手机号' initialValue={user ? user.phone : ""}>
        <Input placeholder='请输入手机号' />
      </Item>
      <Item name="email" label='邮箱' initialValue={user ? user.email : ""}>
        <Input placeholder='请输入邮箱' />
      </Item>

      <Item name="role_id" label='角色' initialValue={user ? user.role_id : ""}>
        <Select>
          {
            roles.map((role: any) => <Option key={role._id} value={role._id}>{role.name}</Option>)
          }
        </Select>
      </Item>
    </Form>
  )
}
export default UserForm;