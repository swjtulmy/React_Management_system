import React, { FC } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
// import { Button } from 'antd';
import './App.less';
import Login from './pages/login'
import Admin from './pages/admin'

const App: FC = () => (
  <div className="App">
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/" component={Admin}/>
      </Switch>
    </BrowserRouter>
  </div>
);

export default App;