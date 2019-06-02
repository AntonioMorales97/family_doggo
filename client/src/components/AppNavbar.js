import React, { Component, Fragment } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink,
  NavItem,
  Container
} from 'reactstrap';
import { Link } from 'react-router-dom';

class AppNavbar extends Component {
  state = {
    isOpen: false
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const guestLinks = (
      <Fragment>
        <NavItem>
          <NavLink style={navLinkStyle} tag={Link} to='/'>
            Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink style={navLinkStyle} tag={Link} to='/register'>
            Register
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink style={navLinkStyle} tag={Link} to='/login'>
            Login
          </NavLink>
        </NavItem>
      </Fragment>
    );

    return (
      <div>
        <Navbar color='dark' dark expand='sm' className='mb-3 fixed-top'>
          <Container>
            <NavbarBrand href='/'>
              <h4>Family Dogo</h4>
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className='ml-auto' navbar>
                {guestLinks}
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

const navLinkStyle = {
  fontWeight: 'bold'
};

export default AppNavbar;
