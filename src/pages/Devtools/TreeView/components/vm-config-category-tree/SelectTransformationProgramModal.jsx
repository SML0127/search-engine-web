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


class SelectTransformationProgramModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          transformationPrograms: [],
          selectedTransformationProgramIndex: '-1',
          selectedTransformationProgramId: '-1',
          selectedTransformationProgramLabel: null,
          selectedTransformationProgram: '',
          rendered: false
        };
        this.addTransformationProgram = this.addTransformationProgram.bind(this)
        this.getTransformationPrograms = this.getTransformationPrograms.bind(this)
        this.updateTransformationProgram = this.updateTransformationProgram.bind(this)
        this.deleteTransformationProgram = this.deleteTransformationProgram.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    onTodoChange(key,value){
      this.setState({
        [key]: value
      });
    }

    onChange(newValue) {
      this.setState({selectedTransformationProgram : newValue})
    }

    updateTransformationProgram(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/transformationprogram', {
        req_type: "update_transformation_program",
        id: obj.state.selectedTransformationProgramId,
        program_label: obj.state.selectedTransformationProgramLabel,
        transformation_program: obj.state.selectedTransformationProgram
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          obj.getTransformationPrograms(obj.props.userId)
        } else {
          console.log(response)
          console.log('Failed to update tp');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }




    addTransformationProgram(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/transformationprogram', {
        req_type: "add_transformation_program",
        user_id: obj.props.userId,
        program_label: obj.state.selectedTransformationProgramLabel,
        transformation_program: obj.state.selectedTransformationProgram
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          obj.getTransformationPrograms(obj.props.userId)
        } else {
          console.log(response)
          console.log('Failed to add tp');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }



    deleteTransformationProgram(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/transformationprogram', {
        req_type: "delete_transformation_program",
        id: obj.state.selectedTransformationProgramId
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          obj.getTransformationPrograms(obj.props.userId)
        } else {
          console.log(response)
          console.log('Failed to delete tp');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }



    getTransformationPrograms(userId){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/transformationprogram', {
        req_type: "get_transformation_program",
        user_id: userId
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          let transformationPrograms = response['data']['result'];
          transformationPrograms = transformationPrograms.map(function(row, index){
            const id = row[0];
            const label = row[1];
            const program = row[2];
            return {num: index+1, id: id, label: label, program: program};
          });
          for(var idx in transformationPrograms){
             if(transformationPrograms[idx]['id'] == obj.props.selectedPid){
               obj.setState({selectedTransformationProgram: transformationPrograms[idx]['program']})
             }
          }
          obj.setState({transformationPrograms: transformationPrograms});
        } else {
          console.log('getTransformationPrograms Failed');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }
    
    componentWillReceiveProps(nextProps) {
      if(this.props.selectedPid != null){
        for(var idx in this.state.transformationPrograms){
           if(this.state.transformationPrograms[idx]['id'] == this.props.selectedPid){
             this.setState({selectedTransformationProgram: this.state.transformationPrograms[idx]['program']})
           }
        }
        this.setState({selectedTransformationProgramId :this.props.selectedPid})
      }
    }

    closeModal(){
        this.props.setModalShow(false)
    }

   
    componentDidMount(){
      if(this.props.selectedPid != null){
        this.setState({selectedTransformationProgramId :this.props.selectedPid})
      }
      this.getTransformationPrograms(this.props.userId);
      this.setState({rendered: true})
    }

    render() {
        return (
            <Modal
                {...this.props}
                size="xl"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={ () => {
                    this.props.setModalShow(false);
                }}
            >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                  Transformation program
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ReactTable
                  data = {this.state.transformationPrograms}
                  getTdProps={(state, rowInfo, column, instance) => {
                    if (rowInfo) {
                      if(this.state.selectedTransformationProgramIndex !== null){
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedTransformationProgramIndex: rowInfo.index,
                              selectedTransformationProgramId: rowInfo.original['id'],
                              selectedTransformationProgramLabel: rowInfo.original['label'],
                              selectedTransformationProgram: rowInfo.original['program'],
                            }, () => {console.log('Click'); console.log(this.state.selectedTransformationProgramId)});
                          },
                          style: {
                            background: rowInfo.original['id'] == this.state.selectedTransformationProgramId ? '#00ACFF' : null
                          }
                        }
                      }
                      else { 
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedTransformationProgramIndex: rowInfo.index,
                              selectedTransformationProgramId: rowInfo.original['id'],
                              selectedTransformationProgramLabel: rowInfo.original['label'],
                              selectedTransformationProgram: rowInfo.original['program'],
                            }, () => {console.log('Click'); console.log(this.state.selectedTransformationProgramId)});
                          },
                          style: {
                            background: rowInfo.original['id'] == this.state.selectedTransformationProgramId ? '#00ACFF' : null
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
                      Header: "Transformation Program",
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
                  minRows={3}
                  defaultPageSize={100}
                  showPagination ={false}
                  bordered = {false} 
                  style={{
                    height: "170px"
                  }}
                  className="-striped -highlight"
                />
            <div class='row' style={{marginTop:'2%'}}>
              <AceEditor
                mode="python"
                theme="github"
                width='300px'
                height='700px'
                style={{width:"100%", marginLeft:'1%', marginRight:'1%', marginLeft:'2%'}}
                name="UNIQUE_ID_OF_DIV"
                value = {this.state.selectedTransformationProgram}
                onChange={this.onChange}
                editorProps={{ $blockScrolling: true }}
              />
            </div>

            <div class='row' style={{marginLeft:'50%',width:'50%', marginTop:'20px',float:'right'}}>
              <label style={{marginTop:'8px', width:'50%'}}> Transformation Program :</label>
              <input class="form-control" style={{width:"50%"}} value={this.state.selectedTransformationProgramLabel} onChange={e => this.onTodoChange('selectedTransformationProgramLabel',e.target.value)} />
            </div>


            <div class='row' style={{marginTop:'20px', float:'right'}}>
              <Button color="primary" style = {{marginLeft: '10px', width:'77px'}} 
                onClick={() => {
                  this.addTransformationProgram()
                }}
              >
              Add
              </Button>
              <Button color="secondary" style = {{marginLeft:'10px', width:'77px'}}
                onClick={() => {
                  this.updateTransformationProgram()
                }}
              >
              Update
              </Button>
              <Button color="secondary" style = {{marginLeft:'10px', width:'77px'}}
                onClick={() => {
                  this.deleteTransformationProgram()
                }}
              >
              Delete
              </Button>
            </div>

            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" 
                  onClick={(obj) => {
                      this.props.saveTP(this.state.selectedTransformationProgramLabel, this.state.selectedTransformationProgramId)
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
export default SelectTransformationProgramModal;
