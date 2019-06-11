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
  Alert
} from 'reactstrap';

class ForgotPasswordModal extends Component {
  state = {
    modal: false,
    email: '',
    errorMsg: null
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    this.setState({ errorMsg: 'FPMODAL ONSUBMIT AND ALERT' });
    // Close modal
    //this.toggle();
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
                />
                <Button color='dark' style={{ marginTop: '2rem' }} block>
                  Reset Password
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default ForgotPasswordModal;
