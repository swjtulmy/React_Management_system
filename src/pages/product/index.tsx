import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import ProductDetail from './detail'
import ProductAddUpdate from './add-update'
import ProductHome from './home'

import './product.less'

export default function Product() {
  return (
    <div>
      <Switch>
        <Route path='/product' component={ProductHome} exact/> {/*路径完全匹配*/}
        <Route path='/product/addupdate' component={ProductAddUpdate}/>
        <Route path='/product/detail' component={ProductDetail}/>
        <Redirect to='/product'/>
      </Switch>
    </div>
  )
}
