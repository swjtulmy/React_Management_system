import React, { useState, useEffect } from 'react'
import {
  Card,
  Select,
  Input,
  Button,
  Table,
  message
} from 'antd'
import {
  PlusOutlined
} from '@ant-design/icons';

import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
import { useHistory } from 'react-router-dom';

const Option = Select.Option;
let columns: any;
let pageNum = 1;

const Home = () => {
  const [total, settotal] = useState(0);
  const [products, setproducts] = useState([]);
  const [loading, setloading] = useState(false);
  const [searchName, setsearchName] = useState("");
  const [searchType, setsearchType] = useState('productName');
  const history = useHistory();

  useEffect(() => {
    initColumns();
    getProducts();
  }, [])

  const initColumns = () => {
    columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price = 0) => '¥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
      },
      {
        width: 100,
        title: '状态',
        // dataIndex: 'status',
        render: (product: any) => {
          const { status, _id } = product
          const newStatus = status === 1 ? 2 : 1
          return (
            <span>
              <Button
                type='primary'
                onClick={() => updateStatus(_id, newStatus)}
              >
                {status === 1 ? '下架' : '上架'}
              </Button>
              <span>{status === 1 ? '在售' : '已下架'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: '操作',
        render: (product = {}) => {
          return (
            <span>
              {/*将product对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => history.push('/product/detail', { product })}>详情</LinkButton>
              <LinkButton onClick={() => history.push('/product/addupdate', product)}>修改</LinkButton>
            </span>
          )
        }
      },
    ];
  }

  const getProducts = async (pNum = 1) => {
    pageNum = pNum;
    setloading(true);
    let result: any;
    if (searchName) {
      result = await reqSearchProducts(pageNum, PAGE_SIZE, searchName, searchType)
    } else { // 一般分页请求
      result = await reqProducts(pageNum, PAGE_SIZE)
    }

    setloading(false);// 隐藏loading
    if (result.status === 0) {
      // 取出分页数据, 更新状态, 显示分页列表
      settotal(result.data.total);
      setproducts(result.data.list);
    }
  }

  const updateStatus = async (productId = "", status = 1) => {
    const result: any = await reqUpdateStatus(productId, status)
    if (result.status === 0) {
      message.success('更新商品成功')
      getProducts(pageNum);
    }
  }

  const title = (
    <span>
      <Select
        value={searchType}
        style={{ width: 150 }}
        onChange={value => setsearchType(value)}
      >
        <Option value='productName'>按名称搜索</Option>
        <Option value='productDesc'>按描述搜索</Option>
      </Select>
      <Input
        placeholder='关键字'
        style={{ width: 150, margin: '0 15px' }}
        value={searchName}
        onChange={event => setsearchName(event.target.value)}
      />
      <Button type='primary' onClick={() => getProducts(1)}>搜索</Button>
    </span>
  )

  const extra = (
    <Button type='primary' onClick={() => history.push('/product/addupdate')}>
      <PlusOutlined />
      添加商品
    </Button>
  )
  return (
    <div>
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={products}
          columns={columns}
          pagination={{
            current: pageNum,
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: getProducts
          }}
        />
      </Card>
    </div>
  )
}
export default Home;