import React, { Component } from 'react';
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

class Login extends Component {
  state = {
    email: '',
    password: '',
    errorMsg: null
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for login error
      if (error.id === 'LOGIN_FAIL') {
        this.setState({ errorMsg: error.msg.msg });
      } else {
        this.setState({ errorMsg: null });
      }
    }

    // If authenticated redirect to dashboard
    if (isAuthenticated) {
      console.log('SUCCESSFUL LOGIN');
    }
  }

  onSubmit = e => {
    this.props.clearErrors();
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

  render() {
    return (
      <section id='login-section'>
        <div className='login-inner'>
          <Container>
            <div className='light-overlay'>
              <Container className='form-container'>
                <div className='h3 text-center'>Login</div>
                {this.state.errorMsg ? (
                  <Alert color='danger'>{this.state.errorMsg}</Alert>
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
  error: state.error
});

export default connect(
  mapStateToProps,
  { login, clearErrors }
)(Login);
