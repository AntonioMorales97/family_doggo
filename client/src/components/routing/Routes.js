import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Confirm from '../pages/Confirm';
import ResetPassword from '../pages/ResetPassword';
import FamilyInvitation from '../pages/FamilyInvitation';
import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

import PrivateRoute from './PrivateRoute';

const Routes = () => {
  return (
    <Switch>
      <Route exact path='/confirm/:token' component={Confirm} />
      <Route exact path='/reset/:token' component={ResetPassword} />
      <Route exact path='/join-family/:token' component={FamilyInvitation} />
      <Route exact path='/' component={Home} />
      <Route exact path='/register' component={Register} />
      <Route exact path='/login' component={Login} />
      <PrivateRoute exact path='/dashboard' component={Dashboard} />
    </Switch>
  );
};

// <Route component={NotFound} />

export default Routes;
