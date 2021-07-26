// @flow

import ReactTable from "react-table"
import * as React from "react";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import setting_server from '../setting_server';

var g_var_execId = -1
var g_var_nodeId = 0
class DataModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
        this.updateNodeId = this.updateNodeId.bind(this)
    }

    updateNodeId(event) {
      console.log(event.target.value)
      this.setState({node_id_idx: event.target.value});
      g_var_nodeId = event.target.value
    }


    
    componentDidMount(){
    }
    
    componentWillReceiveProps(nextProps) {
      if(this.state.execId != nextProps.execId){
        if (nextProps.show != false){
          g_var_execId = nextProps.execId;
          this.refreshList()
        }
      }
    }

    initState() {
      let curUrl = window.location.href;
      return {
          task_ids: [],
          err_msgs: [],
          err_msg: '',
          node_id_idx:'-1',
          items: []
      }
    }
    closeModal(){
        this.props.setModalShow(false)
    }

    refreshList() {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/executions', {
        req_type: "get_data",
        execution_id: g_var_execId
      })
      .then(function (resultData) {
        if(resultData['data']['success'] == true) {
          let res = resultData['data']['result'];
          console.log(res)
          let node_id_options = Object.keys(res)
              .map((nid) => <option value={nid}>{res[nid][0][1]}</option>);
          console.log(Object.keys(res)[0])
          g_var_nodeId = Object.keys(res)[0]
          obj.setState({
            node_id_options: node_id_options,
            items: res,
            node_id_idx: Object.keys(res)[0]
          });
          
        } else {
          //console.log(resultData);
        }
      })
      .catch(function (error) {
          console.log(error);
      });
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
                    Crawled Data
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div class='row' style={{width:'100%', marginLeft:'0.5%'}}>
              <label style = {{width:"4%", marginTop:'0.6%'}}>
                URL : 
              </label>
              <select
                class="form-control"
                style={{width:"95.5%", float: 'right', marginBottom:'1%'}}
                value={this.state.node_id_idx}
                onChange={this.updateNodeId}
              >
                <option value="-1" disabled selected>Select URL</option>
                {this.state.node_id_options}
              </select>
            </div>
            <ReactTable
                data = {this.state.items[g_var_nodeId]}
                columns={[
                    {
                        Header: "Key",
                        width: 150,
                        resizable: false,
                        accessor: "0",
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
                        Header: "Value",
                        resizable: false,
                        accessor: "1",
                        Cell: ( row ) => {
                            if (row.value == null){
                                return (
                                    <div
                                        style={{
                                            textAlign:"center",
                                            paddingTop:"4px",
                                            paddingLeft:"15px"
                                        }}
                                    > - </div>
                                )
                            }
                            else{
                                return (
                                    <div
                                        style={{
                                            textAlign:"center",
                                            paddingTop:"4px",
                                            paddingLeft:"12px"
                                        }}
                                    > {row.value} </div>
                                )
                            }
                        }
                    }
                ]}
                minRows={5}
                defaultPageSize={30}
                showPagination ={false}
                bordered = {false} 
                style={{
                    height: "250px"
                }}
                className="-striped -highlight"
            />           

            </Modal.Body>
            <Modal.Footer>
              <Button color="primary" 
                onClick={(obj) => {

                    this.closeModal();
                }}
              >
                Ok
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
export default DataModal;
