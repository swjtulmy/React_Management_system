import React, { FC, useImperativeHandle, useState,useEffect } from 'react'
import {
  Form,
  Input,
  Tree
} from 'antd'
import menuList from '../../config/menuConfig'

const Item = Form.Item

const { TreeNode } = Tree

interface Iprops {
  cRef: React.MutableRefObject<any>;
  role: any;
}

const AuthForm: FC<Iprops> = ({
  cRef, role
}) => {

  const [checkedKeys, setcheckedKeys] = useState(role);

  useImperativeHandle(cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    getMenus: () => checkedKeys
  }));

  useEffect(() => {
    setcheckedKeys(role.menus);
  }, [role]);


  // 选中某个node时的回调
  const onCheck = (c: any) => setcheckedKeys(c);

  const formItemLayout = {
    labelCol: { span: 4 },  // 左侧label的宽度
    wrapperCol: { span: 15 }, // 右侧包裹的宽度
  }


  return (
    <div>
      <Item label='角色名称' {...formItemLayout}>
        <Input value={role.name} disabled />
      </Item>

      <Tree
        checkable
        defaultExpandAll={true}
        checkedKeys={checkedKeys}
        onCheck={onCheck}
        treeData={menuList}
      >
      </Tree>
    </div>
  )
}
export default AuthForm;