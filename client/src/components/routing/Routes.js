import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import TestPrivate from '../pages/TestPrivate';
import PrivateRoute from './PrivateRoute';

const Routes = () => {
  return (
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/register' component={Register} />
      <Route exact path='/login' component={Login} />
      <PrivateRoute exact path='/Dashboard' component={Dashboard} />
      <PrivateRoute exact path='/TestPrivate' component={TestPrivate} />
    </Switch>
  );
};

// <Route component={NotFound} />

export default Routes;
