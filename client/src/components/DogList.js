import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ConfirmationDialog from './ConfirmationDialog';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteDog } from './../actions/dogActions';

class DogList extends Component {
  static propTypes = {
    dog: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool
  };

  onDeleteClick = id => {
    this.props.deleteDog(id);
  };

  render() {
    const { dogs } = this.props.dog;
    return (
      <Container className='dog-list-container mb-2'>
        <ListGroup>
          <TransitionGroup className='dog-list'>
            {dogs.map(({ _id, name }) => (
              <CSSTransition key={_id} timeout={500} classNames='fade'>
                <ListGroupItem className='row d-block d-sm-flex'>
                  <div className='col col-sm-10'>
                    <i className='fas fa-dog' /> {name}
                  </div>
                  {this.props.isAuthenticated ? (
                    <div className='col col-sm-2 mt-2 mt-sm-0'>
                      <ConfirmationDialog
                        title={`Are you sure you want to remove ${name}?`}
                        description='You can always add a dog again :)'
                        buttonText='x'
                        confirmAction={this.onDeleteClick.bind(this, _id)}
                      />
                    </div>
                  ) : null}
                </ListGroupItem>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ListGroup>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  dog: state.dog,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { deleteDog }
)(DogList);
