import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from 'reactstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { clearSuccess } from '../../actions/successActions';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errorMsg: null,
    successMsg: null
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { success } = this.props;
    if (success) {
      this.setState({ successMsg: success.msg.msg });
    }
  }

  componentDidUpdate(prevProps) {
    const { error, success } = this.props;
    if (error !== prevProps.error) {
      // Check for login error
      if (error.id === 'LOGIN_FAIL') {
        this.setState({ errorMsg: error.msg.msg });
      } else {
        this.setState({ errorMsg: null });
      }
    }

    if (success !== prevProps.success) {
      if (success.id === 'LOGIN_SUCCESS') {
        this.setState({ successMsg: 'Login successful! :)' });
        this.props.clearSuccess(); // Do not save...
      } else {
        this.setState({ successMsg: null });
      }
    }
  }

  onSubmit = e => {
    this.props.clearErrors();
    this.props.clearSuccess();
    e.preventDefault();

    const { email, password } = this.state;

    const user = {
      email,
      password
    };

    // Attempt login
    this.props.login(user);
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  renderRedirect = () => {
    if (this.props.isAuthenticated) {
      const { from } = this.props.location.state || {
        from: { pathname: '/dashboard' }
      };
      return <Redirect to={from} />;
    }
  };

  render() {
    return (
      <section id='login-section'>
        {this.renderRedirect()}
        <div className='login-inner'>
          <Container>
            <div className='light-overlay'>
              <Container className='form-container'>
                <div className='h3 text-center'>Login</div>
                {this.state.errorMsg ? (
                  <Alert color='danger'>{this.state.errorMsg}</Alert>
                ) : null}
                {this.state.successMsg ? (
                  <Alert color='success'>{this.state.successMsg}</Alert>
                ) : null}
                <Form onSubmit={this.onSubmit}>
                  <FormGroup>
                    <Label for='email'>Email</Label>
                    <Input
                      type='email'
                      name='email'
                      id='email'
                      placeholder='Email'
                      autoComplete='username email'
                      className='mb-3'
                      onChange={this.onChange}
                    />
                    <Label for='password'>Password</Label>
                    <Input
                      type='password'
                      name='password'
                      id='password'
                      placeholder='Password'
                      autoComplete='current-password'
                      className='mb-3'
                      onChange={this.onChange}
                    />
                    <Button color='dark' style={{ marginTop: '2rem' }} block>
                      Login
                    </Button>
                  </FormGroup>
                </Form>
              </Container>
            </div>
          </Container>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  success: state.success
});

export default connect(
  mapStateToProps,
  { login, clearErrors, clearSuccess }
)(Login);
