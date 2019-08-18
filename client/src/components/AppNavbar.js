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
import Logout from './auth/Logout';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class AppNavbar extends Component {
  state = {
    isOpen: false
  };

  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  collapseOnEnter = () => {
    document.addEventListener('mousedown', this.handleClick, false);
  };

  collapseOnExit = () => {
    document.removeEventListener('mousedown', this.handleClick, false);
  };

  handleClick = e => {
    e.preventDefault();
    if (this.navbar.contains(e.target)) {
      // Click is inside
      return;
    }
    // Click is outside, toggle.
    this.toggle();
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const guestLinks = (
      <Fragment>
        <NavItem>
          <NavLink style={navLinkStyle} tag={Link} to='/' onClick={this.toggle}>
            Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            style={navLinkStyle}
            tag={Link}
            to='/register'
            onClick={this.toggle}
          >
            Register
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            style={navLinkStyle}
            tag={Link}
            to='/login'
            onClick={this.toggle}
          >
            Login
          </NavLink>
        </NavItem>
      </Fragment>
    );

    const authLinks = (
      <Fragment>
        <NavItem>
          <span className='navbar-text mr-3'>
            <strong>{user ? `Welcome ${user.name}` : ''}</strong>
          </span>
        </NavItem>
        <NavItem>
          <NavLink style={navLinkStyle} tag={Link} to='/' onClick={this.toggle}>
            Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            style={navLinkStyle}
            tag={Link}
            to='/dashboard'
            onClick={this.toggle}
          >
            Dashboard
          </NavLink>
        </NavItem>
        <NavItem onClick={this.toggle}>
          <Logout />
        </NavItem>
      </Fragment>
    );

    return (
      <div ref={navbar => (this.navbar = navbar)}>
        <Navbar color='dark' dark expand='sm' className='mb-3 fixed-top'>
          <Container>
            <NavbarBrand href='/'>
              <h4>Family Doggo</h4>
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse
              isOpen={this.state.isOpen}
              navbar
              onEnter={this.collapseOnEnter}
              onExit={this.collapseOnExit}
            >
              <Nav className='ml-auto' navbar>
                {isAuthenticated ? authLinks : guestLinks}
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

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(AppNavbar);
