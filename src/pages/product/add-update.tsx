import React, { useState, useEffect, useRef } from 'react'
import {
  Card,
  Form,
  Input,
  Cascader,
  Button,
  message
} from 'antd'
import {
  ArrowLeftOutlined,
} from '@ant-design/icons';


import LinkButton from '../../components/link-button'
import PictureWall from './picture-wall';
import { reqCategorys, reqAddOrUpdateProduct } from '../../api'
import { useLocation, useHistory } from 'react-router-dom';
import RichTextEditor from './rich-text-editor';

const optionLists = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    isLeaf: false,
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    isLeaf: false,
  },
];
const Item = Form.Item
const { TextArea } = Input;
let isUpdate = false;
let product: any;
let categoryIds: any;

const ProductAddUpdate = () => {
  const [option, setoption] = useState(optionLists);

  const history: any = useHistory();
  const pw = useRef();
  const re = useRef();

  product = history.location.state;

  useEffect(() => {
    console.log(product);
    isUpdate = !!product;
    categoryIds = [];
    if (isUpdate) {
      // 商品是一个一级分类的商品
      if (product.pCategoryId === '0') {
        categoryIds.push(product.categoryId)
      } else {
        // 商品是一个二级分类的商品
        categoryIds.push(product.pCategoryId)
        categoryIds.push(product.categoryId)
      }
    }
    getCategorys('0');
  }, [])

  /*
    Product的添加和更新的子路由组件
  */
  const initOptions = async (categorys: any) => {
    // 根据categorys生成options数组
    const options = categorys.map((c: any) => ({
      value: c._id,
      label: c.name,
      isLeaf: false, // 不是叶子
    }))

    // 如果是一个二级分类商品的更新

    if (isUpdate && product.pCategoryId !== '0') {
      const { pCategoryId } = product;
      // 获取对应的二级分类列表
      const subCategorys: any = await getCategorys(pCategoryId);
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map((c: any) => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))

      // 找到当前商品对应的一级option对象
      const targetOption = options.find((option: any) => option.value === pCategoryId)
      // 关联对应的一级option上
      targetOption.children = childOptions;
    }
    // 更新options状态
    setoption(options);
  }

  /*
  异步获取一级/二级分类列表, 并显示
  async函数的返回值是一个新的promise对象, promise的结果和值由async的结果来决定
   */
  const getCategorys = async (parentId = "") => {
    const result: any = await reqCategorys(parentId)   // {status: 0, data: categorys}
    if (result.status === 0) {
      const categorys = result.data
      // 如果是一级分类列表
      if (parentId === '0') {
        initOptions(categorys);
      } else { // 二级列表
        return categorys  // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
      }
    }
  }

  /*
  用加载下一级列表的回调函数
   */
  const loadData = async (selectedOptions: any) => {
    // 得到选择的option对象
    const targetOption = selectedOptions[0]
    // 显示loading
    targetOption.loading = true;

    // 根据选中的分类, 请求获取二级分类列表
    const subCategorys = await getCategorys(targetOption.value);
    // 隐藏loading
    targetOption.loading = false
    // 二级分类数组有数据
    if (subCategorys && subCategorys.length > 0) {
      // 生成一个二级列表的options
      const childOptions = subCategorys.map((c: any) => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 关联到当前option上
      targetOption.children = childOptions;
    } else { // 当前选中的分类没有二级分类
      targetOption.isLeaf = true;
    }
    setoption([...option]);
  }

  const validatePrice = (rule: any, value = 0, callback: any) => {
    if (value * 1 > 0) {
      callback() // 验证通过
    } else {
      callback('价格必须大于0') // 验证没通过
    }
  }

  const title = (
    <span>
      <LinkButton >
        <ArrowLeftOutlined
          style={{ marginRight: 10, fontSize: 20 }}
          onClick={() => history.goBack()}
        />
      </LinkButton>
      <span>{isUpdate ? '修改商品' : '添加商品'}</span>
    </span>
  )

  const formItemLayout = {
    labelCol: { span: 2 },  // 左侧label的宽度
    wrapperCol: { span: 8 }, // 右侧包裹的宽度
  }

  const onFinish = async (values: any) => {
    console.log("values: ", values);
    const { name, desc, price, categoryIds: cIds } = values;
    let pId, cId;
    if (cIds.length === 1) {
      pId = '0';
      cId = categoryIds[0];
    } else {
      pId = categoryIds[0];
      cId = categoryIds[1];
    }
    const imgs: any = pw.current;
    let detail: any = re.current;
    const pro: any = { name, desc, price, imgs: imgs.getImgs(), detail: detail.getDetail(), pCategoryId: pId, categoryId: cId };
    if (isUpdate) {
      pro._id = product._id
    }

    console.log("product: ", pro);

    // 2. 调用接口请求函数去添加/更新
    const result: any = await reqAddOrUpdateProduct(pro);

    // 3. 根据结果提示
    if (result.status === 0) {
      message.success(`${isUpdate ? '更新' : '添加'}商品成功!`)
      history.goBack()
    } else {
      message.error(`${isUpdate ? '更新' : '添加'}商品失败!`)
    }
  };

  return (
    <Card title={title}>
      <Form
        {...formItemLayout}
        onFinish={onFinish}
      >
        <Item
          name="name"
          label="商品名称"
          initialValue={product ? product.name : ""}
          rules={[
            { required: true, message: '必须输入商品名称' }
          ]}
        >
          <Input placeholder='请输入商品名称' />
        </Item>
        <Item
          name="desc"
          label="商品描述"
          initialValue={product ? product.desc : ""}
          rules={[
            { required: true, message: '必须输入商品描述' }
          ]}
        >
          <TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }} />
        </Item>
        <Item
          name="price"
          label="商品价格"
          initialValue={product ? product.price : ""}
          rules={[
            { required: true, message: '必须输入商品价格' },
            { validator: validatePrice }
          ]}
        >
          <Input type='number' placeholder='请输入商品价格' addonAfter='元' />
        </Item>
        <Item
          name="categoryIds"
          label="商品分类"
          initialValue={product ? categoryIds : []}
          rules={[
            { required: true, message: '必须指定商品分类' },
          ]}
        >
          <Cascader
            placeholder='请指定商品分类'
            options={option}  /*需要显示的列表数据数组*/
            loadData={loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
          />
        </Item>
        <Item label="商品图片">
          <PictureWall cRef={pw} imgs={product ? product.imgs : ""} />
        </Item>
        <Item label="商品详情" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
          <RichTextEditor detail={product ? product.detail : ""} cRef={re} />
        </Item>
        <Item>
          <Button type='primary' style={{ marginLeft: "100px" }} htmlType="submit">提交</Button>
        </Item>
      </Form>
    </Card>
  )
}
export default ProductAddUpdate;