import React, { Component } from 'react';
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from 'reactstrap';

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
    msg: null
  };

  onSubmit = e => {
    e.preventDefault();
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <section id='register-section'>
        <div className='register-inner'>
          <Container>
            <div className='light-overlay'>
              <Container className='form-container'>
                <div className='h3 text-center'>Register</div>
                <Form onSubmit={this.onSubmit}>
                  <FormGroup>
                    <Label for='name'>Name</Label>
                    <Input
                      type='text'
                      name='name'
                      id='name'
                      placeholder='Name'
                      className='mb-3'
                      onChange={this.onChange}
                    />
                    <Label for='email'>Email</Label>
                    <Input
                      type='email'
                      name='email'
                      id='email'
                      placeholder='Email'
                      className='mb-3'
                      onChange={this.onChange}
                    />
                    <Label for='password'>Password</Label>
                    <Input
                      type='password'
                      name='password'
                      id='password'
                      placeholder='Password'
                      className='mb-3'
                      onChange={this.onChange}
                    />
                    <Label for='repeatPassword'>Repeat Password</Label>
                    <Input
                      type='password'
                      name='repeatPassword'
                      id='repeatPassword'
                      placeholder='Repeat Password'
                      className='mb-3'
                      onChange={this.onChange}
                    />
                    <Button color='dark' style={{ marginTop: '2rem' }} block>
                      Register
                    </Button>
                  </FormGroup>
                </Form>
              </Container>
            </div>
          </Container>
        </div>
      </section>
    );
  }
}

export default Register;
