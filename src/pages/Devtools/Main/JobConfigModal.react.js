// @flow

import ReactTable from "react-table"
import 'react-table/react-table.css'
import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import ConfigCategoryTree from '../TreeView/components/config-category-tree';
import TargetConfigCategoryTree from '../TreeView/components/vm-config-category-tree';
import SchedulingConfigCategoryTree from '../TreeView/components/scheduling-config-category-tree';
import jobConfigIcon from './job_config.png';
import {
  Form,
  Page,
  Card,
  Button,
} from "tabler-react";
import setting_server from '../setting_server';
import Checkbox from 'rc-checkbox';


class JobConfigModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
        this.saveScheduleProperty = this.saveScheduleProperty.bind(this)
        this.saveMySiteProperty = this.saveMySiteProperty.bind(this)
        this.checkBoxC = this.checkBoxC.bind(this);
        this.checkBoxVMM = this.checkBoxVMM.bind(this);
        this.checkBoxVMT = this.checkBoxVMT.bind(this);
    }
    
    onChange = date => this.setState({ date_psql: this.changeDateFormat(date) })

    checkBoxC(){
      this.setState({check_c : !this.state.check_c})
    }

    checkBoxVMM(){
      this.setState({check_vmm : !this.state.check_vmm})
    }

    checkBoxVMT(){
      this.setState({check_vmt : !this.state.check_vmt})
    }

    onTodoChange(key,value){
      this.setState({
        [key]: value
      });
    }
    saveScheduleProperty(start_date, end_date, period){
       this.state.start_date = start_date;
       this.state.end_date = end_date;
       this.state.period = period;
       //this.setState({start_date: start_date, end_date: end_date, period: period})      
    }

    saveMySiteProperty(my_site_category){
       this.state.my_site_category = my_site_category;
       //this.setState({my_site_category: my_site_category})      
    }

    registerAirflowScheduling(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
        req_type: "make_airflow_script",
        job_id: obj.props.JobId,
        start_date: obj.state.start_date,
        end_date: obj.state.end_date,
        period: obj.state.period,
        check_c: obj.state.check_c,
        check_m: obj.state.check_vmm,
        check_t: obj.state.check_vmt,
        user_id: obj.props.userId
      })
      .then(function (response) {
        
      })
      .catch(function (error){
        console.log(error);
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
          let num_worker = response['data']['result'][0][4]
          let num_thread = response['data']['result'][0][5]
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
          //console.log('get_url Failed');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    
    componentDidMount(){
      //this.getTargetSites(this.props.JobId);
    }
    
    componentWillReceiveProps(nextProps) {
      if(nextProps.show == true){
        this.loadJobCountry();
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
          num_worker: 1,
          num_thread: 1,
          numWorker: 1,
          numThread: 1,
          cid: -999,
          cnum: -999,
          check_c: true,
          check_vmm: true,
          check_vmt: true
        }
    }


    //getSavedJobConfig(){
    //  const obj = this;
    //  axios.post(setting_server.DB_SERVER+'/api/db/targetsite', {
    //    req_type: "get_target_sites",
    //    job_id: this.props.JobId
    //  })
    //  .then(function (response) {
    //    if (response['data']['success'] == true) {
    //      let targetSites = response['data']['result'];
    //      targetSites = targetSites.map(function(row, index){
    //        const id = row[0];
    //        const label = row[1];
    //        const url = row[2];
    //        return {num: index+1, id: id, label: label, url: url};
    //      });
    //      obj.setState({targetSites: targetSites});
    //    } else {
    //      console.log('getTargetSites Failed');
    //    }
    //  })
    //  .catch(function (error){
    //    console.log(error);
    //  });
    //}

    //getTargetSites(userId){
    //  const obj = this;
    //  axios.post(setting_server.DB_SERVER+'/api/db/targetsite', {
    //    req_type: "get_target_sites",
    //    user_id: userId
    //  })
    //  .then(function (response) {
    //    if (response['data']['success'] == true) {
    //      let targetSites = response['data']['result'];
    //      targetSites = targetSites.map(function(row, index){
    //        const id = row[0];
    //        const label = row[1];
    //        const url = row[2];
    //        return {num: index+1, id: id, label: label, url: url};
    //      });
    //      obj.setState({targetSites: targetSites});
    //    } else {
    //      console.log('getTargetSites Failed');
    //    }
    //  })
    //  .catch(function (error){
    //    console.log(error);
    //  });
    //}


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
                  <img
                    src={jobConfigIcon}
                    width="30"
                    height="30"
                    style={{
                      cursor: "pointer",
                    }}
                  />
                    Job Configuration
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Page.Card 
                  title={"Scheduling properties"}
              > 
                <SchedulingConfigCategoryTree refresh = {this.state.refresh} jobId={this.props.JobId}  userId={this.props.userId} saveScheduleProperty = {this.saveScheduleProperty} startDate={this.state.start_date} endDate={this.state.end_date} period={this.state.period} />
              </Page.Card>
              <Page.Card 
                  title={"My site properties"}
              > 
                <ConfigCategoryTree  refresh = {this.state.refresh}jobId={this.props.JobId} userId={this.props.userId} saveMySiteProperty = {this.saveMySiteProperty} mCategory = {this.state.m_category}/>
              </Page.Card>
              <Page.Card 
                  title={"Target site properties"}
              >
                <TargetConfigCategoryTree  refresh = {this.state.refresh} jobId={this.props.JobId} userId={this.props.userId} country={this.state.country}  targetsiteId={this.state.targetsite_id} tCategory={this.state.t_category} tPid = {this.state.transformation_program_id} cid = {this.state.cid} cnum = {this.state.cnum}/>
              </Page.Card>            

              <div class='row' style = {{marginTop:'-3%'}}>
                 <label style={{marginLeft:'50%',width:'8%',marginTop:'0.5%', float: 'right'}}> # of Worker :</label>
                 <input name="name"type="number" min="1" class="form-control" style={{width:"15%", float: 'right'}}  value= {this.state.numWorker} onChange={e => this.onTodoChange('numWorker',e.target.value)}/>
                 <label style={{width:'8%',marginLeft:'1%', marginTop:'0.5%',float: 'right'}}> # of thread :</label>
                 <input name="name" type="number" min="1"  class="form-control"  style={{width:"15%", float: 'right'}} value= {this.state.numThread} onChange={e => this.onTodoChange('numThread',e.target.value)}/>
              </div>
               
              <div class='row' style = {{width:'100%'}}>
                <Button 
                  class="btn btn-outline-dark"
                  type="button"
                  onClick = {()=> this.setState({refresh: this.state.refresh+1}, ()=> {this.saveJobProperties()})}
                  style={{marginLeft:'93%', marginTop:'1%'}}
                >
                Save
                </Button>
              </div>
              <div class='row' style = {{width:'100%'}}>
                <label style = {{marginLeft:'11%', marginTop:'2.4%'}} >
                Check the task in the scheduling ( Crawling ?
                </label>
                <div
                  onClick = {()=> this.checkBoxC()}
                >
                  <Checkbox
                    style={{width:'1%', height:'1%', paddingTop:'2.9%',marginTop:'225%'}}
                    checked={this.state.check_c}
                  />
                </div>
                <label style = {{marginLeft:'2%', marginTop:'2.4%'}}>
                ViewMaintenance(My site) ?
                </label>
                <div
                  onClick = {e=> this.checkBoxVMM()}
                >
                  <Checkbox
                    style={{width:'1%', height:'1%', paddingTop:'2.9%',marginTop:'225%'}}
                    checked={this.state.check_vmm}
                  />
                </div>
                <label  style = {{marginLeft:'2%', marginTop:'2.4%'}}>
                ViewMaintenance(Target site) ?
                </label>
                <div
                  onClick = {e => this.checkBoxVMT()}
                >
                  <Checkbox
                    style={{width:'1%', height:'1%', paddingTop:'2.9%',marginTop:'225%'}}
                    checked={this.state.check_vmt}
                    onClick = {e => this.checkBoxVMT()}
                  />
                </div>
                <label style = {{marginLeft:'1%', marginTop:'2.4%'}}>
                )
                </label>
                <Button 
                  class="btn btn-outline-dark"
                  type="button"
                  onClick = {()=> {this.registerAirflowScheduling()}}
                  style={{marginLeft:'1%', marginTop:'2%'}}
                >
                Register Scheduling
                </Button> 
              </div>
            </Modal.Body>
            </Modal>
        );
    }
}
export default JobConfigModal;
