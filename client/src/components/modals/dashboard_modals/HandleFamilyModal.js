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
import ConfirmationDialog from '../../ConfirmationDialog';
import DogList from '../../DogList';

import {
  ADD_DOG,
  ADD_DOG_FAIL,
  LEAVE_FAMILY_SUCCESS,
  LEAVE_FAMILY_FAIL,
  DELETE_DOG,
  DELETE_DOG_FAIL
} from '../../../actions/types';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addDog } from './../../../actions/dogActions';
import { leaveFamily } from './../../../actions/familyActions';
import { clearErrors } from './../../../actions/errorActions';
import { clearSuccess } from './../../../actions/successActions';

class HandleFamilyModal extends Component {
  state = {
    modal: false,
    dogName: '',
    errorMsg: null,
    successMsg: null,
    submitting: false
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired,
    addDog: PropTypes.func.isRequired,
    leaveFamily: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, success } = this.props;
    if (error !== prevProps.error) {
      if (error.id === ADD_DOG_FAIL) {
        this.setState({ errorMsg: error.msg.msg, submitting: false });
      } else if (error.id === LEAVE_FAMILY_FAIL) {
        this.setState({ errorMsg: error.msg.msg });
      } else if (error.id === DELETE_DOG_FAIL) {
        this.setState({ errorMsg: error.msg.msg });
      }
    }

    if (success !== prevProps.success) {
      if (success.id === ADD_DOG) {
        this.setState({
          submitting: false,
          dogName: '',
          successMsg: success.msg.msg
        });
      } else if (success.id === LEAVE_FAMILY_SUCCESS) {
        this.toggle();
      } else if (success.id === DELETE_DOG) {
        this.setState({ successMsg: success.msg.msg });
      }
    }
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      dogName: '',
      errorMsg: null,
      successMsg: null
    });

    this.props.clearErrors();
    this.props.clearSuccess(); // Clear before/after ourselves
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  addDog = e => {
    e.preventDefault();
    if (this.state.submitting) return;

    this.setState({ submitting: true });
    this.props.clearErrors();
    this.props.clearSuccess();

    this.props.addDog(this.state.dogName);
  };

  leaveFamily = () => {
    this.props.leaveFamily();
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
          Handle family
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Handle family</ModalHeader>
          <ModalBody>
            {this.state.errorMsg ? (
              <Alert color='danger'>{this.state.errorMsg}</Alert>
            ) : null}
            {this.state.successMsg ? (
              <Alert color='success'>{this.state.successMsg}</Alert>
            ) : null}
            <Form onSubmit={this.addDog}>
              <FormGroup>
                <Label for='dogName' className='d-block'>
                  Add a new dog to the family
                </Label>
                <Input
                  type='text'
                  name='dogName'
                  id='dogName'
                  placeholder='Enter dog name'
                  onChange={this.onChange}
                  required //?
                  className='d-inline w-75'
                  value={this.state.dogName}
                />
                <Button
                  color='success'
                  className='d-block d-sm-inline mt-1 mb-sm-1 ml-sm-1 mt-sm-0'
                >
                  {this.state.submitting ? <Spinner size='sm' /> : 'Add'}
                </Button>
              </FormGroup>
            </Form>
            <Label for='dogList' className='d-block mb-1'>
              Dogs in the family:
            </Label>
            <DogList />
            <ConfirmationDialog
              title='Are you sure you want to leave the family?'
              description='You can always create a new family or get invited again'
              buttonText='Leave family'
              confirmAction={this.leaveFamily}
            />
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
  { addDog, leaveFamily, clearErrors, clearSuccess }
)(HandleFamilyModal);
