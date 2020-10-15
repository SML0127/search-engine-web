// @flow

import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "tabler-react";
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class NewTargetSiteModal extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentWillReceiveProps(nextProps) {
    }

    closeModal(){
      this.props.setModalShow(false);
    }

    render() {
      const obj = this;
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
                    New Target Site
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class="form-group">
                  <label for="targetSiteLabel">Target Site Label</label>
                  <input
                    type="text"
                    id="targetSiteLabel"
                    name="targetSiteLabel"
                    class="form-control"
                    ref={ref => this.label = ref}
                  />
              </div>
              <div class="form-group">
                  <label for="targetSiteUrl">Target Site URL</label>
                  <input
                    type="text"
                    id="targetSiteUrl"
                    name="targetSiteUrl"
                    class="form-control"
                    ref={ref => this.url = ref}
                  />
              </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" 
                  onClick={() => {
                    const targetSiteLabel = this.label.value;
                    const targetSiteUrl = this.url.value;
                    if(targetSiteLabel === "" || targetSiteUrl === "") {
                      NotificationManager.error('', 'Fill in the blanks.');
                    } else if (this.props.targetSiteLabelList.includes(targetSiteLabel)) {
                      NotificationManager.error('', 'Target site label duplicated!');
                    } else {
                      this.props.makeNewTargetSite(this.props.userId, targetSiteLabel, targetSiteUrl);
                      this.closeModal();
                    }
                  }}
                >
                  OK
                </Button>
                <Button color="secondary" 
                  onClick={(obj) => {
                    this.closeModal();
                  }}
                >
                  Close
                </Button>
            </Modal.Footer>
            </Modal>
        );
    }
}
export default NewTargetSiteModal;
