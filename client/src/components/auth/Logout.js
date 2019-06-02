import React, { Component, Fragment } from 'react';
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';
import PropTypes from 'prop-types';

class Logout extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired
  };

  render() {
    return (
      <Fragment>
        <NavLink
          onClick={this.props.logout}
          style={navLinkStyle}
          tag={Link}
          to='/login'
        >
          Logout
        </NavLink>
      </Fragment>
    );
  }
}

const navLinkStyle = {
  fontWeight: 'bold'
};

export default connect(
  null,
  { logout }
)(Logout);
