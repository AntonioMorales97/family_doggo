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
import { register } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { clearSuccess } from '../../actions/successActions';

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
    errorMsg: null,
    successMsg: null,
    redirect: false
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, success } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === 'REGISTER_FAIL') {
        this.setState({ errorMsg: error.msg.msg });
      } else {
        this.setState({ errorMsg: null });
      }
    }

    if (success !== prevProps.success) {
      if (success.id === 'REGISTER_SUCCESS') {
        this.setState({ successMsg: success.msg.msg });
        this.setState({ redirect: true });
      } else {
        this.setState({ successMsg: null });
      }
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    this.props.clearErrors();
    this.props.clearSuccess();
    e.preventDefault();

    const { name, email, password, repeatPassword } = this.state;

    // Create user object
    const newUser = {
      name,
      email,
      password,
      repeatPassword
    };

    // Attempt to register
    this.props.register(newUser);
  };

  renderRedirect = () => {
    if (this.state.redirect) return <Redirect to='/login' />;
  };

  render() {
    return (
      <section id='register-section'>
        {this.renderRedirect()}
        <div className='register-inner'>
          <Container>
            <div className='light-overlay'>
              <Container className='form-container'>
                <div className='h3 text-center'>Register</div>
                {this.state.errorMsg ? (
                  <Alert color='danger'>{this.state.errorMsg}</Alert>
                ) : null}
                {this.state.successMsg ? (
                  <Alert color='success'>{this.state.successMsg}</Alert>
                ) : null}
                <Form onSubmit={this.onSubmit}>
                  <FormGroup>
                    <Label for='name'>Name</Label>
                    <Input
                      type='text'
                      name='name'
                      id='name'
                      placeholder='Enter Name'
                      className='mb-3'
                      onChange={this.onChange}
                    />
                    <Label for='email'>Email</Label>
                    <Input
                      type='email'
                      name='email'
                      id='email'
                      placeholder='Enter Email'
                      autoComplete='username email'
                      className='mb-3'
                      onChange={this.onChange}
                    />
                    <Label for='password'>Password</Label>
                    <Input
                      type='password'
                      name='password'
                      id='password'
                      placeholder='Enter Password'
                      autoComplete='new-password'
                      className='mb-3'
                      onChange={this.onChange}
                    />
                    <Label for='repeatPassword'>Repeat Password</Label>
                    <Input
                      type='password'
                      name='repeatPassword'
                      id='repeatPassword'
                      placeholder='Repeat Password'
                      autoComplete='new-password'
                      className='mb-3'
                      onChange={this.onChange}
                    />
                    <Button color='dark' style={{ marginTop: '2rem' }} block>
                      Register
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
  { register, clearErrors, clearSuccess }
)(Register);
