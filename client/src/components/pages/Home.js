import React, { Component, Fragment } from 'react';
import { Container } from 'reactstrap';

class Home extends Component {
  render() {
    return (
      <Fragment>
        <header id='home-section'>
          <div className='dark-overlay'>
            <Container className='home-inner'>
              <div className='row'>
                <div className='col-lg-12 d-block'>
                  <h1 className='display-4 '>
                    We Love Dogs <i className='fas fa-paw' />
                  </h1>
                  <div className='d-flex flex-row'>
                    <div className='p-4 align-self-start'>
                      <i className='fa fa-check' />
                    </div>
                    <div className='p-4 align-self-end key'>
                      Create accounts and join with your family
                    </div>
                  </div>
                  <div className='d-flex flex-row'>
                    <div className='p-4 align-self-start'>
                      <i className='fa fa-check' />
                    </div>
                    <div className='p-4 align-self-end key'>
                      Keep track of the walks with your dog
                    </div>
                  </div>
                  <div className='d-flex flex-row'>
                    <div className='p-4 align-self-start'>
                      <i className='fa fa-check' />
                    </div>
                    <div className='p-4 align-self-end key'>
                      Completely free!
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </header>
        <section id='about-section'>
          <Container>
            <div className='row'>
              <div className='col-md-6'>
                <img
                  src={require('../../img/about_dog.jpg')}
                  alt='cute dogo'
                  className='img-fluid pt-4 mb-3 rounded-circle'
                />
              </div>
              <div className='col-md-6 text-center'>
                <div className='p-5'>
                  <h1 className='display-4'>
                    About <i className='fas fa-paw' />
                  </h1>
                  <p className='lead'>
                    A simple and easy web application to help families with dogs
                    to keep track on the daily walks. Register and login to
                    start keeping track on the walks with your best friend!
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </Fragment>
    );
  }
}

export default Home;
