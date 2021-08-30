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
import refreshIcon from './refresh.png';
import ProgressBar from 'react-bootstrap/ProgressBar'

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
      this.get_latest_progress_summary()
      this.getSummary()
      this.refreshList()
      
    }
    
    initState() {
      return {
        selectedProductIndex: null,
        selectedProductIndex1: null,
        err_msg: '',
        expected_summary_num: 0,
        current_summary_num: 0,
        progress_summary: 0
      }
    }


    get_latest_progress_summary(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/executions', {
        req_type: "get_latest_progress_summary",
        job_id: obj.props.JobId,
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          console.log(response)
          obj.setState({
            showCDPage: true,
            current_summary_num: response['data']['result'][0],
            expected_summary_num: response['data']['result'][1], 
            progress_summary: isNaN(parseFloat(response['data']['result'][1]) / parseFloat(response['data']['result'][0]) * 100 ) ? 0 : (parseFloat(response['data']['result'][0]) / parseFloat(response['data']['result'][1]) * 100 ).toFixed(2)
          })
        } 
      })
      .catch(function (error){
        console.log(error);
      });
    }


    refreshSummary(){
      this.getSummary();
      this.get_latest_progress_summary()
    }
  

    getSummary(){
       const obj = this;
       axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
         req_type: "get_crawled_summary",
         job_id: obj.props.JobId,
       })
       .then(function (response) {
         if( Object.keys(response['data']['result']).length  == 0){
            obj.setState({summaryLists: []});
            return;
         }
         if (response['data']['success'] == true) {
           let summaryLists = response['data']['result'];
           summaryLists = summaryLists.map(function(row, index){
             //t3.value::text, t1.id, t2.status
             const status_web = (parseInt(row[0]) == -997? "X" : "O");
             var statu = 'O'
             if (parseInt(row[0]) == 0){
               statu = '진행중'
             }
             else if (parseInt(row[0]) == -998 || status_web == 'X'){
               statu = 'X'
             }
             
             const status_data = statu 
             const url = row[1].slice(1,-1)
             const node_id = row[2]
             return {num: index+1, url:url, status_web:status_web, status_data: status_data, node_id: node_id};
           });
           obj.setState({summaryLists: summaryLists});
         } else {
           console.log(response)
           console.log('Failed to get pl');
         }
       })
       .catch(function (error){
         console.log(error);
       });
     }


    getSummaryErrorDetail(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/task', {
        req_type: "get_failed_task_detail",
        node_id: this.state.selectedNodeId
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


    refreshList() {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/executions', {
        req_type: "get_executions",
        job_id: obj.props.JobId
      })
      .then(function (resultData) {
        if(resultData['data']['success'] == true) {
          let executions = resultData['data']['executions'];
          obj.setState({
              items: executions,
          });
        } else {
        }
      })
      .catch(function (error) {
          console.log(error);
      });
      //obj.createNotification('History');
    }



    render() {
        const err_msg = this.state.err_msg;
        const {items} = this.state;

        if(err_msg != ''){
          return (
            <div>
              <label style={{width:'100%', fontWeight:'Bold', fontSize:'20px', textAlign:'center'}}>
                진행 상황 ({this.state.current_summary_num} / {this.state.expected_summary_num})
               <img
                  src={refreshIcon}
                  width="20"
                  height="20"
                  onClick={() =>
                    this.refreshSummary()
                  }
                  style = {{cursor:'pointer', marginBottom:'0.2%', marginLeft:'0.2%'}}
                />
              </label>
              <ProgressBar animated style={{width:'98%', height:'30px', marginLeft:"1%"}} now={this.state.progress_summary} label={`${this.state.progress_summary}%`} />
                  
              <div class='row' style ={{marginTop:'1.5%', width:'100%'}}/>
              <ReactTable
                data = {this.state.summaryLists}
                getTdProps={(state, rowInfo, column, instance) => {
                  if(rowInfo){
                    if(this.state.selectedProductIndex1 !== null){ // When you click a row not at first.
                      if(rowInfo.index == this.state.selectedProductIndex1){
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex1: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                            });
                          },
                          style: {
                            background: '#00ACFF'
                          }
                        }
                      }
                      else if(rowInfo.original['status_web'] == 'X' || rowInfo.original['status_data'] == 'X'){
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex1: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                            }, () => {this.getSummaryErrorDetail()});
                          },
                          style: {
                            background: '#FF919C'
                          }
                        }
                      }
                      else{
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex1: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                            });
                          }
                        }
                      }
                    }
                    else { // When you click a row at first.
                      if(rowInfo.original['statu_web'] == 'X' || rowInfo.original['status_data'] == 'X'){
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex1: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                            }, () => {this.getSummaryErrorDetail()});
                          },
                          style: {
                            background: '#FF919C'
                          }
                        }
                      }
                      else{
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex1: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                            });
                          }
                        }
                      }
                    }
                  }
                  else{
                    if(this.state.selectedProductIndex1 !== null){ // When you click a row not at first.
                      return {
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
                    Header: "No.",
                    width: 70,
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
                    Header: "웹페이지 URL",
                    resizable: false,
                    accessor: 'url',
                    Cell: ( row ) => {
                      return (
                        <div
                          style={{
                            textAlign:"center",
                            paddingTop:"4px",
                          }}
                        > {row.value} </div>
                      )
                    }
                  },
                  {
                    Header: "웹페이지 로딩",
                    resizable: false,
                    accessor: 'status_web',
                    width:100,
                    Cell: ( row ) => {
                      return (
                        <div
                          style={{
                            textAlign:"center",
                            paddingTop:"4px",
                          }}
                        > {row.value} </div>
                      )
                    }
                  },
                  {
                    Header: "페이지 XPath 검사",
                    resizable: false,
                    accessor: 'status_data',
                    width:130,
                    Cell: ( row ) => {
                      return (
                        <div
                          style={{
                            textAlign:"center",
                            paddingTop:"4px",
                          }}
                        > {row.value} </div>
                      )
                    }
                  }
                ]}
                minRows={5}
                showPagination ={false}
                defaultPageSize={100000}
                bordered = {false} 
                style={{
                  height: "350px"
                }}
                className="-striped -highlight"
              />

              <div class='row' style ={{marginTop:'1.5%', width:'100%'}}>
              </div>
              <Form.Textarea
                  row={100}
                  spellCheck="false" 
                  style={{width:'100%', height:'500px', minHeight:'500px', maxHeight:'500px', textAlign:'left', whiteSpace: 'pre-line'}}
                  value={err_msg}
                  wrap="off"
              />
              <label style={{paddingTop:'1%', paddingLeft:'1%', fontWeight:'bold'}}> Crawling 이력
                </label> 
                <img
                  src={refreshIcon}
                  width="20"
                  height="20"
                  onClick={() =>
                    this.refreshList()
                  }
                  style = {{cursor:'pointer', marginLeft:'1%', marginBottom:'0.2%' }}
                />
                <ReactTable
                    data = {items}
                    columns={[
                        {
                            Header: "Execution ID",
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
                            Header: "Start Time",
                            resizable: false,
                            accessor: "3",
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
                        },
                        {
                            Header: "Finish Time",
                            resizable: false,
                            accessor: "4",
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
                        },
                        {
                            Header: "# crawled / # fail / # invalid / # ALL",
                            resizable: false,
                            accessor: "6",
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
                                        > {row.value} / {row.original[7]} / {row.original[8]} / {row.original[9]} </div>
                                    )
                                }
                            }
                        },
                        {
                            Header: "Data",
                            resizable: false,
                            accessor: "0",
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
                                        > 
                                         <Button 
                                           color="secondary"
                                           style = {{float:'center',  textTransform: 'capitalize'}}
                                           onClick={() => {
                                                 this.state.execId = row.value
                                                 this.setState({execId: row.value, crawledModalShow: true})
                                               }
                                           }
                                         >
                                         Show
                                         </Button>
                                        </div>
                                    )
                                }
                            }
                        }
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
            </div>
          );
        }
        else{
          return (
             <div>
              <label style={{width:'100%', fontWeight:'Bold', fontSize:'20px', textAlign:'center'}}>
                진행 상황 ({this.state.current_summary_num} / {this.state.expected_summary_num})
               <img
                  src={refreshIcon}
                  width="20"
                  height="20"
                  onClick={() =>
                    this.refreshSummary()
                  }
                  style = {{cursor:'pointer', marginBottom:'0.2%', marginLeft:'0.2%'}}
                />
              </label>
              <ProgressBar animated style={{width:'98%', height:'30px', marginLeft:"1%"}} now={this.state.progress_summary} label={`${this.state.progress_summary}%`} />
                  
              <div class='row' style ={{marginTop:'1.5%', width:'100%'}}/>
              <ReactTable
                data = {this.state.summaryLists}
                getTdProps={(state, rowInfo, column, instance) => {
                  if(rowInfo){
                    if(this.state.selectedProductIndex1 !== null){ // When you click a row not at first.
                      if(rowInfo.index == this.state.selectedProductIndex1){
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex1: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                            });
                          },
                          style: {
                            background: '#00ACFF'
                          }
                        }
                      }
                      else if(rowInfo.original['status_web'] == 'X' || rowInfo.original['status_data'] == 'X'){
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex1: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                            }, () => {this.getSummaryErrorDetail()});
                          },
                          style: {
                            background: '#FF919C'
                          }
                        }
                      }
                      else{
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex1: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                            });
                          }
                        }
                      }
                    }
                    else { // When you click a row at first.
                      if(rowInfo.original['statu_web'] == 'X' || rowInfo.original['status_data'] == 'X'){
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex1: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                            }, () => {this.getSummaryErrorDetail()});
                          },
                          style: {
                            background: '#FF919C'
                          }
                        }
                      }
                      else{
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex1: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                            });
                          }
                        }
                      }
                    }
                  }
                  else{
                    if(this.state.selectedProductIndex1 !== null){ // When you click a row not at first.
                      return {
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
                    Header: "No.",
                    width: 70,
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
                    Header: "웹페이지 URL",
                    resizable: false,
                    accessor: 'url',
                    Cell: ( row ) => {
                      return (
                        <div
                          style={{
                            textAlign:"center",
                            paddingTop:"4px",
                          }}
                        > {row.value} </div>
                      )
                    }
                  },
                  {
                    Header: "웹페이지 로딩",
                    resizable: false,
                    accessor: 'status_web',
                    width:100,
                    Cell: ( row ) => {
                      return (
                        <div
                          style={{
                            textAlign:"center",
                            paddingTop:"4px",
                          }}
                        > {row.value} </div>
                      )
                    }
                  },
                  {
                    Header: "페이지 XPath 검사",
                    resizable: false,
                    accessor: 'status_data',
                    width:130,
                    Cell: ( row ) => {
                      return (
                        <div
                          style={{
                            textAlign:"center",
                            paddingTop:"4px",
                          }}
                        > {row.value} </div>
                      )
                    }
                  }
                ]}
                minRows={5}
                showPagination ={false}
                defaultPageSize={100000}
                bordered = {false} 
                style={{
                  height: "350px"
                }}
                className="-striped -highlight"
              />

              <div class='row' style ={{marginTop:'1.5%', width:'100%'}}>
              </div>
              <label style={{paddingTop:'1%', paddingLeft:'1%', fontWeight:'bold'}}> Crawling 이력
                </label> 
                <img
                  src={refreshIcon}
                  width="20"
                  height="20"
                  onClick={() =>
                    this.refreshList()
                  }
                  style = {{cursor:'pointer', marginLeft:'1%', marginBottom:'0.2%' }}
                />
                <ReactTable
                    data = {items}
                    columns={[
                        {
                            Header: "Execution ID",
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
                            Header: "Start Time",
                            resizable: false,
                            accessor: "3",
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
                        },
                        {
                            Header: "Finish Time",
                            resizable: false,
                            accessor: "4",
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
                        },
                        {
                            Header: "# crawled / # fail / # invalid / # ALL",
                            resizable: false,
                            accessor: "6",
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
                                        > {row.value} / {row.original[7]} / {row.original[8]} / {row.original[9]} </div>
                                    )
                                }
                            }
                        },
                        {
                            Header: "Data",
                            resizable: false,
                            accessor: "0",
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
                                        > 
                                         <Button 
                                           color="secondary"
                                           style = {{float:'center',  textTransform: 'capitalize'}}
                                           onClick={() => {
                                                 this.state.execId = row.value
                                                 this.setState({execId: row.value, crawledModalShow: true})
                                               }
                                           }
                                         >
                                         Show
                                         </Button>
                                        </div>
                                    )
                                }
                            }
                        }
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
            </div>
          );
        }
        
    }
}
export default CrawledSummaryPage;
