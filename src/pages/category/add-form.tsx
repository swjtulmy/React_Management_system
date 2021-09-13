import React, { FC, ReactElement } from 'react';
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item;
const Option = Select.Option;

interface Iprops {
  categorys: any[];
  parentId: string;
  form: any | undefined;
}

const AddForm: FC<Iprops> = ({
  categorys,
  parentId,
  form
}): ReactElement => {
  return (
    <Form form={form} >
      <Item name="pId" initialValue={parentId}>
        <Select>
          <Option value='0'>一级分类</Option>
          {
            categorys.map(c => <Option value={c._id}>{c.name}</Option>)
          }
        </Select>
      </Item>

      <Item
        name="cName"
        initialValue=''
        rules={[{ required: true, message: '分类名称必须输入' }]}
      >
        <Input placeholder='请输入分类名称' />
      </Item>
    </Form>
  );
};



export default AddForm;