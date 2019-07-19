import React, { Component, Fragment } from 'react';
import { Dialog } from '@reach/dialog';
import { Button } from 'reactstrap';

class ConfirmationDialog extends Component {
  state = {
    showDialog: false
  };

  openDialog = () => {
    this.setState({ showDialog: true });
  };

  closeDialog = () => {
    this.setState({ showDialog: false });
  };

  handleConfirm = () => {
    this.props.confirmAction();
    this.closeDialog();
  };

  render() {
    return (
      <Fragment>
        <Button color='danger' onClick={this.openDialog} className='w-100'>
          {this.props.buttonText}
        </Button>

        <Dialog isOpen={this.state.showDialog} onDismiss={this.closeDialog}>
          <h3>{this.props.title}</h3>
          <p>{this.props.description}</p>
          <Button onClick={this.handleConfirm}>Yes</Button>{' '}
          <Button onClick={this.closeDialog}>No</Button>
        </Dialog>
      </Fragment>
    );
  }
}

export default ConfirmationDialog;
