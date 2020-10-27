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
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import setting_server from '../setting_server';

class WorkerTab extends React.Component {

    constructor(props) {
        super(props);
        let curUrl = window.location.href;
        this.state = {
          usage: '',
          registeredWorkers: [],
          selectedWorkerIndex: null,
          selectedWorkerName: null,
          selectedWorkerState: null,
          worker_name: '',
          worker_ip: '',
          worker_port: '',
          checked: false
        };
        this.addWorker = this.addWorker.bind(this);
        this.deleteWorker = this.deleteWorker.bind(this);
        this.getWorker = this.getWorker.bind(this);
    }

    onTodoChange(key,value){
      this.setState({
        [key]: value
      });
    }


    addWorker(){
      const obj = this;
      let ip = this.state.worker_ip;
      let port = this.state.worker_port;
      axios.post(setting_server.DRIVER_UTIL_SERVER+'/api/driver/', {
        req_type: "add_worker",
        worker_ip: ip,
        worker_port: port,
      })
      .then(function (response) {
        if (response['data']['success'] === true) {
          obj.getWorker()
        } else {
          console.log('Fail to add worker');
        }
      })
      .catch(function (error){
        console.log(error);
      });
      
    }


    getWorker(need_sleep = true){
      const obj = this;
      axios.post(setting_server.DRIVER_UTIL_SERVER+'/api/driver/', {
        req_type: "get_workers",
        sleep: need_sleep
      })
      .then(function (response) {
        if (response['data']['success'] === true) {
          let registeredWorkers = response['data']['workers']
          registeredWorkers = registeredWorkers.map(function(row, index){
            const name = row[0];
            const address = row[1];
            const state = row[2];
            return {num: index+1, name:name, address:address, state: state};
          });
          obj.setState({registeredWorkers: registeredWorkers, selectedWorkerIndex: null}); 
        } else {
          console.log('Fail to get worker');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }


    deleteWorker(){
      const obj = this;
      let worker_name = this.state.selectedWorkerName;
      axios.post(setting_server.DRIVER_UTIL_SERVER+'/api/driver/', {
        req_type: "delete_worker",
        worker_name: worker_name
      })
      .then(function (response) {
        if (response['data']['success'] === true) {
          obj.getWorker()
        } else {
          console.log('Fail to delete worker');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }


   createNotification = (type) => {
      switch (type) {
        case 'warning':
            NotificationManager.warning('Remove whitespace in worker name','WARNING',  3000);
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



    componentWillMount(){
       this.getWorker(false)
    }

    render() {
        const obj = this;
        return (
          <Page.Card>

          <Page.Card 
            title={"Registered Worker"}
            // RootComponent={Form}
          >
            <ReactTable
              data = {this.state.registeredWorkers}
              getTdProps={(state, rowInfo, column, instance) => {
                if(rowInfo){
                  if(this.state.selectedWorkerIndex !== null){ // When you click a row not at first.
                    return {
                      onClick: (e) => {
                        this.setState({
                          selectedWorkerIndex: rowInfo.index,
                          selectedWorkerName: rowInfo.original['name'],
                          selectedWorkerState: rowInfo.original['state']
                        });
                      },
                      style: {
                        background: rowInfo.index === this.state.selectedWorkerIndex ? '#00ACFF' : null
                      }
                    }
                  }
                  else { // When you click a row at first.
                    return {
                      onClick: (e) => {
                        this.setState({
                          selectedWorkerIndex: rowInfo.index,
                          selectedWorkerName: rowInfo.original['name'],
                          selectedWorkerState: rowInfo.original['state']
                        });
                      }
                    }
                  }
                }
                else{
                  if(this.state.selectedWorkerIndex !== null){ // When you click a row not at first.
                    return {
                      onClick: (e) => {
                        this.setState({
                          selectedWorkerIndex: rowInfo.index,
                          selectedWorkerName: rowInfo.original['name'],
                          selectedWorkerState: rowInfo.original['state']
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
                  Header: "Worker ID",
                  width: 180,
                  resizable: false,
                  accessor: 'name',
                  Cell: ( row ) => {
                    return (
                      <div
                        style={{
                          textAlign:"center",
                          paddingTop:"4px"
                        }}
                      >{row.value}
                      </div>
                    )
                  }
                },
                {
                  Header: "Address",
                  resizable: false,
                  accessor: "address",
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
                  Header: "Status",
                  resizable: false,
                  width: 120,
                  accessor: "state",
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


            <div class='row' style={{width:'100%', marginTop:'20px', marginLeft:'0.04%'}}>
              <label style={{marginTop:'8px', marginLeft:'40%', width:'5%'}}> IP :</label>
              <input class="form-control" type='text' style={{width:"36%"}} value={this.state.worker_ip} onChange={e => this.onTodoChange('worker_ip',e.target.value)} />
              <label style={{marginTop:'8px', marginLeft: '3%', width:'5%', float:'right'}}> Port :</label>
              <input class="form-control" style={{width:"11%", float:'right'}} value={this.state.worker_port} onChange={e => this.onTodoChange('worker_port',e.target.value)} />
            </div>


            <div class='row' style={{marginTop:'2%', marginRight:'0.1%', float:'right'}}>
              <Button color="secondary" style = {{ width:'77px'}}
                onClick={() => {
                 this.deleteWorker()
                }}
              >
              Delete
              </Button>
            </div>
            <div class='row' style={{marginTop:'2%', marginRight:'2%', float:'right'}}>
              <Button color="secondary" style = {{ width:'77px'}}
                onClick={() => {
                 this.addWorker()
                }}
              >
              Add
              </Button>
            </div>
            <div class='row' style={{marginTop:'2%', marginRight:'2%', float:'right'}}>
              <Button color="secondary" style = {{ width:'77px'}}
                onClick={() => {
                 this.getWorker()
                }}
              >
              Update
              </Button>
            </div>
          </Page.Card>
        </Page.Card>
        );
    }
}
export default WorkerTab;
