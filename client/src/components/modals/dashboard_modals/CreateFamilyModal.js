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

import {
  REGISTER_FAMILY_SUCCESS,
  REGISTER_FAMILY_FAIL
} from '../../../actions/types';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { registerFamily } from './../../../actions/familyActions';
import { clearErrors } from './../../../actions/errorActions';
import { clearSuccess } from './../../../actions/successActions';

class CreateFamilyModal extends Component {
  state = {
    modal: false,
    familyName: '',
    errorMsg: null,
    submitting: false
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, success } = this.props;
    if (error !== prevProps.error) {
      if (error.id === REGISTER_FAMILY_FAIL) {
        this.setState({ errorMsg: error.msg.msg, submitting: false });
        this.props.clearErrors(); // Clear state
      } else {
        this.setState({ errorMsg: null });
      }
    }

    if (success !== prevProps.success) {
      if (success.id === REGISTER_FAMILY_SUCCESS) {
        this.setState({ submitting: false });
        this.toggle();
      } else {
        this.setState({ msg: null });
      }
    }
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      familyName: '',
      errorMsg: null
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    if (this.state.submitting) return;

    this.setState({ submitting: true });
    this.props.registerFamily(this.state.familyName);
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
          Create family
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            Create family to start adding walks
          </ModalHeader>
          <ModalBody>
            {this.state.errorMsg ? (
              <Alert color='danger'>{this.state.errorMsg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for='familyName'>Family name</Label>
                <Input
                  type='text'
                  name='familyName'
                  id='familyName'
                  placeholder='Enter the family name'
                  onChange={this.onChange}
                  required
                />
                <Button color='dark' style={{ marginTop: '2rem' }} block>
                  {this.state.submitting ? <Spinner size='sm' /> : 'Create'}
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
  { registerFamily, clearErrors, clearSuccess }
)(CreateFamilyModal);
