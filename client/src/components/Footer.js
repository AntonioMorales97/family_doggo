import React, { Component } from 'react';
import { Container } from 'reactstrap';

class Footer extends Component {
  render() {
    return (
      <footer id='main-footer' className='bg-dark'>
        <Container>
          <div className='row'>
            <div className='col text-center'>
              <div className='py-4'>
                <h1 className='h3'>Family Dogo</h1>
                <p>Copyright &copy; 2019</p>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
