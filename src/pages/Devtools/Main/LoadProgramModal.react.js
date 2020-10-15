// @flow

import ReactTable from "react-table"
import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import setting_server from '../setting_server';


class LoadProgramModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
    }

    
    componentDidMount(){
    }
    
    componentWillReceiveProps(nextProps) {
      //console.log(nextProps.selectedProjectId);
      this.loadUserProgram(nextProps);
    }

    initState() {
      let curUrl = window.location.href;
        return {
            programs_info: []
        }
    }

    loadUserProgram(nextProps) {
        var obj = this;
        //console.log(obj.props.jobId)
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
                        return {
                            onDoubleClick: (e) => {
                                if(typeof rowInfo != 'undefined'){
                                    if(typeof rowInfo['row'][1] != 'undefined'){
                                        this.props.drawWorkflow(this.state.programs_info[rowInfo['index']][3], this.state.programs_info[rowInfo['index']][0])
                                        this.closeModal()
                                    }
                                }
                            }
                        }
                    }}
                    columns={[
                        /*{
                            Header: "Id",
                            resizable: false,
                            accessor: "0",
                            Cell: ( row ) => {
                                return (
                                    <div
                                        style={{
                                            textAlign:"center",
                                        }}
                                    > {row.value} </div>
                                )
                            }
                        },*/
                        {
                            Header: "Site",
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
                            Header: "Category",
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
            </Modal>
        );
    }
}
export default LoadProgramModal;
