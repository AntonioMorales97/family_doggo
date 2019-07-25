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
import Select from 'react-select';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

import SocketContext from '../../../utils/socket-context';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addWalk } from '../../../actions/walkActions';
import { clearErrors } from './../../../actions/errorActions';
import { clearSuccess } from './../../../actions/successActions';
import { ADD_WALK, ADD_WALK_FAIL } from './../../../actions/types';

class AddWalkModal extends Component {
  state = {
    modal: false,
    errorMsg: null,
    adding: false,
    selectedDogs: null,
    walkStartTime: '',
    walkTime: '',
    poop: false,
    pee: false
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
      if (error.id === ADD_WALK_FAIL) {
        this.setState({ errorMsg: error.msg.msg, adding: false });
      } else {
        this.setState({ errorMsg: null });
      }
    }

    if (success !== prevProps.success) {
      if (success.id === ADD_WALK) {
        this.setState({ adding: false });
        this.toggle();
        //toastify???
      } else {
        this.setState({ msg: null });
      }
    }
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      errorMsg: null,
      selectedDog: null,
      walkStartTime: '',
      walkTime: '',
      poop: false,
      pee: false
    });
    this.props.clearErrors(); // Clear before/after ourselves
    this.props.clearSuccess(); // Clear before/after ourselves
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value || e.target.checked });
  };

  handleDogChange = selectedDog => {
    this.setState({ selectedDogs: selectedDog });
  };

  onChangeWalkTime = walkTime => {
    this.setState({ walkTime });
  };

  onChangeWalkStartTime = walkStartTime => {
    this.setState({ walkStartTime });
  };

  onSubmit = e => {
    e.preventDefault();
    if (this.state.adding) return;
    this.setState({ adding: true });
    this.props.clearErrors();
    this.props.clearSuccess();

    const { walkStartDate, walkStartTime, walkTime } = this.getTimes();
    const dogNamesString = this.getDogNamesString();

    //TRY TO ADD WALK
    const walk = {
      dogs: dogNamesString,
      date: walkStartDate,
      time: walkStartTime,
      duration: walkTime,
      pee: this.state.pee,
      poop: this.state.poop
    };

    this.props.addWalk(walk, this.props.socket);
  };

  // Remove focus on link after click...
  onMouseDown = e => {
    e.preventDefault();
  };

  // Returns the name of the selected dog/dogs as one string
  getDogNamesString = () => {
    const dogArray = this.state.selectedDogs;
    if (dogArray) {
      /*
      let sortedDogArray = dogArray.sort((firstDog, secondDog) => {
        const firstDogName = firstDog.name.toLowerCase(),
          secondDogName = secondDog.name.toLowerCase();
        if (firstDogName < secondDogName) return -1;
        else if (firstDogName > secondDogName) return 1;
        else return 0;
      });

      let stringDogArray = [];
      sortedDogArray.forEach(dog => {
        stringDogArray.push(dog.name);
      });
      */
      let stringDogArray = [];
      dogArray.forEach(dog => {
        stringDogArray.push(dog.name);
      });
      return stringDogArray.join(', ');
    }
  };

  // Get the walk time in minutes
  getWalkTimeInMinutes = () => {
    const walkTimeMoment = this.state.walkTime;
    if (walkTimeMoment) {
      const hh = walkTimeMoment.hours();
      const mm = walkTimeMoment.minutes();
      return hh * 60 + mm;
    } else {
      return 0; // Should not come here
    }
  };

  // Calculates the times (walk time, time when the walk started)
  // depending on user input
  getTimes = () => {
    if (!this.state.walkStartTime && this.state.walkTime) {
      let dateToday = moment();
      let timeToday = moment();

      let walkTimeMinutes = this.getWalkTimeInMinutes();
      let walkStartDate = dateToday
        .subtract(walkTimeMinutes, 'minutes')
        .format('YYYY-MM-DD');
      let walkStartTime = timeToday
        .subtract(walkTimeMinutes, 'minutes')
        .format('HH:mm');
      let walkTime = this.state.walkTime;
      walkTime = walkTime.format('HH:mm');
      return {
        walkStartDate,
        walkStartTime,
        walkTime
      };
    } else if (this.state.walkTime) {
      let walkStartTime = this.state.walkStartTime.format('HH:mm');
      let walkTime = this.state.walkTime.format('HH:mm');
      let walkStartDate = this.state.walkStartTime.format('YYYY-MM-DD');
      return {
        walkStartDate,
        walkStartTime,
        walkTime
      };
    } else {
      return {
        undefined
      };
    }
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
          Add walk
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Add Walk</ModalHeader>
          <ModalBody>
            {this.state.errorMsg ? (
              <Alert color='danger'>{this.state.errorMsg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for='dogSelect'>
                  Which dog or dogs accompanied you?
                </Label>
                <Select
                  closeMenuOnSelect={false}
                  closeMenuOnScroll={true}
                  placeholder={'Select dogs'}
                  isMulti
                  name='dogs'
                  options={this.props.dog.dogs}
                  getOptionLabel={option => option['name']}
                  getOptionValue={option => option['_id']}
                  className='dog-select'
                  classNamePrefix='select'
                  noOptionsMessage={() => null} //Close when empty
                  onChange={this.handleDogChange}
                />
                <Label for='selectWalkTime' className='mt-3'>
                  How long was your walk?
                </Label>
                <div className='mb-2'>
                  <TimePicker
                    defaultOpenValue={moment('01:00', 'HH:mm')}
                    onChange={this.onChangeWalkTime}
                    format='HH:mm'
                    showSecond={false}
                    required
                  />
                </div>
                <Label for='selectWalkStartTime'>
                  When did you start your walk? (Optional)
                </Label>
                <div className='mb-3'>
                  <TimePicker
                    onChange={this.onChangeWalkStartTime}
                    format='HH:mm'
                    showSecond={false}
                  />
                </div>
                <div className='form-check'>
                  <Input
                    className='form-check-input'
                    type='checkbox'
                    value=''
                    id='pee'
                    name='pee'
                    onChange={this.onChange}
                  />
                  <Label for='defaultCheck1'>
                    {' '}
                    Did your dog/dogs pee <i className='fas fa-tint' />?
                  </Label>
                </div>
                <div className='form-check'>
                  <Input
                    className='form-check-input'
                    type='checkbox'
                    value=''
                    id='poop'
                    name='poop'
                    onChange={this.onChange}
                  />
                  <Label for='defaultCheck2'>
                    {' '}
                    Did your dog/dogs poop <i className='fas fa-poo' />?
                  </Label>
                </div>

                <Button color='dark' style={{ marginTop: '2rem' }} block>
                  {this.state.adding ? <Spinner size='sm' /> : 'Add'}
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
  success: state.success,
  dog: state.dog
});

const AddWalkModalWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <AddWalkModal {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default connect(
  mapStateToProps,
  { addWalk, clearErrors, clearSuccess }
)(AddWalkModalWithSocket);
