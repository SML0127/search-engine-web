// @flow

import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "tabler-react";
import axios from 'axios';

class DeleteGroupModal extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentWillReceiveProps(nextProps) {
    }

    closeModal(){
      this.props.setModalShow(false, this.props.index);
    }

    render() {
        return (
            <Modal
                // {...this.props}
                show={this.props.show}
                size="sm"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={ () => {
                    this.closeModal();
                }}
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Delete Group
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure to delete this group?
              All jobs in this group will be lost forever.
              <div style={{fontWeight: "bold"}}>{this.props.groupLabel}</div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" 
                  onClick={() => {
                    this.props.deleteGroup(this.props.groupId);
                    this.closeModal();
                  }}
                >
                  Delete
                </Button>
                <Button color="secondary" 
                  onClick={() => {
                    this.closeModal()
                  }}
                >
                  Cancel
                </Button>
            </Modal.Footer>
            </Modal>
        );
    }
}
export default DeleteGroupModal;
