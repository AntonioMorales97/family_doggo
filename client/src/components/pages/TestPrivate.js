import React, { Component } from 'react';

class TestPrivate extends Component {
  render() {
    return (
      <div>
        <h3 style={style}>HEJDÅ</h3>
      </div>
    );
  }
}

const style = {
  paddingTop: '200px'
};

export default TestPrivate;
