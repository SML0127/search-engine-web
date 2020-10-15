// @flow

import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "tabler-react";
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class NewGroupModal extends React.Component {
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
                    New Group
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div class="form-group">
                    <label for="name">New Group Name</label>
                    <input type="text" name="groupName" class="form-control"/>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" 
                  onClick={(obj) => {
                    const groupName =
                        obj.currentTarget.parentNode.parentNode.childNodes[1]
                        .childNodes[0].childNodes[1].value.trim();
                    if (groupName === "") {
                      NotificationManager.error('', 'Fill in the group name.');
                    } else if (this.props.groupNameList.includes(groupName)) {
                      NotificationManager.error('', 'group name duplicated!');
                    } else {
                      this.props.makeNewGroup(groupName, this.props.userId);
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
export default NewGroupModal;
