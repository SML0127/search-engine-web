// @flow

import ReactTable from "react-table"
import 'react-table/react-table.css'
import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import ConfigCategoryTree from '../TreeView/components/config-category-tree';
import TargetConfigCategoryTree from '../TreeView/components/vm-config-category-tree';
import productIcon from './product.png';
import {
  Form,
  Page,
  Card,
  Button
} from "tabler-react";
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Image from 'react-bootstrap/Image'
import setting_server from '../setting_server';
import { Tabs } from 'react-simple-tabs-component'

class CrawledSummaryPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
    }

    onTodoChange(key,value){
      this.setState({
        [key]: value
      });
    }
    
    componentDidMount(){
      if(this.props.isError == false){
         this.state = this.initState()
         this.setState({err_msg: ''})
      }
      else if(this.props.isError == true){
         this.state = this.initState()
         this.getSummaryErrorDetail(this.props.selectedNodeId)
      }
    }
    
    initState() {
      return {
        selectedProductIndex: null,
        selectedProductIndex1: null,
        err_msg: '',
      }
    }

    getSummaryErrorDetail(selectedNodeId){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/task', {
        req_type: "get_failed_task_detail",
        node_id: selectedNodeId
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          obj.setState({err_msg: response['data']['result']})
        } else {
          obj.setState({err_msg: '에러 메세지를 가져오는데 실패하였습니다'})
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }
 
    closeModal(){
        this.props.setModalShow(false)
    }

    render() {
        const err_msg = this.state.err_msg;

        if(err_msg != ''){
          return (
            <div>
              <div class='row' style ={{marginTop:'1.5%', width:'100%'}}>
              </div>
              <Form.Textarea
                  row={100}
                  spellCheck="false" 
                  style={{width:'100%', height:'500px', minHeight:'500px', maxHeight:'500px', textAlign:'left', whiteSpace: 'pre-line'}}
                  value={err_msg}
                  wrap="off"
              />
            </div>
          );
        }
        else{
          return (
             <div>
             </div>
          );
        }
        
    }
}
export default CrawledSummaryPage;
