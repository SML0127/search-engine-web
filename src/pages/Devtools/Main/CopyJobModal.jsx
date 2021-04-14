// @flow

import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "tabler-react";
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import setting_server from '../setting_server';

class CopyJobModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          selected_job_id: '',
        };
        this.updateJobLabel = this.updateJobLabel.bind(this)
    }
    
    componentWillReceiveProps(nextProps) {
      if(nextProps.show == true){
        //this.getJobs()
        this.makeJobOptions(nextProps.jobList)
      }
    }

    closeModal(){
        this.props.setModalShow(false)
    }
    updateJobLabel(event) {
      console.log(event.target.value)
      this.setState({selected_job_id: event.target.value});
    }


    makeJobOptions(job_list){
      console.log(job_list)
      let jobLabelOptions = job_list
          .map((job_info) => <option value={job_info.id}>{job_info.label}</option>);
      console.log(jobLabelOptions)
      this.setState({
        jobLabelOptions: jobLabelOptions,
        selected_job_id: job_list[0].id,
      });
    }




    getJobs(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/job', {
        req_type: "get_job_list",
        user_id: this.props.userId
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          console.log(response['data']['result'][0][0])
          let jobLabelOptions = response['data']['result'][0][0]
              .map((job_info) => <option value={job_info.id}>{job_info.label}</option>);
          console.log(jobLabelOptions)
          obj.setState({
            jobLabelOptions: jobLabelOptions,
          });
          
        } else {
          console.log('Failed to update exchange rate');
        }
      })
      .catch(function (error){
        console.log(error);
      });
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
                    Copy exist job
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div class='row' style={{width:'100%', marginLeft:'0.2%'}}>
                  <label for="name" style={{width:'100%'}}>Select exist job</label>
                  <select
                    class="form-control"
                    style={{width:"100%", height:'40px'}}
                    value={this.state.selected_job_id}
                    onChange={this.updateJobLabel}
                  >
                    {this.state.jobLabelOptions}
                  </select>
                </div>
                <div class="form-group" style = {{width:'100%', marginTop:'8%'}}>
                    <label for="name">New job name</label>
                    <input type="text" name="groupName" class="form-control"/>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" 
                  onClick={(obj) => {
                    const new_job_label =
                        obj.currentTarget.parentNode.parentNode.childNodes[1]
                        .childNodes[1].childNodes[1].value.trim();
                    console.log(new_job_label)
                    if (new_job_label === "") {
                      NotificationManager.error('', 'Fill in the job name.');
                    } 
                    else {
                      this.props.copyExistJob(this.state.selected_job_id, new_job_label, this.props.userId);
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
export default CopyJobModal;
