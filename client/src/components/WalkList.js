import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import SocketContext from './../utils/socket-context';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteWalk } from '../actions/walkActions';

class WalkList extends Component {
  static propTypes = {
    walk: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    deleteWalk: PropTypes.func.isRequired
  };

  onDeleteClick = id => {
    this.props.deleteWalk(id, this.props.socket);
  };

  render() {
    const { walks } = this.props.walk;
    return (
      <Container>
        <ListGroup>
          <TransitionGroup className='walk-list'>
            {walks.map(
              ({ _id, dogs, person, date, time, duration, pee, poop }) => (
                <CSSTransition key={_id} timeout={500} classNames='fade'>
                  <ListGroupItem className='row d-flex'>
                    <div className='col-12 col-md-2'>
                      <i className='fas fa-walking' /> {person}
                    </div>
                    <div className='col-12 col-md-2'>
                      <i className='fas fa-dog' /> {dogs}
                    </div>
                    <div className='col-12 col-md-2'>
                      <i className='fas fa-calendar-alt' /> {date}
                    </div>
                    <div className='col-12 col-md-2'>
                      <i className='far fa-clock' /> {time}
                    </div>
                    <div className='col-12 col-md-2'>
                      <i className='fas fa-stopwatch' /> {duration}
                    </div>
                    <div className='col-12 col-md-1'>
                      {pee ? <i className='fas fa-tint' /> : null}{' '}
                      {poop ? <i className='fas fa-poo' /> : null}
                    </div>
                    {this.props.isAuthenticated ? (
                      <Button
                        className='col-12 col-md mt-1 mt-md-0'
                        color='danger'
                        size='sm'
                        onClick={this.onDeleteClick.bind(this, _id)}
                      >
                        &times;
                      </Button>
                    ) : null}
                  </ListGroupItem>
                </CSSTransition>
              )
            )}
          </TransitionGroup>
        </ListGroup>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  walk: state.walk,
  isAuthenticated: state.auth.isAuthenticated
});

const WalkListWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <WalkList {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default connect(
  mapStateToProps,
  { deleteWalk }
)(WalkListWithSocket);
