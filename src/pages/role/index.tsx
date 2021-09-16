import React, { useState, useRef, useEffect,FC } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message,
  Form
} from 'antd'
import { PAGE_SIZE } from "../../utils/constants"
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import { formateDate } from '../../utils/fomateDate'
import { useHistory } from 'react-router'
import { connect } from 'react-redux'
import {logout} from '../../redux/actions'

interface Iprops {
  user: any;
  logout: Function
}
let columns: any;

const Role:FC<Iprops> = ({
  user
}) => {
  const [roles, setroles] = useState([] as any);
  const [role, setrole] = useState({} as any);
  const [isShowAdd, setisShowAdd] = useState(false);
  const [isShowAuth, setisShowAuth] = useState(false);
  const auth = useRef();
  const [form] = Form.useForm();

  const history = useHistory();

  useEffect(() => {
    initColumn();
    getRoles();
  }, [])

  const initColumn = () => {
    columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
    ]
  }

  const getRoles = async () => {
    const result: any = await reqRoles();
    if (result.status === 0) {
      const r = result.data
      setroles(r);
    }
  }

  const onRow = (r: any) => {
    return {
      onClick: (event: any) => { // 点击行
        // alert('点击行')
        setrole(r);
      },
    }
  }

  const addRole = async () => {
    // 进行表单验证, 只能通过了才向下处理
    const res = await form.validateFields();
    setisShowAdd(false);
    const { roleName } = res;
    form.resetFields();
    const result: any = await reqAddRole(roleName);
    // 根据结果提示/更新列表显示
    if (result.status === 0) {
      message.success('添加角色成功')
      // 新产生的角色
      const r = result.data
      setroles([...roles, r])
    } else {
      message.success('添加角色失败')
    }
  }

  /*
  更新角色
   */
  const updateRole = async () => {
    // 隐藏确认框
    setisShowAuth(false);

    const r = role;
    // 得到最新的menus
    const au: any = auth.current;
    const menus = au.getMenus();
    r.menus = menus
    r.auth_time = Date.now()
    const u: any = user
    r.auth_name = u.username

    // 请求更新
    const result: any = await reqUpdateRole(role)
    console.log(result);
    if (result.status === 0) {
      // this.getRoles()
      // 如果当前更新的是自己角色的权限, 强制退出
      if (role._id === u.role_id) {
        logout();
        history.replace('/login')
        message.success('当前用户角色权限成功')
      } else {
        message.success('设置角色权限成功')
        setroles([...roles]);
      }
    }
  }

  const title = (
    <span>
      <Button type='primary' onClick={() => setisShowAdd(true)}>创建角色</Button> &nbsp;&nbsp;
      <Button type='primary' disabled={!(role._id)} onClick={() => setisShowAuth(true)}>设置角色权限</Button>
    </span>
  )

  return (
    <Card title={title}>
      <Table
        bordered
        rowKey='_id'
        dataSource={roles}
        columns={columns}
        pagination={{ defaultPageSize: PAGE_SIZE }}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: [role._id],
          onSelect: setrole
        }}
        onRow={onRow}
      />

      <Modal
        title="添加角色"
        visible={isShowAdd}
        onOk={addRole}
        onCancel={() => {
          setisShowAdd(false)
          form.resetFields()
        }}
      >
        <AddForm
          form={form}
        />
      </Modal>

      <Modal
        title="设置角色权限"
        visible={isShowAuth}
        onOk={updateRole}
        onCancel={() => {
          setisShowAuth(false)
        }}
      >
        <AuthForm cRef={auth} role={role} />
      </Modal>
    </Card>
  )
}
export default connect(
  (state: any) => ({user: state.user}),
  {logout}
)(Role);