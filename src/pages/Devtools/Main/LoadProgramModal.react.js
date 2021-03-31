// @flow

import ReactTable from "react-table"
import * as React from "react";
import { Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import setting_server from '../setting_server';


class LoadProgramModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
    }

    
    componentDidMount(){
      this.loadUserProgram();
      if(this.props.upid != null){
        this.setState({selectedProgramId :this.props.upid})
      }
    }
    
    componentWillReceiveProps(nextProps) {
      //this.loadUserProgram(nextProps);
      if(this.props.upid != null){
        this.setState({selectedProgramId :this.props.upid})
      }
    }


    closeModal(){
        this.props.setModalShow(false)
    }

    initState() {
      let curUrl = window.location.href;
        return {
            programs_info: [],
            selectedProgramIndex: '-1',
            selectedProgramId: '-1',
            selectedProgramLabel: null,
            selectedProgram: '',
        }
    }

    loadUserProgram() {
        var obj = this;
        console.log(obj)
        axios.post(setting_server.DB_SERVER+'/api/db/userprogram', {
            req_type: "get_user_program",
            job_id: obj.props.jobId
        })
        .then(function (resultData){
            obj.setState({
                programs_info: resultData["data"]['output']
            })
        })
        .catch(function (error){
            console.log(error)
        });
    }

    closeModal(){
        this.props.setModalShow(false)
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
                    Select program
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ReactTable
                    data = {this.state.programs_info}
                    getTdProps={(state, rowInfo, column, instance) => {
                      if(rowInfo){
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProgramIndex: rowInfo.index,
                              selectedProgramId: this.state.programs_info[rowInfo.index][0],
                              selectedProgramLabel: this.state.programs_info[rowInfo.index][1],
                              selectedProgram: this.state.programs_info[rowInfo.index][3],
                            }, () => {console.log('Click'); console.log(this.state.selectedProgramId)});
                          },
                          style: {
                            background: rowInfo.original[0] == this.state.selectedProgramId ? '#00ACFF' : null
                          }
                        }
                      }
                      else{
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProgramIndex: rowInfo.index,
                              selectedProgramId: this.state.programs_info[rowInfo.index][0],
                              selectedProgramLabel: this.state.programs_info[rowInfo.index][1],
                              selectedProgram: this.state.programs_info[rowInfo.index][3],
                            }, () => {console.log('Click'); console.log(this.state.selectedProgramId)});
                          }
                        }
                      }
                    }}
                    columns={[
                        {
                            Header: "Name",
                            resizable: false,
                            accessor: "1",
                            Cell: ( row ) => {
                                return (
                                    <div
                                        style={{
                                            textAlign:"center",
                                        }}
                                    > {row.value} </div>
                                )
                            }
                        },
                        {
                            Header: "Description",
                            resizable: false,
                            accessor: "2",
                            Cell: ( row ) => {
                                return (
                                    <div
                                        style={{
                                            textAlign:"center",
                                        }}
                                    > {row.value} </div>
                                )
                            }
                        },
                    ]}
                    minRows={6}
                    defaultPageSize={20}
                    showPagination ={true}
                    bordered = {true} 
                    style={{
                        height: "300px"
                    }}
                    className="-striped -highlight"
                />
            </Modal.Body>
            <Modal.Footer>
              <Button color="primary" 
                onClick={(obj) => {

                    this.props.drawWorkflow(this.state.programs_info[this.state.selectedProgramIndex][3], this.state.programs_info[this.state.selectedProgramIndex][0], this.state.programs_info[this.state.selectedProgramIndex][1])
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
            </Modal>
        );
    }
}
export default LoadProgramModal;
