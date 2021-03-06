import React, { Component, Fragment } from 'react';
import { Container } from 'reactstrap';
import AddWalkModal from '../modals/dashboard_modals/AddWalkModal';
import CreateFamilyModal from '../modals/dashboard_modals/CreateFamilyModal';
import HandleFamilyModal from '../modals/dashboard_modals/HandleFamilyModal';
import InviteToFamilyModal from '../modals/dashboard_modals/InviteToFamilyModal';
import WalkList from '../WalkList';

import { LEAVE_FAMILY_SUCCESS } from '../../actions/types';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getDogs } from './../../actions/dogActions';
import {
  loadInitWalks,
  addedWalks,
  deletedWalks
} from './../../actions/walkActions';

import server from '../../config/config';
import io from 'socket.io-client';
import SocketContext from '../../utils/socket-context';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
  }

  state = {
    hasSocket: false
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired,
    getDogs: PropTypes.func.isRequired,
    loadInitWalks: PropTypes.func.isRequired,
    addedWalks: PropTypes.func.isRequired,
    deletedWalks: PropTypes.func.isRequired
  };

  componentDidMount() {
    if (this.props.auth.hasFamily) {
      this.props.getDogs();
      this.setUpSocket();
    }
  }

  componentDidUpdate(prevProps) {
    const { success, auth } = this.props;
    if (success !== prevProps.success) {
      if (success.id === LEAVE_FAMILY_SUCCESS) {
        this.socket.disconnect();
        this.socket = null;
        this.setState({ hasSocket: false });
      }
    }

    if (auth.hasFamily !== prevProps.auth.hasFamily) {
      if (auth.hasFamily) {
        this.props.getDogs();
        this.setUpSocket();
      }
    }
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  setUpSocket() {
    console.log('Setting up socket...');
    this.socket = io.connect(server);
    this.props.loadInitWalks(this.socket);
    this.props.addedWalks(this.socket);
    this.props.deletedWalks(this.socket);
    this.setState({ hasSocket: true }); //needs to trigger a re-rendering!
    console.log('Socket is up');
  }

  render() {
    return (
      <SocketContext.Provider value={this.socket}>
        <section id='dashboard-page'>
          <div className='dashboard-inner'>
            <Container>
              <div className='light-bg'>
                <Container className='dashboard-container'>
                  <Container className='upper-container'>
                    <div className='d-block d-sm-flex flex-row justify-content-end'>
                      {this.props.auth.hasFamily ? (
                        <Fragment>
                          <div className='mb-1 mb-sm-0'>
                            <AddWalkModal />
                          </div>
                          <div className='ml-0 ml-sm-1 mb-1 mb-sm-0'>
                            <HandleFamilyModal />{' '}
                          </div>
                        </Fragment>
                      ) : null}
                      <div className='ml-0 ml-sm-1'>
                        {this.props.auth.hasFamily ? (
                          <InviteToFamilyModal />
                        ) : (
                          <CreateFamilyModal />
                        )}
                      </div>
                    </div>
                  </Container>
                  <hr />
                  {this.props.auth.hasFamily ? (
                    <Fragment>
                      <h3>
                        Walks{' '}
                        <small className='text-muted'>
                          with your best friend
                        </small>
                      </h3>
                      <WalkList />
                    </Fragment>
                  ) : (
                    <h3>Create a family to start adding walks</h3>
                  )}
                </Container>
              </div>
            </Container>
          </div>
        </section>
      </SocketContext.Provider>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  success: state.success
});

export default connect(
  mapStateToProps,
  { getDogs, loadInitWalks, addedWalks, deletedWalks }
)(Dashboard);
