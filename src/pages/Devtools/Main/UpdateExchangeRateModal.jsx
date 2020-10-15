// @flow

import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "tabler-react";
import axios from 'axios';

class UpdateExchangeRateModal extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentWillReceiveProps(nextProps) {
    }

    closeModal(){
      this.props.setModalShow(false);
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
                    Update Exchange Rate
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            Update exchange rates may affect shipping fee and pricing information.
            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" 
                  onClick={() => {
                    this.props.updateExchangeRate()
                    this.closeModal();
                  }}
                >
                  Ok
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
export default UpdateExchangeRateModal;
