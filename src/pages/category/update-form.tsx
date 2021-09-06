import React, { FC, useRef } from 'react'
import {
  Form,
  Input
} from 'antd'

interface IProps {
  categoryName: string;
  form: any | undefined;
}

const Item = Form.Item;

const UpdateForm: FC<IProps> = ({
  categoryName,
  form
}) => {

  return (
    <Form form={form} >
      <Item
        name="cName"
        initialValue={categoryName}
        rules={[{ required: true, message: '分类名称必须输入' }]}
      >
        <Input placeholder='请输入分类名称' />
      </Item>
    </Form>
  )
}
export default UpdateForm