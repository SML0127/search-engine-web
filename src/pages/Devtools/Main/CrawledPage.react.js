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
import CrawledProductDetailPage from './CrawledProductDetailPage.react.js'
import CrawledSummaryPage from './CrawledSummaryPage.react.js'
import refreshIcon from './refresh.png';

var g_var_execId = -1
class CrawledPage extends React.Component {

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
      this.state = this.initState()
      this.get_latest_progress()
      this.getProductName();
      this.getSummary()
    }
    

    //componentWillReceiveProps(nextProps) {
    //  g_var_execId = nextProps.execId;
    //  this.state = this.initState()
    //  this.getProductName();
    //
    //}

    initState() {
      return {
        productLists: [],
        summaryLists: [],
        selectedProductIndex: null,
        selectedProductIndex1: null,
        err_msg: '',
        err_msg_summary: '',
        expected_detail_num: 0,
        current_detail_num: 0,
        progress_detail: 0
      }
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



    getProductName(){
       const obj = this;
       axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
         req_type: "get_crawled_data",
         job_id: obj.props.JobId,
       })
       .then(function (response) {
         console.log(response)
         if( Object.keys(response['data']['result']).length  == 0){
            obj.setState({productLists: [], productOptionValues: [], productDescriptions: []});
            return;
         }
         if (response['data']['success'] == true) {
           let productLists = response['data']['result'];
           productLists = productLists.map(function(row, index){
             // -999 invalid, -998 btn or check xpath, -997 web, -1 extract
             const status_web = (parseInt(row[0]) == -997? "X" : "O");
             const status_check_xpath = (parseInt(row[0]) == -998? "X" : "O");
             var statu = 'O'
             if (parseInt(row[0]) == 0){
               statu = '진행중'
             }
             else if (parseInt(row[0]) == -1 || status_web == 'X' || status_check_xpath == 'X'){
               statu = 'X'
             }
             
             const status_data = statu 
             const name = row[1].slice(1,-1)
             const node_id = row[2]
             const mpid = row[3]
             return {num: index+1, name:name, status_web:status_web,status_check_xpath: status_check_xpath,  status_data: status_data, node_id: node_id, mpid: mpid};
           });
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

    getSummaryErrorDetail(selectedNodeId){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/task', {
        req_type: "get_failed_task_detail",
        node_id: selectedNodeId
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          obj.setState({err_msg_summary: response['data']['result']})
        } else {
          obj.setState({err_msg_summary: '에러 메세지를 가져오는데 실패하였습니다'})
        }
      })
      .catch(function (error){
        console.log(error);
      });
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
            current_detail_num: response['data']['result'][0],
            expected_detail_num: response['data']['result'][1], 
            progress_detail: isNaN(parseFloat(response['data']['result'][1]) / parseFloat(response['data']['result'][0]) * 100 ) ? 0 : (parseFloat(response['data']['result'][1]) / parseFloat(response['data']['result'][0]) * 100 )
          })
          console.log(parseFloat(response['data']['result'][1]) / parseFloat(response['data']['result'][0]) * 100 )
          console.log(isNaN(parseFloat(response['data']['result'][1]) / parseFloat(response['data']['result'][0]) * 100 ))
        } 
      })
      .catch(function (error){
        console.log(error);
      });
    }
 





    getProductErrorDetail(selectedNodeId){
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
 



    getProductDetail(selectedNodeId){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
        req_type: "get_product_detail",
        job_id: obj.props.JobId,
        node_id: selectedNodeId
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
           

    closeModal(){
        this.props.setModalShow(false)
    }



    render() {
        
        const TabSummary = () => {
            return (
                <div>
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
                                  selectedNodeId1: rowInfo.original['node_id'],
                                  isError1: false,
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
                                  selectedNodeId1: rowInfo.original['node_id'],
                                  isError1: true,
                                });
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
                                  selectedNodeId1: rowInfo.original['node_id'],
                                  isError1: false,
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
                                  selectedNodeId1: rowInfo.original['node_id'],
                                  isError1: true,
                                });
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
                                  selectedNodeId1: rowInfo.original['node_id'],
                                  isError1: false,
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
                <CrawledSummaryPage
                   selectedNodeId = {this.state.selectedNodeId1}
                   JobId = {this.props.JobId}
                   isError = {this.state.isError1}
                />
              </div>
            );
        }
        const TabDetail = () => {
          return (
                <div>
                  <label style={{width:'100%', fontWeight:'Bold', fontSize:'20px', textAlign:'center'}}>
                    진행 상황 ({this.state.current_detail_num} / {this.state.expected_detail_num})
                   <img
                      src={refreshIcon}
                      width="20"
                      height="20"
                      onClick={() =>
                        this.get_latest_progress()
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
                                  isError: false,
                                  selectedProductMpid: rowInfo.original['mpid'],
                                });
                              },
                              style: {
                                background: '#00ACFF'
                              }
                            }
                          }
                          else if(rowInfo.original['status_web'] == 'X' || rowInfo.original['status_data'] == 'X' || rowInfo.original['status_check_xpath'] == 'X'){
                            return {
                              onClick: (e) => {
                                this.setState({
                                  selectedProductIndex: rowInfo.index,
                                  selectedNodeId: rowInfo.original['node_id'],
                                  isError: true,
                                  selectedProductMpid: rowInfo.original['mpid'],
                                });
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
                                  isError: false,
                                  selectedProductMpid: rowInfo.original['mpid'],
                                });
                              }
                            }
                          }
                        }
                        else { // When you click a row at first.
                          if(rowInfo.original['statu_web'] == 'X' || rowInfo.original['status_data'] == 'X' || rowInfo.original['status_check_xpath'] == 'X'){
                            return {
                              onClick: (e) => {
                                this.setState({
                                  selectedProductIndex: rowInfo.index,
                                  selectedNodeId: rowInfo.original['node_id'],
                                  isError: true,
                                  selectedProductMpid: rowInfo.original['mpid'],
                                });
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
                                  isError: false,
                                  selectedProductMpid: rowInfo.original['mpid'],
                                });
                              }
                            }
                          }
                        }
                      }
                      else{
                        if(this.state.selectedProductIndex !== null){ // When you click a row not at first.
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
                <CrawledProductDetailPage 
                   selectedNodeId = {this.state.selectedNodeId}
                   JobId = {this.props.JobId}
                   isError = {this.state.isError}
                   selectedProductMpid = {this.state.selectedProductMpid}
                />

              </div>
            );
          
          }
        


        const tabs = [
          {
            label: '(Crawling) Product 페이지 수행', 
            Component: TabDetail
          },
          {
            label: '(Crawling) Summary 페이지 수행',
            Component: TabSummary
          },
          {
            label: 'My site upload / update 수행', 
            Component: (<div></div>)
          },
          {
            label: 'Target site upload / updatet 수행', 
            Component: (<div></div>)
          }
        ]

        return (
          <Tabs tabs={tabs} /* Props */ />
        )
    }
}
export default CrawledPage;
