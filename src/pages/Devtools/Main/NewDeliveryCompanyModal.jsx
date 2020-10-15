// @flow

import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "tabler-react";
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import setting_server from '../setting_server';


class NewDeliveryCompanyModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        country: '',
        countryOptions: '',
        companyLabel:''
      };
    }

    onTodoChange(key,value){
      this.setState({
        [key]: value
      });
    }
 
    componentWillReceiveProps(nextProps) {
    }

    componentDidMount() {
      this.getCountryOptions();
    }

    closeModal(){
      this.props.setModalShow(false);
    }

    getCountryOptions() {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/delivery', {
        req_type: "get_delivery_countries",
      })
      .then(function (response) {
        if (response['data']['success'] === true) {
          let countryOptions = response['data']['result']
              .map((code) => <option value={code}>{code}</option>);
          obj.setState({
            countryOptions: countryOptions
          });
        } else {
          console.log('getCountryOptions Failed');
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    }

    updateCountry(event) {
      this.setState({country: event.target.value});
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
                  New Delivery Company
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="form-group">
                <label for="deliveryCompanyLabel">Name</label>
                <input
                  type="text"
                  id="companyLabel"
                  name="companyLabel"
                  class="form-control"
                  value={this.state.companyLabel}
                  onChange={e => this.onTodoChange('companyLabel',e.target.value) }
                  ref={ref => this.label = ref}
                />
            </div>
          </Modal.Body>
          <Modal.Footer>
              <Button color="primary" 
                onClick={() => {
                  if(String(this.state.companyLabel) == "") {
                    NotificationManager.error('', 'Fill in the blanks.');
                  } else {
                    this.props.makeNewTargetSite(this.props.userId, this.state.companyLabel);
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
export default NewDeliveryCompanyModal;
