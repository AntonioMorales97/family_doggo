import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';

class NotFound extends Component {
  render() {
    return (
      <Container>
        <div className='not-found d-flex justify-content-center align-items-center'>
          <div className='fadeIn'>
            <Link to='/' className='text-danger'>
              <div className='d-flex justify-content-center'>
                <i className='fas fa-frown' />
              </div>
              <p>The page you were trying to find does not exist.</p>
            </Link>
          </div>
        </div>
      </Container>
    );
  }
}

export default NotFound;
