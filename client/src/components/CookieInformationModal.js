import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

class CookieInformationModal extends Component {
  state = {
    modal: false
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  // Remove focus on link after click...
  onMouseDown = e => {
    e.preventDefault();
  };

  render() {
    return (
      <div>
        <Button
          color='link'
          onClick={this.toggle}
          onMouseDown={this.onMouseDown}
        >
          {this.props.buttonText ? this.props.buttonText : 'Read More...'}
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Cookie Information</ModalHeader>
          <ModalBody>
            <p className='lead'>
              We are currently using one cookie called 'token'. This cookie is
              used for authentication of our users and is more secure to have as
              a cookie which cannot be read from JavaScript code (cookie is
              httpOnly).
            </p>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default CookieInformationModal;
