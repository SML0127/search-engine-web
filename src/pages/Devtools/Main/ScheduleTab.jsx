// @flow

import ReactTable from "react-table";
import * as React from "react";
import $ from 'jquery';

import Collapsible from 'react-collapsible';
import ReteGraph from "../rete/ReteGraph.react";
import {
  Form,
  Page,
  Grid,
  Card,
  Button,
  colors,
  TabbedCard,
  Tab,
} from "tabler-react";
import axios from 'axios';
import NewTargetSiteModal from './NewTargetSiteModal';
import EditTargetSiteModal from './EditTargetSiteModal';
import UpdateExchangeRateModal from './UpdateExchangeRateModal';
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Switch from "react-switch";
import setting_server from '../setting_server';

class ScheduleTab extends React.Component {

    constructor(props) {
        super(props);
        let curUrl = window.location.href;
        this.state = {
          usage: '',
          selectedScheduleIndex: null,
          selectedScheduleJobId: null,
          selectedScheduleJobLabel: null,
          checked: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(row) {
      this.state.registeredSchedules[row.original.num - 1]['activate'] = !this.state.registeredSchedules[row.original.num - 1]['activate'];
      this.setState({})
      let dag_id = row.original.job_label.replace(/ /gi, '_')
      if (this.state.registeredSchedules[row.original.num - 1]['activate'] == true){
        console.log('Activate schedule')
        this.setActivateSchedule(row.original.job_id)
        this.activateSchedule(dag_id)
      }
      else{
        console.log('Deactivate schedule')
        this.setDeactivateSchedule(row.original.job_id)
        this.deactivateSchedule(dag_id)
      }
    }


   setActivateSchedule(job_id){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
        req_type: "set_activate_schedule",
        job_id: job_id
      })
      .then(function (response) {
      })
      .catch(function (error){
        console.log(error);
      });
    }

   setDeactivateSchedule(job_id){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
        req_type: "set_deactivate_schedule",
        job_id: job_id
      })
      .then(function (response) {
      })
      .catch(function (error){
        console.log(error);
      });
    }


    activateSchedule(dag_id){
      const obj = this;
      axios.post(setting_server.DRIVER_UTIL_SERVER+'/api/driver/', {
        req_type: "activate_schedule",
        dag_id: dag_id
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
        } else {
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }



    deactivateSchedule(dag_id){
      const obj = this;
      axios.post(setting_server.DRIVER_UTIL_SERVER+'/api/driver/', {
        req_type: "deactivate_schedule",
        dag_id: dag_id
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
        } else {
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

   createNotification = (type) => {
      switch (type) {
        case 'warning':
            NotificationManager.warning('Select delivery company','WARNING',  3000);
            break;
        case 'error':
            NotificationManager.error('Error message', 'Click me!', 5000, () => {
                alert('callback');
            });
            break;
        default:
            console.log("Not defined notification")
            break;
      }
    };

    onTodoChange(key,value){
      this.setState({
        [key]: value
      });
    }

    getRegisteredSchedules(userId){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
        req_type: "get_registered_schedules",
        user_id: userId
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          //job_id, start_date, end_date, period, job_label
          let registeredSchedules = response['data']['result'];
          registeredSchedules = registeredSchedules.map(function(row, index){
            const job_id = row[0];
            const start_date = row[1];
            const end_date = row[2];
            const period = row[3];
            const activate = row[4];
            const job_label = row[5];
            return {num: index+1, job_id: job_id, start_date: start_date, end_date:end_date, period: period, activate: activate, job_label:job_label};
          });
          obj.setState({
            registeredSchedules: registeredSchedules,
            selectedScheduleIndex: null,
            selectedScheduleJobId: null,
            selectedScheduleJobLabel: null
          });
        } else {
          console.log('getRegisteredSchedules Failed');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }


    deleteSchedule() {
      let job_id = this.state.selectedScheduleJobId;
      let dag_id = this.state.selectedScheduleJobLabel.replace(/ /gi, '_')
      if (job_id != null){
        const obj = this;
        axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
          req_type: "delete_schedule",
          job_id: job_id,
        })
        .then(function (response) {
          if (response['data']['success'] === true) {
            obj.deleteDag(dag_id)
            obj.getRegisteredSchedules(obj.props.userId);
          } else {
            console.log('Faile to delete a schedule');
          }
        })
        .catch(function (error){
          console.log(error);
        });
      }
    }


    deleteDag(dag_id){
      const obj = this;
      axios.post(setting_server.DRIVER_UTIL_SERVER+'/api/driver/', {
        req_type: "delete_dag",
        dag_id: dag_id
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
        } else {
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }




    componentWillMount(){

      this.getRegisteredSchedules(this.props.userId);
    }

    render() {
        const obj = this;
        return (
          <Page.Card>

          <Page.Card 
            title={"Registered Schedules"}
            // RootComponent={Form}
          >
            <ReactTable
              data = {this.state.registeredSchedules}
              getTdProps={(state, rowInfo, column, instance) => {
                if(rowInfo){
                  if(this.state.selectedScheduleIndex !== null){ // When you click a row not at first.
                    return {
                      onClick: (e) => {
                        this.setState({
                          selectedScheduleIndex: rowInfo.index,
                          selectedScheduleJobId: rowInfo.original['job_id'],
                          selectedScheduleJobLabel: rowInfo.original['job_label']
                        });
                      },
                      style: {
                        background: rowInfo.index === this.state.selectedScheduleIndex ? '#00ACFF' : null
                      }
                    }
                  }
                  else { // When you click a row at first.
                    return {
                      onClick: (e) => {
                        this.setState({
                          selectedScheduleIndex: rowInfo.index,
                          selectedScheduleJobId: rowInfo.original['job_id'],
                          selectedScheduleJobLabel: rowInfo.original['job_label']
                        });
                      }
                    }
                  }
                }
                else{
                  if(this.state.selectedScheduleIndex !== null){ // When you click a row not at first.
                    return {
                      onClick: (e) => {
                        this.setState({
                          selectedScheduleIndex: rowInfo.index,
                          selectedScheduleJobId: rowInfo.original['job_id'],
                          selectedScheduleJobLabel: rowInfo.original['job_label']
                        });
                      }
                    }
                  }
                  else { // When you click a row at first.
                    return {
                    }
                  }
                }
              }}

              columns={[
                {
                  Header: "Activate On/Off",
                  width: 120,
                  resizable: false,
                  accessor: 'activate',
                  Cell: ( row ) => {
                    return (
                      <div
                        style={{
                          textAlign:"center",
                          paddingTop:"6%"
                        }}
                      > 
                        <Switch
                          onChange={()=> this.handleChange(row)}
                          checked={row.value}
                          height={20}
                          className="react-switch"
                          onColor="#86d3ff"
                          onHandleColor="#2693e6"
                        />
                      </div>
                    )
                  }
                },
                {
                  Header: "Job",
                  resizable: false,
                  accessor: "job_label",
                  Cell: ( row ) => {
                    return (
                      <div
                        style={{
                          textAlign:"center",
                          paddingTop:"4px"
                        }}
                      > {row.value} </div>
                    )
                  }
                },
                {
                  Header: "Start Date",
                  resizable: false,
                  accessor: "start_date",
                  Cell: ( row ) => {
                    return (
                      <div
                        style={{
                          textAlign:"center",
                          paddingTop:"4px"
                        }}
                      > {row.value} </div>
                    )
                  }
                },
                {
                  Header: "End Date",
                  resizable: false,
                  accessor: "end_date",
                  Cell: ( row ) => {
                    return (
                      <div
                        style={{
                          textAlign:"center",
                          paddingTop:"4px"
                        }}
                      > {row.value} </div>
                    )
                  }
                },
                {
                  Header: "Period",
                  resizable: false,
                  accessor: "period",
                  Cell: ( row ) => {
                    return (
                      <div
                        style={{
                          textAlign:"center",
                          paddingTop:"4px"
                        }}
                      > {row.value} </div>
                    )
                  }
                }
              ]}
              minRows={8}
              showPagination ={false}
              bordered = {false} 
              style={{
                height: "400px"
              }}
              className="-striped -highlight"
            />
            <div class='row' style={{marginTop:'2%', marginRight:'0.1%', float:'right'}}>
              <Button color="secondary" style = {{ width:'77px'}}
                onClick={() => {
                 this.deleteSchedule()
                }}
              >
              Delete
              </Button>
            </div>
          </Page.Card>
        </Page.Card>
        );
    }
}
export default ScheduleTab;
