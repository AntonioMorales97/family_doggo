import React, { Component, Fragment } from 'react';
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

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { inviteToFamily } from './../../../actions/familyActions';
import { clearErrors } from './../../../actions/errorActions';
import { clearSuccess } from './../../../actions/successActions';

class InviteToFamilyModal extends Component {
  state = {
    modal: false,
    email: '',
    errorMsg: null,
    successMsg: null,
    submitting: false
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired,
    inviteToFamily: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, success } = this.props;
    if (error !== prevProps.error) {
      // Check for login error
      if (error.id === 'INVITE_TO_FAMILY_FAIL') {
        this.setState({ errorMsg: error.msg.msg, submitting: false });
      } else {
        this.setState({ errorMsg: null });
      }
    }

    if (success !== prevProps.success) {
      if (success.id === 'INVITE_TO_FAMILY_SUCCESS') {
        this.setState({
          successMsg: success.msg.msg,
          errorMsg: null,
          submitting: false,
          email: ''
        });
      } else {
        this.setState({ successMsg: null });
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
    this.setState({ submitting: true });

    this.props.inviteToFamily(this.state.email);
  };

  // Remove focus on link after click...
  onMouseDown = e => {
    e.preventDefault();
  };

  render() {
    return (
      <Fragment>
        <Button
          color='dark'
          onClick={this.toggle}
          onMouseDown={this.onMouseDown}
          className='w-100'
        >
          Invite others to family
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            Invite others to your family
          </ModalHeader>
          <ModalBody>
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
                  value={this.state.email}
                  placeholder='Enter email to send invitation'
                  onChange={this.onChange}
                  required
                />
                <Button color='dark' style={{ marginTop: '2rem' }} block>
                  {this.state.submitting ? (
                    <Spinner size='sm' />
                  ) : (
                    'Send invitation'
                  )}
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  error: state.error,
  success: state.success
});

export default connect(
  mapStateToProps,
  { inviteToFamily, clearErrors, clearSuccess }
)(InviteToFamilyModal);
