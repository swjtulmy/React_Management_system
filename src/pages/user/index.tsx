import React, { useState, useEffect } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message,
  Form
} from 'antd'

import { formateDate } from "../../utils/fomateDate"
import LinkButton from "../../components/link-button/index"
import { reqDeleteUser, reqUsers, reqAddOrUpdateUser } from "../../api/index";
import UserForm from './user-form'
import { PAGE_SIZE } from '../../utils/constants';

let columns: any;
let roleNames: any;
let user: any;

export default function User() {
  // 所有用户列表
  const [users, setusers] = useState([]);
  // 所有角色列表
  const [roles, setroles] = useState([]);
  // 是否显示确认框
  const [isShow, setisShow] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    initColumns();
    getUsers();
  }, [])

  const initColumns = () => {
    columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },

      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id: any) => roleNames[role_id]
      },
      {
        title: '操作',
        render: (u: any) => (
          <span>
            <LinkButton onClick={() => showUpdate(u)}>修改</LinkButton>
            <LinkButton onClick={() => deleteUser(u)}>删除</LinkButton>
          </span>
        )
      },
    ]
  }

  const deleteUser = (u: any) => {
    Modal.confirm({
      title: `确认删除${u.username}吗?`,
      onOk: async () => {
        const result: any = await reqDeleteUser(u._id)
        if (result.status === 0) {
          message.success('删除用户成功!')
          getUsers();
        }
      }
    })
  }



  const initRoleNames = (r: any) => {
    const rn = r.reduce((pre: any, role: any) => {
      pre[role._id] = role.name;
      return pre;
    }, {})
    // 保存
    roleNames = rn;
  }

  const getUsers = async () => {
    const result: any = await reqUsers()
    if (result.status === 0) {
      const { users: u, roles: r } = result.data;
      initRoleNames(r);
      setroles(r);
      setusers(u);
    }
  }

  const showAdd = () => {
    user = null;
    setisShow(true);
  }
  const showUpdate = (u: any) => {
    user = u // 保存user
    setisShow(true);
  }

  const addOrUpdateUser = async () => {
    setisShow(false);
    // 1. 收集输入数据
    const u = form.getFieldsValue()
    form.resetFields()
    // 如果是更新, 需要给user指定_id属性
    if (user) {
      u._id = user._id;
    }

    // 2. 提交添加的请求
    const result: any = await reqAddOrUpdateUser(u)
    // 3. 更新列表显示
    if (result.status === 0) {
      message.success(`${user ? '修改' : '添加'}用户成功`)
      getUsers()
    }
  }

  const title = <Button type='primary' onClick={showAdd}>创建用户</Button>
  return (
    <Card title={title}>
      <Table
        bordered
        rowKey='_id'
        dataSource={users}
        columns={columns}
        pagination={{ defaultPageSize: PAGE_SIZE }}
      />

      <Modal
        title={user ? '修改用户' : '添加用户'}
        visible={isShow}
        onOk={addOrUpdateUser}
        onCancel={() => {
          form.resetFields()
          setisShow(false);
        }}
      >
        <UserForm
          form={form}
          roles={roles}
          user={user}
        />
      </Modal>
    </Card>
  )
}
