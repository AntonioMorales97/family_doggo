import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Footer from './components/Footer';
import Routes from './components/routing/Routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import cookieNotify from './utils/cookieNotify';

//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
    cookieNotify();
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <ToastContainer />
          <div className='App'>
            <AppNavbar />
            <Switch>
              <Route component={Routes} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
