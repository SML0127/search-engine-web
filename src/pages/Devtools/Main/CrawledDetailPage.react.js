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
import CrawledProductDetailPage from './CrawledProductDetailPage.react.js'
import { Tabs } from 'react-simple-tabs-component'
import refreshIcon from './refresh.png';
import ProgressBar from 'react-bootstrap/ProgressBar'

class CrawledDetailPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
    }

    onTodoChange(key,value){
      this.setState({
        [key]: value
      });
    }


 
    getProductDescription(){
      const obj = this;

      axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
        req_type: "get_product_description",
        job_id: obj.props.JobId,
        mpid: obj.state.selectedProductMpid
      })
      .then(function (response) {
        //console.log(response)
        if (response['data']['success'] == true) {
          let productDescriptions = response['data']['result'];
          productDescriptions = productDescriptions.map(function(row, index){
            const key = row[0];
            const value = row[1]; 
            return {num: index+1, key: key, value: value };
          });
          
          obj.setState({productDescriptions: productDescriptions});
        } else {
          console.log(response)
          //console.log('Failed to get pl');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }
 

    componentDidMount(){
      this.getProductName();
      this.refreshList();
      this.get_latest_progress()
    }

    refreshDetail(){
      this.getProductName();
      this.get_latest_progress()
    }
  
    initState() {
      return {
        productLists: [],
        selectedProductIndex: null,
        err_msg: '',
        err_msg_summary: '',
        show: false,
        expected_detail_num: 0,
        current_detail_num: 0,
        progress_detail: 0
      }
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

    get_latest_progress(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/executions', {
        req_type: "get_latest_progress",
        job_id: obj.props.JobId,
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          console.log(response)
          obj.setState({
            showCDPage: true,
            current_detail_num: response['data']['result'][0],
            expected_detail_num: response['data']['result'][1], 
            progress_detail: isNaN(parseFloat(response['data']['result'][1]) / parseFloat(response['data']['result'][0]) * 100 ) ? 0 : (parseFloat(response['data']['result'][0]) / parseFloat(response['data']['result'][1]) * 100 ).toFixed(2)
          })
        } 
      })
      .catch(function (error){
        console.log(error);
      });
    }

    getProductName(){
       const obj = this;
       axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
         req_type: "get_crawled_data",
         job_id: obj.props.JobId,
       })
       .then(function (response) {
         if (response['data']['success'] == true) {
           let productLists = response['data']['result'];
           productLists = productLists.map(function(row, index){
             // -999 invalid, -998 btn or check xpath, -997 web, -1 extract
             let status_web_tmp 
             let status_invalid_tmp
             let status_check_xpath_tmp 
             let status_data_tmp
             if(parseInt(row[0]) == -997){ // web error
               status_web_tmp = 'X' 
               status_invalid_tmp = 'X'
               status_check_xpath_tmp ='X'
               status_data_tmp = 'X'
             }
             else if(parseInt(row[0]) == -999){ // invalid 
               status_web_tmp = 'O' 
               status_invalid_tmp = 'X'
               status_check_xpath_tmp ='X'
               status_data_tmp = 'X'
             }
             else if(parseInt(row[0]) == -998){ // check xpath error
               status_web_tmp = 'O' 
               status_invalid_tmp = 'O'
               status_check_xpath_tmp ='X'
               status_data_tmp = 'X'
             }
             else if(parseInt(row[0]) == -1){ // crawling error
               status_web_tmp = 'O' 
               status_invalid_tmp = 'O'
               status_check_xpath_tmp ='O'
               status_data_tmp = 'X'
             }
             else if(parseInt(row[0]) == 0){ // crawling error
               status_web_tmp = '진행중' 
               status_invalid_tmp = '진행중'
               status_check_xpath_tmp ='진행중'
               status_data_tmp = '진행중'
             }
             else{
               status_web_tmp = 'O' 
               status_invalid_tmp = 'O'
               status_check_xpath_tmp ='O'
               status_data_tmp = 'O'
             }
             
             const status_web = status_web_tmp 
             const status_invalid = status_invalid_tmp
             const status_check_xpath = status_check_xpath_tmp
             const status_data = status_data_tmp

             const name = row[1].slice(1,-1)
             const node_id = row[2]
             const mpid = row[3]
             return {num: index+1, name:name, status_web:status_web,status_check_xpath: status_check_xpath,  status_data: status_data, node_id: node_id, mpid: mpid, status_invalid: status_invalid};
           });
           obj.setState({productLists: productLists});
           console.log(productLists)
         } else {
           console.log(response)
           console.log('Failed to get pl');
         }
       })
       .catch(function (error){
         console.log(error);
       });
     }


    getProductErrorDetail(){
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
 



    getProductDetail(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
        req_type: "get_product_detail",
        job_id: obj.props.JobId,
        node_id: this.state.selectedNodeId
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          let productDetail = response['data']['result'];
          var selectedProductUrl = ''
          var selectedProductDesc = ''
          var selectedProductName = ''
          var selectedProductPrice = ''
          var selectedProductStock = ''
          var selectedProductImage = ''
          var selectedProductShippingPrice = ''
          var selectedProductBrand = ''
          var selectedProductSpid = ''
          var selectedProductCurrency = ''
          for(const val of productDetail){
            if (val[0] == 'url'){
              selectedProductUrl = val[1]
            }
            else if (val[0] == 'name'){
              selectedProductName = val[1]
            }
            else if (val[0] == 'description'){
              selectedProductDesc = val[1]
            }
            else if (val[0] == 'price'){
              selectedProductPrice = val[1]
            }
            else if (val[0] == 'stock'){
              selectedProductStock = val[1]
            }
            else if (val[0] == 'shipping_price'){
              selectedProductShippingPrice = val[1]
            }
            else if (val[0] == 'images'){
              selectedProductImage = val[1][0]
            }
            else if (val[0] == 'source_site_product_id'){
              selectedProductSpid = val[1]
            }
            else if (val[0] == 'currency'){
              selectedProductCurrency = val[1]
            }
          }
          obj.setState({
            selectedProductUrl: selectedProductUrl,
            selectedProductDesc: selectedProductDesc, 
            selectedProductPrice: selectedProductPrice,
            selectedProductName: selectedProductName,
            selectedProductStock: selectedProductStock,
            selectedProductImage: selectedProductImage,
            selectedProductShippingPrice: selectedProductShippingPrice,
            selectedProductBrand: selectedProductBrand,
            selectedProductCurrency: selectedProductCurrency,
            selectedProductSpid: selectedProductSpid,
            err_msg: ''
          })
        } else {
          obj.setState({
            selectedProductUrl: "", 
            selectedProductDesc:  "",
            selectedProductPrice:  "",
            selectedProductName:  "",
            selectedProductStock: "",
            selectedProductImage: "",
            selectedProductShippingPrice: "",
            selectedProductBrand:  "",
            selectedProductCurrency: "",
            selectedProductSpid:  "",
            err_msg: ''
          })
          console.log(response)
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }
           

    render() {
        const err_msg = this.state.err_msg
        const {items} = this.state;
        if (err_msg != ''){
          return (
            <div>
              <label style={{width:'100%', fontWeight:'Bold', fontSize:'20px', textAlign:'center'}}>
                진행 상황 ({this.state.current_detail_num} / {this.state.expected_detail_num})
               <img
                  src={refreshIcon}
                  width="20"
                  height="20"
                  onClick={() =>
                    this.refreshDetail()
                  }
                  style = {{cursor:'pointer', marginBottom:'0.2%', marginLeft:'0.2%'}}
                />
              </label>
              <ProgressBar animated style={{width:'98%', height:'30px', marginLeft:"1%"}} now={this.state.progress_detail} label={`${this.state.progress_detail}%`} />
                  
              <div class='row' style ={{marginTop:'1.5%', width:'100%'}}/>

              <ReactTable
                data = {this.state.productLists}
                getTdProps={(state, rowInfo, column, instance) => {
                  if(rowInfo){
                    if(this.state.selectedProductIndex !== null){ // When you click a row not at first.
                      if(rowInfo.index == this.state.selectedProductIndex){
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                              selectedProductMpid: rowInfo.original['mpid'],
                            },()=>{this.getProductDetail()});
                          },
                          style: {
                            background: '#00ACFF'
                          }
                        }
                      }
                      else if(rowInfo.original['status_web'] == 'X' || rowInfo.original['status_data'] == 'X' || rowInfo.original['status_check_xpath'] == 'X' || rowInfo.original['status_invalid'] == 'X'){
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                              selectedProductMpid: rowInfo.original['mpid'],
                            },()=>{this.getProductErrorDetail()});
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
                              selectedNodeId: rowInfo.original['node_id'],
                              selectedProductMpid: rowInfo.original['mpid'],
                            },()=>{this.getProductDetail()});
                          }
                        }
                      }
                    }
                    else { // When you click a row at first.
                      if(rowInfo.original['statu_web'] == 'X' || rowInfo.original['status_data'] == 'X' || rowInfo.original['status_check_xpath'] == 'X' || rowInfo.original['status_invalid'] == 'X'){
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                              selectedProductMpid: rowInfo.original['mpid'],
                            },()=>{this.getProductErrorDetail()});
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
                              selectedNodeId: rowInfo.original['node_id'],
                              selectedProductMpid: rowInfo.original['mpid'],
                            },()=>{this.getProductDetail()});
                          }
                        }
                      }
                    }
                  }
                  else{
                    if(this.state.selectedProductIndex !== null){ 
                      return {
                      }
                    }
                    else { 
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
                    Header: "자체 상품코드",
                    resizable: false,
                    accessor: 'mpid',
                    width:150,
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
                    accessor: 'name',
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
                    Header: "Invalid 페이지 검사",
                    resizable: false,
                    accessor: 'status_invalid',
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
                  },
                  {
                    Header: "페이지 XPath 검사",
                    resizable: false,
                    accessor: 'status_check_xpath',
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
                  },
                  {
                    Header: "데이터 추출",
                    resizable: false,
                    accessor: 'status_data',
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
          )


        }
        else{
          return (
            <div>
              <label style={{width:'100%', fontWeight:'Bold', fontSize:'20px', textAlign:'center'}}>
                진행 상황 ({this.state.current_detail_num} / {this.state.expected_detail_num})
               <img
                  src={refreshIcon}
                  width="20"
                  height="20"
                  onClick={() =>
                    this.refreshDetail()
                  }
                  style = {{cursor:'pointer', marginBottom:'0.2%', marginLeft:'0.2%'}}
                />
              </label>
              <ProgressBar animated style={{width:'98%', height:'30px', marginLeft:"1%"}} now={this.state.progress_detail} label={`${this.state.progress_detail}%`} />
                  
              <div class='row' style ={{marginTop:'1.5%', width:'100%'}}/>

              <ReactTable
                data = {this.state.productLists}
                getTdProps={(state, rowInfo, column, instance) => {
                  if(rowInfo){
                    if(this.state.selectedProductIndex !== null){ // When you click a row not at first.
                      if(rowInfo.index == this.state.selectedProductIndex){
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                              selectedProductMpid: rowInfo.original['mpid'],
                            },()=>{this.getProductDetail()});
                          },
                          style: {
                            background: '#00ACFF'
                          }
                        }
                      }
                      else if(rowInfo.original['status_web'] == 'X' || rowInfo.original['status_data'] == 'X' || rowInfo.original['status_check_xpath'] == 'X' || rowInfo.original['status_invalid'] == 'X'){
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                              selectedProductMpid: rowInfo.original['mpid'],
                            },()=>{this.getProductErrorDetail()});
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
                              selectedNodeId: rowInfo.original['node_id'],
                              selectedProductMpid: rowInfo.original['mpid'],
                            },()=>{this.getProductDetail()});
                          }
                        }
                      }
                    }
                    else { // When you click a row at first.
                      if(rowInfo.original['statu_web'] == 'X' || rowInfo.original['status_data'] == 'X' || rowInfo.original['status_check_xpath'] == 'X' || rowInfo.original['status_invalid'] == 'X'){
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                              selectedProductMpid: rowInfo.original['mpid'],
                            },()=>{this.getProductErrorDetail()});
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
                              selectedNodeId: rowInfo.original['node_id'],
                              selectedProductMpid: rowInfo.original['mpid'],
                            },()=>{this.getProductDetail()});
                          }
                        }
                      }
                    }
                  }
                  else{
                    if(this.state.selectedProductIndex !== null){ 
                      return {
                      }
                    }
                    else { 
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
                    Header: "자체 상품코드",
                    resizable: false,
                    accessor: 'mpid',
                    width:150,
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
                    accessor: 'name',
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
                    Header: "Invalid 페이지 검사",
                    resizable: false,
                    accessor: 'status_invalid',
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
                  },
                  {
                    Header: "페이지 XPath 검사",
                    resizable: false,
                    accessor: 'status_check_xpath',
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
                  },
                  {
                    Header: "데이터 추출",
                    resizable: false,
                    accessor: 'status_data',
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

              <div style={{marginTop:'30px'}}>
                <div class='row'>
                  <div class='col-sm-6'>
                    <Image src={this.state.selectedProductImage || ''} rounded style= {{height:'300px', width:'300px', marginLeft:'100px'}}/>
                  </div>
                  <div class='col-sm-6'>
                    <div class='row' style={{width:'100%'}}>                      
                      <label style={{marginTop:'8px', marginLeft: '15px', width:'25%'}}> 자체 상품번호:</label>
                      <input readonly='readonly' name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.selectedProductMpid}/>
                    </div>

                    <div class='row' style={{width:'100%'}}>                      
                      <label style={{marginTop:'8px', marginLeft: '15px', width:'25%'}}> 상품명:</label>
                      <input readonly='readonly' name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.selectedProductName}/>
                    </div>


                    <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                      <label style={{marginTop:'8px', marginLeft: '15px', width:'25%'}}> 상품코드:</label>
                      <input readonly='readonly'  name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.selectedProductSpid}/>
                    </div>

                    <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                      <label style={{marginTop:'8px', marginLeft: '15px', width:'25%'}}> 금액:</label>
                      <input readonly='readonly'  name="name" class="form-control" style={{width:'25%'}} value={this.state.selectedProductPrice}/>
                      <label style={{marginTop:'8px', float:'right', width:'14%', marginLeft:'6%'}}> 화폐:</label>
                      <input readonly='readonly'  name="name" class="form-control" style={{float:'right', width:'25%'}} value={this.state.selectedProductCurrency}/>
                    </div>

                    <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                      <label style={{marginTop:'8px', marginLeft: '15px', width:'25%'}}> 배송비:</label>
                      <input readonly='readonly'  name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.selectedProductShippingPrice}/>
                    </div>

                    <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                      <label style={{marginTop:'8px', marginLeft: '15px', width:'25%'}}> 브랜드:</label>
                      <input readonly='readonly'  name="name" class="form-control" style={{width:'25%'}} value={this.state.selectedBrand}/>
                      <label style={{marginTop:'8px',float:'right', width:'14%', marginLeft:'6%'}}> 제조사:</label>
                      <input readonly='readonly'  name="name" class="form-control" style={{float:'right', width:'25%'}} value={this.state.selectedBrand}/>
                    </div>

                    <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                      <label style={{marginTop:'8px', marginLeft: '15px',width:'25%'}}> URL :</label>
                      <input readonly='readonly' name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.selectedProductUrl}/>
                    </div>

                    <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                      <label style={{marginTop:'8px', marginLeft: '15px',width:'25%'}}> 무게:</label>
                      <input readonly='readonly'  name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.selectedWeight}/>
                    </div>

                  </div>
                </div>
              </div>
              

              <div style={{borderBottom: '1px solid rgba(0, 0, 0, 0.09)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)', marginRight:'-20px', marginLeft:'-20px', marginTop:'30px'}}>
              </div>
              <div class='row' style ={{marginTop:'1.5%', width:'100%'}}>
              </div>
              <ReactTable
                data = {this.state.productDetail}
                columns={[
                  {
                    Header: "Key",
                    resizable: false,
                    accessor: "key",
                    width:100,
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
                    accessor: "value",
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
                  }
                ]}
                minRows={5}
                defaultPageSize={100}
                showPagination ={false}
                bordered = {false} 
                style={{
                  height: "180px"
                }}
                className="-striped -highlight"
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
          )
        }
    }
}
export default CrawledDetailPage;
