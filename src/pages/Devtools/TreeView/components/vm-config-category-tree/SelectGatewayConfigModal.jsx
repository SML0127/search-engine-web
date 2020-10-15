// @flow

import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import { Button, Form } from "tabler-react";
import ReactTable from "react-table";
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import setting_server from '../../../setting_server';


class SelectGatewayConfigModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          configurations: [],
          selectedConfigurationIndex: '-1',
          selectedConfigurationId: '-1',
          selectedConfigurationLabel: null,
          selectedConfiguration: '',
          rendered: false
        };
        this.addConfiguration = this.addConfiguration.bind(this)
        this.getConfigurations = this.getConfigurations.bind(this)
        this.updateConfiguration = this.updateConfiguration.bind(this)
        this.deleteConfiguration = this.deleteConfiguration.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    onTodoChange(key,value){
      this.setState({
        [key]: value
      });
    }

    onChange(newValue) {
      this.setState({selectedConfiguration : newValue})
    }

    updateConfiguration(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/gatewayconfiguration', {
        req_type: "update_configuration",
        id: obj.state.selectedConfigurationId,
        configuration_label: obj.state.selectedConfigurationLabel,
        configuration: obj.state.selectedConfiguration
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          obj.getConfigurations(obj.props.userId)
        } else {
          console.log(response)
          console.log('Failed to update tp');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }




    addConfiguration(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/gatewayconfiguration', {
        req_type: "add_configuration",
        user_id: obj.props.userId,
        configuration_label: obj.state.selectedConfigurationLabel,
        configuration: obj.state.selectedConfiguration
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          obj.getConfigurations(obj.props.userId)
        } else {
          console.log(response)
          console.log('Failed to add tp');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }



    deleteConfiguration(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/gatewayconfiguration', {
        req_type: "delete_configuration",
        id: obj.state.selectedConfigurationId
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          obj.getConfigurations(obj.props.userId)
        } else {
          console.log(response)
          console.log('Failed to delete tp');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }



    getConfigurations(userId){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/gatewayconfiguration', {
        req_type: "get_configuration",
        user_id: userId
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          let configurations = response['data']['result'];
          configurations = configurations.map(function(row, index){
            const id = row[0];
            const label = row[1];
            const program = row[2];
            return {num: index+1, id: id, label: label, program: program};
          });
          for(var idx in configurations){
             if(configurations[idx]['id'] == obj.props.selectedCid){
               obj.setState({selectedConfiguration: configurations[idx]['program']})
             }
          }
          obj.setState({configurations: configurations});
        } else {
          console.log('getConfigurations Failed');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }
    
    componentWillReceiveProps(nextProps) {
    }

    closeModal(){
        this.props.setModalShow(false)
    }

   
    componentDidMount(){
      this.getConfigurations(this.props.userId);
      if(this.props.selectedCid != null){
        this.setState({selectedConfigurationId :this.props.selectedCid})
      }
      this.setState({rendered: true})
    }

    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={ () => {
                    this.props.setModalShow(false);
                }}
            >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                  Gateway Configuration
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ReactTable
                  data = {this.state.configurations}
                  getTdProps={(state, rowInfo, column, instance) => {
                    if (rowInfo) {
                      if(this.state.selectedConfigurationIndex !== null){
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedConfigurationIndex: rowInfo.index,
                              selectedConfigurationId: rowInfo.original['id'],
                              selectedConfigurationLabel: rowInfo.original['label'],
                              selectedConfiguration: rowInfo.original['program'],
                            }, () => {console.log('Click'); console.log(this.state.selectedConfigurationId)});
                          },
                          style: {
                            background: rowInfo.original['id'] == this.state.selectedConfigurationId ? '#00ACFF' : null
                          }
                        }
                      }
                      else { 
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedConfigurationIndex: rowInfo.index,
                              selectedConfigurationId: rowInfo.original['id'],
                              selectedConfigurationLabel: rowInfo.original['label'],
                              selectedConfiguration: rowInfo.original['program'],
                            }, () => {console.log('Click'); console.log(this.state.selectedConfigurationId)});
                          },
                          style: {
                            background: rowInfo.original['id'] == this.state.selectedConfigurationId ? '#00ACFF' : null
                          }
                        }
                      }
                    }
                    return {}
                  }}
                  columns={[
                    {
                      Header: "No.",
                      width: 50,
                      resizable: false,
                      accessor: "num",
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
                      Header: "Configuration",
                      resizable: false,
                      accessor: "label",
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
                  ]}
                  minRows={5}
                  defaultPageSize={1000}
                  showPagination ={false}
                  bordered = {false} 
                  style={{
                    height: "250px"
                  }}
                  className="-striped -highlight"
                />
            <div class='row' style={{marginTop:'2%'}}>
              <AceEditor
                mode="python"
                theme="github"
                width='300px'
                height='300px'
                style={{width:"100%", marginLeft:'1%', marginRight:'1%', marginLeft:'2%'}}
                name="UNIQUE_ID_OF_DIV"
                value = {this.state.selectedConfiguration}
                onChange={this.onChange}
                editorProps={{ $blockScrolling: true }}
              />
            </div>

            <div class='row' style={{marginLeft:'50%',width:'50%', marginTop:'20px',float:'right'}}>
              <label style={{marginTop:'8px', width:'50%'}}> Configuration :</label>
              <input class="form-control" style={{width:"50%"}} value={this.state.selectedConfigurationLabel} onChange={e => this.onTodoChange('selectedConfigurationLabel',e.target.value)} />
            </div>


            <div class='row' style={{marginTop:'20px', float:'right'}}>
              <Button color="primary" style = {{marginLeft: '10px', width:'77px'}} 
                onClick={() => {
                  this.addConfiguration()
                }}
              >
              Add
              </Button>
              <Button color="secondary" style = {{marginLeft:'10px', width:'77px'}}
                onClick={() => {
                  this.updateConfiguration()
                }}
              >
              Update
              </Button>
              <Button color="secondary" style = {{marginLeft:'10px', width:'77px'}}
                onClick={() => {
                  this.deleteConfiguration()
                }}
              >
              Delete
              </Button>
            </div>

            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" 
                  onClick={(obj) => {
                      this.props.saveGatewayConfiguration(this.state.selectedConfigurationLabel, this.state.selectedConfigurationId)
                      this.closeModal();
                  }}
                >
                  Select
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
export default SelectGatewayConfigModal;
