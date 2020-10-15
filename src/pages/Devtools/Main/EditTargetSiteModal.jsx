// @flow

import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "tabler-react";
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class EditTargetSiteModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          targetSiteId: null,
          targetSiteLabel: null,
          targetSiteUrl: null,
        }
    }
    
    componentWillReceiveProps(nextProps) {
      this.setState({
        targetSiteId: nextProps.targetSiteId,
        targetSiteLabel: nextProps.targetSiteLabel,
        targetSiteUrl: nextProps.targetSiteUrl,
      });
    }

    closeModal(){
      this.props.setModalShow(false);
    }

    updateLabel(evt) {
      this.setState({
        targetSiteLabel: evt.target.value
      });
    }

    updateUrl(evt) {
      this.setState({
        targetSiteUrl: evt.target.value
      });
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
                    Edit Target Site
                </Modal.Title>
                {/* <button onClick={console.log(this.state.targetSiteId)}>HERE</button> */}
            </Modal.Header>
            <Modal.Body>
              <div class="form-group">
                  <label for="targetSiteName">Target Site Label</label>
                  <input
                    type="text"
                    id="targetSiteLabel"
                    name="targetSiteLabel"
                    class="form-control"
                    value={this.state.targetSiteLabel}
                    onChange={evt => this.updateLabel(evt)}
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
                    value={this.state.targetSiteUrl}
                    onChange={evt => this.updateUrl(evt)}
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
                      this.props.editTargetSite(this.props.targetSiteId, targetSiteLabel, targetSiteUrl);
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
            <NotificationContainer />
            </Modal>
        );
    }
}
export default EditTargetSiteModal;
