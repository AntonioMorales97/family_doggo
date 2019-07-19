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
import { clearErrors } from './../../actions/errorActions';
import { clearSuccess } from './../../actions/successActions';

class Dashboard extends Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    getDogs: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getDogs();
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
    );
  }
}

const mapStateToProps = state => ({
  error: state.error,
  success: state.success,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getDogs, clearErrors, clearSuccess }
)(Dashboard);
