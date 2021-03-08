// @flow

import ReactTable from "react-table"
import * as React from "react";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import setting_server from '../setting_server';

var g_var_smhistoryId = -1
class ErrorMysiteModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
        this.updateMpid = this.updateMpid.bind(this)
    }

    updateMpid(event) {
      this.setState({mpid_idx: event.target.value});
      this.setState({err_msg: this.state.err_msgs[event.target.value]});
    }


    
    componentDidMount(){
    }
    
    componentWillReceiveProps(nextProps) {
      if(this.state.smhistoryId != nextProps.smhistoryId){
        g_var_smhistoryId = nextProps.smhistoryId;
        this.refreshList()
      }
    }

    initState() {
      let curUrl = window.location.href;
      return {
          mpids: [],
          err_msgs: [],
          err_msg: '',
          mpid_idx:'-1'
      }
    }
    closeModal(){
        this.props.setModalShow(false)
    }

    refreshList() {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/mysite', {
        req_type: "get_err_msg",
        sm_history_id: g_var_smhistoryId
      })
      .then(function (resultData) {
        if(resultData['data']['success'] == true) {
          let res = resultData['data']['result'];
          // 2d array
          let mpids = []
          let err_msgs = []
          for(var idx in res){
            mpids.push(res[idx][1])
            err_msgs.push(res[idx][2])
          } 
          obj.setState({
              mpids: mpids,
              err_msgs: err_msgs,
              err_msg: '',
              mpid_idx: '-1'
          });
          let mpid_idx = 0
          let mpid_options = mpids
              .map((code) => <option value={mpid_idx++}>{code}</option>);
          obj.setState({
            mpid_options: mpid_options,
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
              value={this.state.mpid_idx}
              onChange={this.updateMpid}
            >
              <option value="-1" disabled selected>Select my site product id</option>
              {this.state.mpid_options}
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
export default ErrorMysiteModal;
