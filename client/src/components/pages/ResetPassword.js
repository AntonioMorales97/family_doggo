import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Container,
  Spinner,
  Alert,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';

import {
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL
} from '../../actions/types';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { resetPassword } from './../../actions/authActions';
import { clearErrors } from './../../actions/errorActions';
import { clearSuccess } from './../../actions/successActions';

class ResetPassword extends Component {
  state = {
    newPassword: '',
    confirmPassword: '',
    resetting: false,
    errorMsg: null,
    successMsg: null,
    redirect: false
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired,
    resetPassword: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.clearErrors(); // Fresh start
    this.props.clearSuccess(); // Fresh start
  }

  componentDidUpdate(prevProps) {
    const { error, success } = this.props;
    if (error !== prevProps.error) {
      if (error.id === RESET_PASSWORD_FAIL) {
        this.setState({ errorMsg: error.msg.msg, resetting: false });
      } else {
        this.setState({ errorMsg: null });
      }
    }

    if (success !== prevProps.success) {
      if (success.id === RESET_PASSWORD_SUCCESS) {
        this.setState({
          successMsg: success.msg.msg,
          resetting: false,
          redirect: true
        });
      } else {
        this.setState({ successMsg: null });
      }
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    if (this.state.resetting) return;
    this.setState({ resetting: true });
    this.props.clearErrors();
    this.props.clearSuccess();

    const { newPassword, confirmPassword } = this.state;
    const { token } = this.props.match.params;

    // Attempt to reset password
    this.props.resetPassword(token, newPassword, confirmPassword);
  };

  renderRedirect = () => {
    if (this.state.redirect) return <Redirect to='/login' />;
  };

  render() {
    return (
      <section id='reset-password-page'>
        {this.renderRedirect()}
        <div className='reset-password-inner'>
          <Container>
            <div className='light-overlay'>
              <Container className='form-container'>
                <div className='h3 text-center'>Reset Password</div>
                {this.state.errorMsg ? (
                  <Alert color='danger'>{this.state.errorMsg}</Alert>
                ) : null}
                {this.state.successMsg ? (
                  <Alert color='success'>{this.state.successMsg}</Alert>
                ) : null}
                <Form onSubmit={this.onSubmit}>
                  <FormGroup>
                    <Label for='newPassword'>New Password</Label>
                    <Input
                      type='password'
                      name='newPassword'
                      id='newPassword'
                      placeholder='Enter new password'
                      autoComplete='off'
                      className='mb-3'
                      onChange={this.onChange}
                    />
                    <Label for='confirmPassword'>Confirm Password</Label>
                    <Input
                      type='password'
                      name='confirmPassword'
                      id='confirmPassword'
                      placeholder='Confirm password'
                      autoComplete='off'
                      className='mb-3'
                      onChange={this.onChange}
                    />
                    <Button color='dark' style={{ marginTop: '2rem' }} block>
                      {this.state.resetting ? (
                        <Spinner size='sm' />
                      ) : (
                        'Reset password'
                      )}
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
  error: state.error,
  success: state.success
});

export default connect(
  mapStateToProps,
  { resetPassword, clearErrors, clearSuccess }
)(ResetPassword);
