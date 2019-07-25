import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Spinner
} from 'reactstrap';
import { toast } from 'react-toastify';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { forgotPassword } from './../../actions/authActions';
import { clearErrors } from './../../actions/errorActions';
import { clearSuccess } from './../../actions/successActions';

class ForgotPasswordModal extends Component {
  state = {
    modal: false,
    email: '',
    errorMsg: null,
    submitting: false
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired,
    forgotPassword: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, success } = this.props;
    if (error !== prevProps.error) {
      if (error.id === 'FORGOT_PASSWORD_FAIL') {
        this.setState({ errorMsg: error.msg.msg, submitting: false });
      } else {
        this.setState({ errorMsg: null });
      }
    }

    if (success !== prevProps.success) {
      if (success.id === 'FORGOT_PASSWORD_SUCCESS') {
        this.setState({ submitting: false });
        toast.success(success.msg.msg, {
          autoClose: 60000,
          position: toast.POSITION.TOP_CENTER
        });
        this.toggle();
      } else {
        this.setState({ msg: null });
      }
    }
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      errorMsg: null
    });
    this.props.clearErrors(); // Clear before/after ourselves
    this.props.clearSuccess(); // Clear before/after ourselves
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    if (this.state.submitting) return;
    this.setState({ submitting: true });
    this.props.clearErrors();
    this.props.clearSuccess();

    // Attempt to send email to reset password...
    this.props.forgotPassword(this.state.email);
  };

  // Remove focus on link after click...
  onMouseDown = e => {
    e.preventDefault();
  };

  render() {
    return (
      <div>
        <Button
          color='link'
          onClick={this.toggle}
          onMouseDown={this.onMouseDown}
        >
          Forgot password?
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Reset Password</ModalHeader>
          <ModalBody>
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
                  placeholder='Enter your email'
                  onChange={this.onChange}
                  required
                />
                <Button color='dark' style={{ marginTop: '2rem' }} block>
                  {this.state.submitting ? <Spinner size='sm' /> : 'Submit'}
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.error,
  success: state.success
});

export default connect(
  mapStateToProps,
  { forgotPassword, clearErrors, clearSuccess }
)(ForgotPasswordModal);
