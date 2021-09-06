import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  message,
  Modal,
  Form
} from 'antd'
import { ArrowRightOutlined, PlusOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'



const Category = () => {
  const [parentId, setparentId] = useState("0");
  const [categorys, setcategorys] = useState([]);
  const [subCategorys, setsubCategorys] = useState([]);
  const [parentName, setparentName] = useState('');
  const [showState, setshowState] = useState(0);
  const [loading, setloading] = useState(false);
  const [category, setcategory] = useState({} as any);

  const [addForm] = Form.useForm();
  const [updateForm] = Form.useForm();


  useEffect(() => {
    getCategorys();
  }, [])

  useEffect(() => {
    getCategorys(parentId);
  }, [parentId])

  /*
    异步获取一级/二级分类列表显示
    parentId: 如果没有指定根据状态中的parentId请求, 如果指定了根据指定的请求
 */
  const getCategorys = async (pId = "0") => {
    // 在发请求前, 显示loading
    setloading(true);
    // 发异步ajax请求, 获取数据
    const result: any = await reqCategorys(pId);
    // 在请求完成后, 隐藏loading
    setloading(false);

    if (result.status === 0) {
      // 取出分类数组(可能是一级也可能二级的)
      const categorys = result.data
      if (parentId === '0') {
        // 更新一级分类状态
        setcategorys(categorys);
      } else {
        // 更新二级分类状态
        setsubCategorys(categorys);
      }
    } else {
      message.error('获取分类列表失败');
    }
  }

  const updateCategory = async () => {
    console.log("update:", category);
    const res = await updateForm.validateFields();
    const { cName } = res;
    const cId = category._id;
    updateForm.resetFields();
    console.log(category, res);
    const result: any = await reqUpdateCategory(cId, cName);
    if (result.status === 0) {
      // 3. 重新显示列表
      getCategorys(category.parentId);
    }
    setshowState(0);
  }

  const showUpdate = (cat = {}) => {
    setcategory(cat);
    setshowState(2);
  }

  const handleCancel = () => {
    addForm.resetFields();
    updateForm.resetFields();
    setshowState(0);
  }

  const addCategory = async () => {
    const res = await addForm.validateFields();
    const { pId, cName } = res;
    console.log(pId, cName);
    addForm.resetFields();
    const result: any = await reqAddCategory(cName, pId);
    if (result.status === 0) {
      // 添加的分类就是当前分类列表下的分类
      if (pId === parentId) {
        // 重新获取当前分类列表显示
        getCategorys(pId);
      } else if (pId === '0') { // 在二级分类列表下添加一级分类, 重新获取一级分类列表, 但不需要显示一级列表
        getCategorys('0');
      }
    }
    setshowState(0);
  }

  const showCategorys = () => {
    // 更新为显示一列表的状态
    setparentId('0');
    setparentName('');
    setsubCategorys([]);
  }

  const showSubCategorys = (category: any) => {
    setparentId(category._id);
    setparentName(category.name);
  }

  const showAdd = () => [
    setshowState(1)
  ]

  const columns: any = [
    {
      title: '分类名称',
      dataIndex: 'name', // 显示数据对应的属性名
    },
    {
      title: '操作',
      width: 300,
      render: (category = {}) => ( // 返回需要显示的界面标签
        <span>
          <LinkButton onClick={() => showUpdate(category)}>修改分类</LinkButton>
          {parentId === '0' ? <LinkButton onClick={() => showSubCategorys(category)}>查看子分类</LinkButton> : null}
        </span>
      )
    }
  ];

  const title = parentId === '0' ? '一级分类列表' : (
    <span>
      <LinkButton onClick={showCategorys}>一级分类列表</LinkButton>
      <ArrowRightOutlined type='arrow-right' style={{ marginRight: 5 }} />
      <span>{parentName}</span>
    </span>
  )
  const extra = (
    <Button type='primary' onClick={showAdd}>
      <PlusOutlined />
      添加
    </Button>
  )
  return (
    <Card title={title} extra={extra}>
      <Table
        bordered
        rowKey='_id'
        loading={loading}
        dataSource={parentId === '0' ? categorys : subCategorys}
        columns={columns}
        pagination={{ defaultPageSize: 10, showQuickJumper: true }}
      />

      <Modal
        title="添加分类"
        visible={showState === 1}
        onOk={addCategory}
        onCancel={handleCancel}
      >
        <AddForm
          form={addForm}
          categorys={categorys}
          parentId={parentId}
        />
      </Modal>

      <Modal
        title="更新分类"
        visible={showState === 2}
        onOk={updateCategory}
        onCancel={handleCancel}
      >
        <UpdateForm
          form={updateForm}
          categoryName={category.name}
        />
      </Modal>
    </Card>
  )
}
export default Category;