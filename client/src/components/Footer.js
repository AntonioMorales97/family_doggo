import React, { Component } from 'react';
import { Container } from 'reactstrap';
import CookieInformationModal from './modals/CookieInformationModal';

class Footer extends Component {
  render() {
    return (
      <footer id='main-footer' className='bg-dark'>
        <Container>
          <div className='row'>
            <div className='col text-center'>
              <div className='py-4'>
                <h1 className='h3'>Family Doggo</h1>
                <p>Copyright &copy; 2019 </p>
                <CookieInformationModal buttonText='Cookie Policy' />
              </div>
            </div>
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
