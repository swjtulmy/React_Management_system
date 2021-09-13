import React, { useState, useEffect } from 'react'
import {
  Card,
  List
} from 'antd'
import {
  ArrowLeftOutlined
} from '@ant-design/icons';

import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'
import { useHistory, useLocation } from 'react-router-dom'

const Item = List.Item;

const ProductDetail = () => {
  const [cName1, setcName1] = useState('');
  const [cName2, setcName2] = useState('');
  const location: any = useLocation();
  const history: any = useHistory();
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { pCategoryId, categoryId } = location.state.product;
    if (pCategoryId === '0') { // 一级分类下的商品
      const result: any = await reqCategory(categoryId)
      setcName1(result.data.name)
    } else { // 二级分类下的商品
      /*
      //通过多个await方式发多个请求: 后面一个请求是在前一个请求成功返回之后才发送
      const result1 = await reqCategory(pCategoryId) // 获取一级分类列表
      const result2 = await reqCategory(categoryId) // 获取二级分类
      const cName1 = result1.data.name
      const cName2 = result2.data.name
      */
      // 一次性发送多个请求, 只有都成功了, 才正常处理
      const results: any = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      setcName1(results[0].data.name);
      setcName2(results[1].data.name);
    }
  }

  const { name, desc, price, detail, imgs } = location.state.product;
  const title = (
    <span>
      <LinkButton>
        <ArrowLeftOutlined
          style={{ marginRight: 10, fontSize: 20 }}
          onClick={() => history.goBack()}
        />
      </LinkButton>
      <span>商品详情</span>
    </span>
  )
  return (
    <Card title={title} className='product-detail'>
      <List>
        <Item>
          <span className="left">商品名称:</span>
          <span>{name}</span>
        </Item>
        <Item>
          <span className="left">商品描述:</span>
          <span>{desc}</span>
        </Item>
        <Item>
          <span className="left">商品价格:</span>
          <span>{price}元</span>
        </Item>
        <Item>
          <span className="left">所属分类:</span>
          <span>{cName1} {cName2 ? ' --> ' + cName2 : ''}</span>
        </Item>
        <Item>
          <span className="left">商品图片:</span>
          <span>
            {
              imgs.map((img="") => (
                <img
                  key={img}
                  src={BASE_IMG_URL + img}
                  className="product-img"
                  alt="img"
                />
              ))
            }
          </span>
        </Item>
        <Item>
          <span className="left">商品详情:</span>
          <span dangerouslySetInnerHTML={{ __html: detail }}>
          </span>
        </Item>
      </List>
    </Card>
  )
}
export default ProductDetail;