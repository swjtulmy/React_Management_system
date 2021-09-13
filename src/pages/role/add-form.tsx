import React, { useEffect, FC } from 'react'
import {
  Form,
  Input
} from 'antd'

const Item = Form.Item;

interface Iprops {
  form: any;
}

const AddForm: FC<Iprops> = ({
  form
}) => {
  const formItemLayout = {
    labelCol: { span: 4 },  // 左侧label的宽度
    wrapperCol: { span: 15 }, // 右侧包裹的宽度
  }
  return (
    <Form form={form} >
      <Item
        label='角色名称'
        {...formItemLayout}
        name='roleName'
        initialValue=""
        rules={[
          { required: true, message: '角色名称必须输入' }
        ]}>
        <Input placeholder='请输入角色名称' />
      </Item>
    </Form>
  )
}
export default AddForm;