import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Spinner } from 'reactstrap';

import { CONFIRMATION_SUCCESS, CONFIRMATION_FAIL } from '../../actions/types';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { confirm } from './../../actions/authActions';
import { clearErrors } from './../../actions/errorActions';
import { clearSuccess } from './../../actions/successActions';

class Confirm extends Component {
  state = {
    confirming: true,
    msg: null,
    success: null
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired,
    confirm: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { token } = this.props.match.params;
    this.props.clearErrors(); // Do not save...
    this.props.clearSuccess(); // Do not save...

    // Attempt Confirmation
    this.props.confirm(token);
  }

  componentDidUpdate(prevProps) {
    const { error, success } = this.props;
    if (error !== prevProps.error) {
      if (error.id === CONFIRMATION_FAIL) {
        this.setState({ msg: error.msg.msg });
        this.setState({ success: false });
        this.setState({ confirming: false });
      } else {
        this.setState({ msg: null });
      }
    }

    if (success !== prevProps.success) {
      if (success.id === CONFIRMATION_SUCCESS) {
        this.setState({ msg: success.msg.msg });
        this.setState({ success: true });
        this.setState({ confirming: false });
      } else {
        this.setState({ msg: null });
      }
    }
  }

  render() {
    return (
      <Container>
        <div className='confirm d-flex justify-content-center align-items-center'>
          {this.state.confirming ? (
            <Spinner size='lg' color='primary' />
          ) : (
            <div className='fadeIn'>
              {this.state.success ? (
                <Link to='/login' className='text-success'>
                  <div className='d-flex justify-content-center'>
                    <i className='fas fa-grin-alt' />
                  </div>
                  <p>{this.state.msg}</p>
                </Link>
              ) : (
                <Link to='/' className='text-danger'>
                  <div className='d-flex justify-content-center'>
                    <i className='fas fa-frown' />
                  </div>
                  <p>{this.state.msg}</p>
                </Link>
              )}
            </div>
          )}
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  error: state.error,
  success: state.success
});

export default connect(
  mapStateToProps,
  { confirm, clearErrors, clearSuccess }
)(Confirm);
