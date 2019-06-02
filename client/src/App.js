import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Footer from './components/Footer';
import Home from './components/pages/Home';
import Register from './components/pages/Register';
import Login from './components/pages/Login';

import 'bootstrap/dist/css/bootstrap.min.css';
import './scss//App.scss';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='App'>
          <AppNavbar />
          <Route exact path='/' component={Home} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
