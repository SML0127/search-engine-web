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
import ProgressBar from 'react-bootstrap/ProgressBar'
import setting_server from '../setting_server';
import { Tabs } from 'react-simple-tabs-component'
import refreshIcon from './refresh.png';

class TargetsiteProductDetailPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
        this.updateTargetsite = this.updateTargetsite.bind(this)
    }

    onTodoChange(key,value){
      this.setState({
        [key]: value
      });
    }
    updateTargetsite(event) {
      console.log(event.target.value)
      this.setState({targetsite: event.target.value});
      this.get_latest_progress_targetsite(event.target.value)
      this.getProductList(event.target.value)
    }


    componentDidMount(){
      this.state = this.initState()
      if (this.state.show != true){
        this.refreshTsiteList()
        this.getUploadedTargetsites()
        this.state.show = true
      }
    }
    
    initState() {
      return {
        selectedProductIndex: null,
        selectedProductIndex1: null,
        err_msg: '',
        targetsite: '',
        current_target_num: 0,
        expected_target_num:0,
        progress_target: 0
      }
    }

    get_latest_progress_targetsite(targetsite){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/targetsite', {
        req_type: "get_latest_progress",
        job_id: obj.props.JobId,
        targetsite: targetsite,
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          //console.log(response)
          obj.setState({
            current_target_num: response['data']['result'][0],
            expected_target_num: response['data']['result'][1], 
            progress_target: isNaN(parseFloat(response['data']['result'][1]) / parseFloat(response['data']['result'][0]) * 100 ) ? 0 : parseInt(parseFloat(response['data']['result'][0]) / parseFloat(response['data']['result'][1]) * 100 ).toFixed(2)
          })
          //console.log(isNaN(parseFloat(response['data']['result'][0]) / parseFloat(response['data']['result'][1]) * 100 ))
        } 
      })
      .catch(function (error){
        console.log(error);
      });
    }

    refreshTsiteList() {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/targetsite', {
        req_type: "get_history",
        job_id: obj.props.JobId
      })
      .then(function (response) {
        //console.log(response)
        if(response['data']['success'] == true) {
          let history = response['data']['result'];
          obj.setState({
              targetsite_items: history
          });
        } else {
        }
      })
      .catch(function (error) {
          console.log(error);
      });
      //obj.createNotification('History');
    }

    getUploadedTargetsites() {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/targetsite', {
        req_type: "get_uploaded_targetsites",
        job_id: obj.props.JobId
      })
      .then(function (response) {
        //console.log(response)
        if(response['data']['success'] == true) {
          let targetsites = response['data']['result']
              .map((code) => <option value={code}>{code}</option>);
          obj.setState({
            targetsites: targetsites,
          });
        }
        
      })
      .catch(function (error) {
          console.log(error);
      });
    }

    refreshTab(){
      this.get_latest_progress_targetsite(this.state.targetsite)
      this.getProductList(this.state.targetsite)
    }

  getProductList(targetsite){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/targetsite', {
        req_type: "get_product_list",
        job_id: obj.props.JobId,
        targetsite: targetsite
      })
      .then(function (response) {
        //console.log(response)
        if( Object.keys(response['data']['result']).length  == 0){
           obj.setState({productLists: [], productOptionValues: [], productDescriptions: []});
           return;
        }
        if (response['data']['success'] == true) {
          let productLists = response['data']['result'];
          
          productLists = productLists.map(function(row, index){
              const id = row[0] == 'None'? '':row[0];
              const name = row[1] == 'None'? '':row[1];
              const pid = row[0] == 'None'? '':row[0]
              const mpid = pid
              const upload_success = row[16] == 'None'? '':row[16];
              const product_status = row[17] == 'None'? '':row[17];
              return {num: index+1, id:id, name:name, pid:pid, mpid:mpid, upload_success: upload_success, product_status: product_status};
          });
          //console.log(productLists)
          obj.setState({productLists: productLists});
        } else {
          console.log(response)
          console.log('Failed to get pl');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

    getErrMsg() {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/targetsite', {
        req_type: "get_err_msg_mpid",
        targetsite: obj.state.targetsite,
        mpid: obj.state.selectedProductMpid
      })
      .then(function (response) {
        if(response['data']['success'] == true) {
          let res = response['data']['result'];
          //console.log(res)
          obj.setState({
            err_msg: res[2],
          });

        } else {
          //console.log(response);
        }
      })
      .catch(function (error) {
          console.log(error);
      });
    }




    render() {
        const err_msg = this.state.err_msg;
        const {targetsite_items} = this.state;

        if(err_msg != ''){
          return (
            <div>
              <label style={{width:'8%', fontWeight:'Bold', fontSize:'25px', marginLeft:'2%', height:'50px', marginTop:'6px'}}>
                타겟사이트 :
              </label>
              <select
                class="form-control"
                style={{width:"89%", height:'50px', marginReft:'1%', float:'right'}}
                value={this.state.targetsite}
                onChange={this.updateTargetsite}
                ref={ref => this.targetsite = ref}
              >
                <option value="" disabled selected>Select Targetsite</option>
                {this.state.targetsites}
              </select>

              <div class='row' style ={{marginTop:'1.5%', width:'100%'}}/>

              <label style={{width:'100%', fontWeight:'Bold', fontSize:'20px', textAlign:'center'}}>
                진행 상황 ({this.state.current_target_num} / {this.state.expected_target_num})
               <img
                  src={refreshIcon}
                  width="20"
                  height="20"
                  onClick={() =>
                    this.refreshTab()
                  }
                  style = {{cursor:'pointer', marginBottom:'0.2%', marginLeft:'0.2%'}}
                />
              </label>
              <ProgressBar animated style={{width:'98%', height:'30px', marginLeft:"1%"}} now={this.state.progress_target} label={`${this.state.progress_target}%`} />

              <div class='row' style ={{marginTop:'1.5%', width:'100%'}}/>

              <ReactTable
                 data = {this.state.productLists}
                 getTdProps={(state, rowInfo, column, instance) => {
                   if(rowInfo){
                     if(this.state.selectedProductIndex !== null){ 
                       if(rowInfo.index == this.state.selectedProductIndex){
                         return {
                           onClick: (e) => {
                             this.setState({
                               selectedProductIndex: rowInfo.index,
                               selectedProductId: rowInfo.original['id'] != null ? rowInfo.original['id'] : '' ,
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                               err_msg: ''
                             });
                           },
                           style: {
                             background: '#00ACFF'
                           }
                         }
                       }
                       else if(rowInfo.original['upload_success'] == false){
                         return {
                           onClick: (e) => {
                             this.setState({
                               selectedProductIndex: rowInfo.index,
                               selectedProductId: rowInfo.original['id'] != null ? rowInfo.original['id'] : '' ,
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : ''
                             }, () => {console.log('upload_success true'); this.getErrMsg();});
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
                               selectedProductIndex: rowInfo.index,
                               selectedProductId: rowInfo.original['id'] != null ? rowInfo.original['id'] : '' ,
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                               err_msg: ''
                             });
                           }
                         }
                       }
                     }
                     else{ 
                       if(rowInfo.original['upload_success'] == false){
                         return {
                           onClick: (e) => {
                             this.setState({
                               selectedProductIndex: rowInfo.index,
                               selectedProductId: rowInfo.original['id'] != null ? rowInfo.original['id'] : '' ,
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : ''
                             }, () => {console.log('upload_success true'); this.getErrMsg();});
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
                               selectedProductIndex: rowInfo.index,
                               selectedProductId: rowInfo.original['id'] != null ? rowInfo.original['id'] : '' ,
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                               err_msg: ''
                             });
                           }
                         }
                       }
                     }
                   }
                   else{
                     return {}
                   }
                 }}
                 columns={[
                   {
                     Header: "No.",
                     resizable: false,
                     width: 70,
                     accessor: "num",
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
                     Header: "자체 상품코드",
                     resizable: false,
                     width: 150,
                     accessor: "mpid",
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
                     Header: "상품명",
                     resizable: false,
                     accessor: "name",
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
                     Header: "상태",
                     resizable: false,
                     accessor: "product_status",
                     width: 100,
                     Cell: ( row ) => {
                       if (row.value == 0) {
                         return (
                           <div
                             style={{
                               textAlign:"center",
                               paddingTop:"4px",
                             }}
                           > Up-to-date </div>
                         )
                       }
                       else if (row.value == 1) {
                         return (
                           <div
                             style={{
                               textAlign:"center",
                               paddingTop:"4px",
                             }}
                           > Updated </div>
                         )
                       }
                       else if (row.value == 2) {
                         return (
                           <div
                             style={{
                               textAlign:"center",
                               paddingTop:"4px",
                             }}
                           > New </div>
                         )
                       }
                       else if (row.value == 3) {
                         return (
                           <div
                             style={{
                               textAlign:"center",
                               paddingTop:"4px",
                             }}
                           > Deleted </div>
                         )
                       }
                       else{
                         return (
                           <div
                             style={{
                               textAlign:"center",
                               paddingTop:"4px",
                             }}
                           > - </div>
                         )
                       }
                     }
                   },
                   {
                     Header: "성공 / 실패",
                     resizable: false,
                     accessor: "upload_success",
                     width: 100,
                     Cell: ( row ) => {
                       if (row.value == true) {
                         return (
                           <div
                             style={{
                               textAlign:"center",
                               paddingTop:"4px",
                             }}
                           > O </div>
                         )
                       }
                       else if (row.value == false){
                         return (
                           <div
                             style={{
                               textAlign:"center",
                               paddingTop:"4px",
                             }}
                           > X </div>
                         )
                       }
                       else{
                         return (
                           <div
                             style={{
                               textAlign:"center",
                               paddingTop:"4px",
                             }}
                           > 업로드 전 </div>
                         )
                       }
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

              <div class='row' style ={{marginTop:'1.5%', width:'100%'}}>
              </div>

              <label style={{paddingTop:'1%', paddingLeft:'1%', fontWeight:'bold'}}> Target site 업로드 이력
                <img
                  src={refreshIcon}
                  width="20"
                  height="20"
                  onClick={() =>
                    this.refreshTsiteList()
                  }
                  style = {{cursor:'pointer', marginLeft:'0.5%', marginBottom:'0.2%' }}
                />
              </label> 
              <ReactTable
                  data = {targetsite_items}
                  columns={[
                      {
                          Header: "Tsite vm ID",
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
                      },
                      {
                          Header: "Finish Time",
                          resizable: false,
                          accessor: "2",
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
                          Header: "Msite vm ID",
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
                          Header: "Target Site",
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
                          Header: "Error Message",
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
                                               console.log(row.value)
                                               this.setState({mthistoryId: row.value, errtargetsitemodalShow: true})
                                               console.log(this.state)
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
              <label style={{width:'8%', fontWeight:'Bold', fontSize:'25px', marginLeft:'2%', height:'50px', marginTop:'6px'}}>
                타겟사이트 :
              </label>
               <select
                 class="form-control"
                 style={{width:"89%", height:'50px', marginReft:'1%', float:'right'}}
                 value={this.state.targetsite}
                 onChange={this.updateTargetsite}
                 ref={ref => this.targetsite = ref}
               >
                 <option value="" disabled selected>Select Targetsite</option>
                 {this.state.targetsites}
               </select>
               <div class='row' style ={{marginTop:'1.5%', width:'100%'}}/>

               <label style={{width:'100%', fontWeight:'Bold', fontSize:'20px', textAlign:'center'}}>
                 진행 상황 ({this.state.current_target_num} / {this.state.expected_target_num})
                <img
                   src={refreshIcon}
                   width="20"
                   height="20"
                   onClick={() =>
                    this.refreshTab()
                   }
                   style = {{cursor:'pointer', marginBottom:'0.2%', marginLeft:'0.2%'}}
                 />
               </label>
               <ProgressBar animated style={{width:'98%', height:'30px', marginLeft:"1%"}} now={this.state.progress_target} label={`${this.state.progress_target}%`} />

               <div class='row' style ={{marginTop:'1.5%', width:'100%'}}/>


               <ReactTable
                 data = {this.state.productLists}
                 getTdProps={(state, rowInfo, column, instance) => {
                   if(rowInfo){
                     if(this.state.selectedProductIndex !== null){ 
                       if(rowInfo.index == this.state.selectedProductIndex){
                         return {
                           onClick: (e) => {
                             this.setState({
                               selectedProductIndex: rowInfo.index,
                               selectedProductId: rowInfo.original['id'] != null ? rowInfo.original['id'] : '' ,
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                               err_msg: ''
                             });
                           },
                           style: {
                             background: '#00ACFF'
                           }
                         }
                       }
                       else if(rowInfo.original['upload_success'] == false){
                         return {
                           onClick: (e) => {
                             this.setState({
                               selectedProductIndex: rowInfo.index,
                               selectedProductId: rowInfo.original['id'] != null ? rowInfo.original['id'] : '' ,
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : ''
                             }, () => {console.log('upload_success true'); this.getErrMsg();});
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
                               selectedProductIndex: rowInfo.index,
                               selectedProductId: rowInfo.original['id'] != null ? rowInfo.original['id'] : '' ,
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                               err_msg: ''
                             });
                           }
                         }
                       }
                     }
                     else{ 
                       if(rowInfo.original['upload_success'] == false){
                         return {
                           onClick: (e) => {
                             this.setState({
                               selectedProductIndex: rowInfo.index,
                               selectedProductId: rowInfo.original['id'] != null ? rowInfo.original['id'] : '' ,
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : ''
                             }, () => {console.log('upload_success true'); this.getErrMsg();});
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
                               selectedProductIndex: rowInfo.index,
                               selectedProductId: rowInfo.original['id'] != null ? rowInfo.original['id'] : '' ,
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                               err_msg: ''
                             });
                           }
                         }
                       }
                     }
                   }
                   else{
                     return {}
                   }
                 }}
                 columns={[
                   {
                     Header: "No.",
                     resizable: false,
                     width: 70,
                     accessor: "num",
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
                     Header: "자체 상품코드",
                     resizable: false,
                     width: 150,
                     accessor: "mpid",
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
                     Header: "상품명",
                     resizable: false,
                     accessor: "name",
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
                     Header: "상태",
                     resizable: false,
                     accessor: "product_status",
                     width: 100,
                     Cell: ( row ) => {
                       if (row.value == 0) {
                         return (
                           <div
                             style={{
                               textAlign:"center",
                               paddingTop:"4px",
                             }}
                           > Up-to-date </div>
                         )
                       }
                       else if (row.value == 1) {
                         return (
                           <div
                             style={{
                               textAlign:"center",
                               paddingTop:"4px",
                             }}
                           > Updated </div>
                         )
                       }
                       else if (row.value == 2) {
                         return (
                           <div
                             style={{
                               textAlign:"center",
                               paddingTop:"4px",
                             }}
                           > New </div>
                         )
                       }
                       else if (row.value == 3) {
                         return (
                           <div
                             style={{
                               textAlign:"center",
                               paddingTop:"4px",
                             }}
                           > Deleted </div>
                         )
                       }
                       else{
                         return (
                           <div
                             style={{
                               textAlign:"center",
                               paddingTop:"4px",
                             }}
                           > - </div>
                         )
                       }
                     }
                   },
                   {
                     Header: "성공 / 실패",
                     resizable: false,
                     accessor: "upload_success",
                     width: 100,
                     Cell: ( row ) => {
                       if (row.value == true) {
                         return (
                           <div
                             style={{
                               textAlign:"center",
                               paddingTop:"4px",
                             }}
                           > O </div>
                         )
                       }
                       else if (row.value == false){
                         return (
                           <div
                             style={{
                               textAlign:"center",
                               paddingTop:"4px",
                             }}
                           > X </div>
                         )
                       }
                       else{
                         return (
                           <div
                             style={{
                               textAlign:"center",
                               paddingTop:"4px",
                             }}
                           > 업로드 전 </div>
                         )
                       }
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

              <label style={{paddingTop:'1%', paddingLeft:'1%', fontWeight:'bold'}}> Target site 업로드 이력
                <img
                  src={refreshIcon}
                  width="20"
                  height="20"
                  onClick={() =>
                    this.refreshTsiteList()
                  }
                  style = {{cursor:'pointer', marginLeft:'0.5%', marginBottom:'0.2%' }}
                />
              </label> 
              <ReactTable
                  data = {targetsite_items}
                  columns={[
                      {
                          Header: "Tsite vm ID",
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
                      },
                      {
                          Header: "Finish Time",
                          resizable: false,
                          accessor: "2",
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
                          Header: "Msite vm ID",
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
                          Header: "Target Site",
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
                          Header: "Error Message",
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
                                               console.log(row.value)
                                               this.setState({mthistoryId: row.value, errtargetsitemodalShow: true})
                                               console.log(this.state)
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
export default TargetsiteProductDetailPage;
