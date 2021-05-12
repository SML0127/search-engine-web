// @flow

import ReactTable from "react-table"
import * as React from "react";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import setting_server from '../setting_server';

var g_var_execId = -1
class ErrorModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
        this.updateTaskId = this.updateTaskId.bind(this)
    }

    updateTaskId(event) {
      this.setState({task_id_idx: event.target.value});
      this.setState({err_msg: this.state.err_msgs[event.target.value]});
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
          task_id_idx:'-1'
      }
    }
    closeModal(){
        this.props.setModalShow(false)
    }

    refreshList() {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/task', {
        req_type: "failed_task",
        exec_id: g_var_execId
      })
      .then(function (resultData) {
        if(resultData['data']['success'] == true) {
          let res = resultData['data']['result'];
          // 2d array
          let task_ids = []
          let err_msgs = []
          for(var idx in res){
            task_ids.push(res[idx][0])
            err_msgs.push(res[idx][1])
          } 
          obj.setState({
              task_ids: task_ids,
              err_msgs: err_msgs,
              err_msg: '',
              task_id_idx: '-1'
          });
          let task_id_idx = 0
          let task_id_options = task_ids
              .map((code) => <option value={task_id_idx++}>{code}</option>);
          obj.setState({
            task_id_options: task_id_options,
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
                    Error message
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <select
              class="form-control"
              style={{width:"30%", float: 'right'}}
              value={this.state.task_id_idx}
              onChange={this.updateTaskId}
            >
              <option value="-1" disabled selected>Select Task id</option>
              {this.state.task_id_options}
            </select>
            <Form.Textarea
                row={100}
                spellCheck="false" 
                style={{width:'100%', height:'500px', minHeight:'500px', maxHeight:'500px', textAlign:'left', whiteSpace: 'pre-line'}}
                value={this.state.err_msg}
                wrap="off"
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
export default ErrorModal;
