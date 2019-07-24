import React, { Component, Fragment } from 'react';
import { Container } from 'reactstrap';
import AddWalkModal from '../modals/dashboard_modals/AddWalkModal';
import CreateFamilyModal from '../modals/dashboard_modals/CreateFamilyModal';
import HandleFamilyModal from '../modals/dashboard_modals/HandleFamilyModal';
import InviteToFamilyModal from '../modals/dashboard_modals/InviteToFamilyModal';
import WalkList from '../WalkList';

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
    this.socket = io.connect(server);
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    getDogs: PropTypes.func.isRequired,
    loadInitWalks: PropTypes.func.isRequired,
    addedWalks: PropTypes.func.isRequired,
    deletedWalks: PropTypes.func.isRequired
  };

  componentDidMount() {
    if (this.props.auth.hasFamily) {
      this.props.getDogs();
      this.setUpSocket();
      console.log('Has family, load walks');
    }
  }

  componentDidUpdate(prevProps) {
    const auth = this.props.auth;
    if (auth.hasFamily !== prevProps.auth.hasFamily) {
      if (auth.hasFamily) {
        this.props.getDogs();
        this.setUpSocket();
        console.log('Has now family, load walks');
      }
    }
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Cleanup, closed');
    }
  }

  setUpSocket() {
    //socket = io.connect(server);
    this.props.loadInitWalks(this.socket);
    this.props.addedWalks(this.socket);
    this.props.deletedWalks(this.socket);
  }

  render() {
    return (
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
                          <SocketContext.Provider value={this.socket}>
                            <AddWalkModal />
                          </SocketContext.Provider>
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
                    <SocketContext.Provider value={this.socket}>
                      <WalkList />
                    </SocketContext.Provider>
                  </Fragment>
                ) : (
                  <h3>Create a family to start adding walks</h3>
                )}
              </Container>
            </div>
          </Container>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getDogs, loadInitWalks, addedWalks, deletedWalks }
)(Dashboard);
