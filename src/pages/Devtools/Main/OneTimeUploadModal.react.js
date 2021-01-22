// @flow

import ReactTable from "react-table"
import 'react-table/react-table.css'
import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import ConfigCategoryTree from '../TreeView/components/config-category-tree';
import TargetConfigCategoryTree from '../TreeView/components/vm-config-category-tree';
import jobConfigIcon from './job_config.png';
import {
  Form,
  Page,
  Card,
  Button,
} from "tabler-react";
import setting_server from '../setting_server';


class OneTimeUploadModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
    }
    
    onChange = date => this.setState({ date_psql: this.changeDateFormat(date) })


    updateMysite(){
      const obj = this;
      axios.post(setting_server.DRIVER_UTIL_SERVER+'/api/driver/', {
        req_type: "update_mysite",
        job_id: obj.props.JobId,
      })
      .then(function (response) {
        console.log(response['data'])
        if (response['data']['success'] == true) {
         
        } else {
          console.log('Failed to update mysite');
        }
      })
      .catch(function (error){
        console.log('Failed to update mysite');
        console.log(error);
      });
    }



    updateTargetsite(){
      const obj = this;
      axios.post(setting_server.DRIVER_UTIL_SERVER+'/api/driver/', {
        req_type: "update_targetsite",
        job_id: obj.props.JobId,
      })
      .then(function (response) {
        console.log(response['data'])
        if (response['data']['success'] == true) {
         
        } else {
          console.log('Failed to update mysite');
        }
      })
      .catch(function (error){
        console.log('Failed to update mysite');
        console.log(error);
      });
    }


    onTodoChange(key,value){
      this.setState({
        [key]: value
      });
    }




    checkIsNull(value){
       if(value == null || !value || typeof value === undefined ){
         return ''
       }
       else{
         return value
       }
    }

    saveJobProperties(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
        req_type: "save_job_properties",
        job_id: this.checkIsNull(obj.props.JobId),
        start_date: this.checkIsNull(obj.state.start_date) == '' ? '2020-01-01 00:00:00' : this.checkIsNull(obj.state.start_date),
        end_date: this.checkIsNull(obj.state.end_date) == '' ? '2020-01-01 00:00:00' : this.checkIsNull(obj.state.end_date),
        period: this.checkIsNull(obj.state.period),
        m_category: this.checkIsNull(obj.state.my_site_category),
        num_worker: this.checkIsNull(obj.state.numWorker),
        num_thread: this.checkIsNull(obj.state.numThread)
      })
      .then(function (response) {
        
      })
      .catch(function (error){
        console.log(error);
      });
    }



    loadJobProperties(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
        req_type: "load_job_properties",
        job_id: obj.props.JobId,
      })
      .then(function (response) {
        if(response['data']['result'].length == 0){
          return;
        }
        if (response['data']['success'] == true) {
          let start_date = response['data']['result'][0][0]
          let end_date = response['data']['result'][0][1]
          let period = response['data']['result'][0][2]
          let m_category = response['data']['result'][0][3]
          let num_worker = response['data']['result'][0][7]
          let num_thread = response['data']['result'][0][8]
          obj.setState({start_date: start_date, end_date: end_date, period:period, m_category: m_category,  numWorker: num_worker, numThread: num_thread})
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }



    loadJobPropertiesOld(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
        req_type: "load_job_properties",
        job_id: obj.props.JobId,
      })
      .then(function (response) {
        console.log(response)
        if(response['data']['result'].length == 0){
          return;
        }
        if (response['data']['success'] == true) {
          let start_date = response['data']['result'][0][0]
          let end_date = response['data']['result'][0][1]
          let period = response['data']['result'][0][2]
          let m_category = response['data']['result'][0][3]
          let targetsite_id = response['data']['result'][0][4]
          let t_category = response['data']['result'][0][5]
          let transformation_program_id = response['data']['result'][0][6]
          let num_worker = response['data']['result'][0][7]
          let num_thread = response['data']['result'][0][8]
          let cid = response['data']['result'][0][9]
          let cnum = response['data']['result'][0][10]
          obj.setState({start_date: start_date, end_date: end_date, period:period, m_category: m_category, targetsite_id: targetsite_id, t_category:t_category, transformation_program_id:transformation_program_id, numWorker: num_worker, numThread: num_thread, cid: cid, cnum: cnum})
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

    loadJobCountry() {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/job', {
        req_type: "get_country",
        job_id: obj.props.JobId,
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          obj.setState({country: response['data']['result'][0]});
        } else {
          console.log('get_url Failed');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    
    componentDidMount(){
      //this.getTargetSites(this.props.JobId);
      this.loadJobCountry();
      this.loadJobProperties();
    }
    
    componentWillReceiveProps(nextProps) {
      if(nextProps.show == true){
        this.loadJobProperties();
      }
      //this.loadUserProgram(nextProps);
    }

    initState() {
      let curUrl = window.location.href;
        return {
          refresh: 0,
          period: 7,
          targetsite_id: -999,
          transformation_program_id: -999,
          cid: -999,
          cnum: -999,
        }
    }

    closeModal(){
        this.props.setModalShow(false)
    }

    render() {
        return (
            <Modal
                {...this.props}
                size='xl'
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={ () => {
                    this.props.setModalShow(false);
                }}
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Upload / Update 
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Page.Card 
                  title={"To My site"}
              > 
                <ConfigCategoryTree  refresh = {this.state.refresh}jobId={this.props.JobId} userId={this.props.userId} saveMySiteProperty = {this.saveMySiteProperty} mCategory = {this.state.m_category}/>
                <div class = 'row' style = {{width:'100%', height:'5px'}}></div>
                <Button
                  color="primary"
                  style = {{float:'right'}}
                  onClick={() => {
                        this.updateMysite()
                      }
                  }
                >
                Run
                </Button>

              </Page.Card>
              <Page.Card 
                  title={"To Target site"}
              >
                <TargetConfigCategoryTree  refresh = {this.state.refresh} jobId={this.props.JobId} userId={this.props.userId} country={this.state.country}  targetsiteId={this.state.targetsite_id} tCategory={this.state.t_category} tPid = {this.state.transformation_program_id} cid = {this.state.cid} cnum = {this.state.cnum}/>
                <div class = 'row' style = {{width:'100%', height:'5px'}}></div>
                <Button
                  color="primary"
                  style = {{float:'right'}}
                  onClick={() => {
                        this.updateTargetsite()
                      }
                  }
                >
                Run
                </Button>

              </Page.Card> 
            </Modal.Body>
            </Modal>
        );
    }
}
export default OneTimeUploadModal;
