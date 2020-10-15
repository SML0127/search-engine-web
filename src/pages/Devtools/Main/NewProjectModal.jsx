// @flow

import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "tabler-react";
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class NewProjectModal extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentWillReceiveProps(nextProps) {
    }

    closeModal(){
        this.props.setModalShow(false)
    }

    render() {
        return (
            <Modal
                {...this.props}
                size="sm"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={ () => {
                    this.props.setModalShow(false);
                }}
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    New Program
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div class="form-group">
                    <label for="name">New Project Name</label>
                    <input type="text" name="projectName" class="form-control"/>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" 
                  onClick={(obj) => {
                    const projectName =
                        obj.currentTarget.parentNode.parentNode.childNodes[1]
                        .childNodes[0].childNodes[1].value.trim();
                    if (projectName === "") {
                      NotificationManager.error('', 'Fill in the project name.');
                    } else if (this.props.projectNameList.includes(projectName)) {
                      NotificationManager.error('', 'Project name duplicated!');
                    } else {
                      this.props.makeNewProject(projectName, this.props.userId);
                      this.closeModal();
                    }
                  }}
                >
                  OK
                </Button>
                <Button color="secondary" 
                  onClick={(obj) => {
                    this.closeModal()
                  }}
                >
                  Close
                </Button>
            </Modal.Footer>
            <NotificationContainer />
            </Modal>
        );
    }
}
export default NewProjectModal;
