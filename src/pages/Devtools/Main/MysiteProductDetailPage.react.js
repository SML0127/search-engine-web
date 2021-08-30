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

class MysiteProductDetailPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
        this.refreshTab = this.refreshTab.bind(this)
    }

    onTodoChange(key,value){
      this.setState({
        [key]: value
      });
    }



    componentDidMount(){
      this.state = this.initState()
      if (this.state.show != true){
        this.getSmhid()
        this.getProductList()
        this.refreshMsiteList();
        this.get_latest_progress_mysite()
        this.state.show = true
      }
    }
   
    refreshTab(){
      this.getSmhid()
      this.getProductList()
      this.refreshMsiteList();
      this.get_latest_progress_mysite()
    }


    get_latest_progress_mysite(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/mysite', {
        req_type: "get_latest_progress",
        job_id: obj.props.JobId,
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          console.log(response)
          obj.setState({
            current_my_num: response['data']['result'][0],
            expected_my_num: response['data']['result'][1], 
            progress_my: isNaN(parseFloat(response['data']['result'][0]) / parseFloat(response['data']['result'][1]) * 100 ) ? 0 : (parseFloat(response['data']['result'][0]) / parseFloat(response['data']['result'][1]) * 100 ).toFixed(2)
          })
        } 
      })
      .catch(function (error){
        console.log(error);
      });
    }
 


    initState() {
      return {
        selectedProductIndex: null,
        selectedProductIndex1: null,
        err_msg: '',
      }
    }
//create table product_option_view (id serial primary key, user_id varchar(50), job_id integer, option_name varchar(1024), option_value varchar(1024), product_id varchar(1024), price integer, list_price integer, stock integer, msg text);
  getProductOptions(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/producoptions', {
        req_type: "get_product_options",
        job_id: obj.props.JobId,
        pid: parseInt(obj.state.selectedProductPid)
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          //console.log(response)
          let productOptions = response['data']['result'];
          let productOptionsCombination = {}
          let option_stock = 999
          let option_price = 0
          let option_stock_status = ""
          let option_msg = ""
          let productOptionValues = productOptions.map(function(row, index){
            const id = row[0];
            const pid = row[1];
            const oname = row[2];
            const ovalue = row[3];
            const list_price = row[4];
            const price = row[5];
            const stock = row[6];
            const stock_status = row[7] == 'None'? '':row[6];
            const msg = row[8] == 'None'? '':row[7];
            option_stock = stock
            option_price = price
            option_stock_status = stock_status
            option_msg = msg
            return {num: index+1, id: id, oname: oname, ovalue: ovalue, mpid: pid, price:price, list_price:list_price, stock:stock, stock_status: stock_status, msg: msg};
          });

 
          //console.log(productOptionValues) 
          obj.setState({productOptionValues: productOptionValues});

          //let productOptionValues = productOptions
          //     .map(function(row,idx){
          //      return {num: idx+1, name:row, stock: option_stock, price: option_price, stock_status: option_stock_status, msg: option_msg}
          //})

          ////console.log(processedOptionValues)
          //obj.setState({productOptionValues: productOptionValues});
          //obj.setState({productOptionsValues: productOptionsValues});
        } else {
          console.log(response)
          console.log('Failed to get product option');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }
  
    getErrMsg() {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/mysite', {
        req_type: "get_err_msg_mpid",
        sm_history_id: obj.state.smhid,
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


    getSmhid() {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/mysite', {
        req_type: "get_smhid",
        job_id: obj.props.JobId
      })
      .then(function (response) {
        if(response['data']['success'] == true) {
          let res = response['data']['result'];
          obj.setState({
            smhid: res
          });
        } else {
        }
      })
      .catch(function (error) {
          console.log(error);
      });
    }




    refreshMsiteList() {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/mysite', {
        req_type: "get_history",
        job_id: obj.props.JobId
      })
      .then(function (response) {
        //console.log(response)
        if(response['data']['success'] == true) {
          let history = response['data']['result'];
          // id, execution_id, TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS'), TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS')
          obj.setState({
              mysite_items: history
          });
        } else {
        }
      })
      .catch(function (error) {
          console.log(error);
      });
      //obj.createNotification('History');
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
 


  getProductList(statu = -1){
      //console.log('get product list')
      const obj = this;
      //console.log(userId, obj.props.JobId, statu)
      axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
        req_type: "get_product_list",
        job_id: obj.props.JobId,
        statu: statu
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
            // mpid, name, url, price, shipping_price, brand, weight, shipping_weight, shipping_price1, source_site_product_id, status, image_url, currency, stock, num_options, num_images
            if (row[2] == -1 || row[2] == '-1'){
              const mpid = row[0]
              const node_id = row[1]
              const name = row[3]
              const statu = -1
              return {num: index+1, mpid: mpid, node_id: node_id, name:name, is_fail: true, statu: statu};
            }
            else{
              const id = row[0] == 'None'? '':row[0];
              const name = row[1] == 'None'? '':row[1];
              const pid = row[0] == 'None'? '':row[0]
              const mpid = pid
              const purl = row[2] == 'None'? '':row[2];
              const price = row[3] == 'None'? '':row[3];
              const shpiping_price = row[4] == 'None'? '':row[4];
              const brand = row[5] == 'None'? '':row[5];
              const weight = row[6] == 'None'? '':row[6];
              const shipping_weight = row[7] == 'None'? '':row[7];
              const shipping_price1 = row[8] == 'None'? '':row[8];
              const source_site_product_id = row[9] == 'None'? '':row[9];
              const statu = row[10] == 'None'? '':row[10];
              const image_url = row[11] == 'None'? '':row[11];
              const currency = row[12] == 'None'? '':row[12];
              const stock = row[13] == 'None'? '':row[13];
              return {num: index+1, id:id, name:name, pid:pid, mpid:mpid, purl:purl, price:price, shpiping_price:shpiping_price, brand:brand, weight:weight, shipping_weight:shipping_weight, shipping_price1: shipping_price1, source_site_product_id: source_site_product_id, statu:statu, image_url:image_url, currency:currency, stock:stock, min_margin: 0, margin_rate: 0, min_price: 0, shipping_cost: 0, is_fail: false};
            }
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



    render() {
        const err_msg = this.state.err_msg;
        const {mysite_items} = this.state;

        if(err_msg != ''){
          return (
            <div>
               <label style={{width:'100%', fontWeight:'Bold', fontSize:'20px', textAlign:'center'}}>
                 진행 상황 ({this.state.current_my_num} / {this.state.expected_my_num})
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
               <ProgressBar animated style={{width:'98%', height:'30px', marginLeft:"1%"}} now={this.state.progress_my} label={`${this.state.progress_my}%`} />

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
                               selectedProductName: rowInfo.original['name'] != null ? rowInfo.original['name'] : '',
                               selectedProductUrl: rowInfo.original['purl'] != null ? rowInfo.original['purl'] : '',
                               selectedProductPid: rowInfo.original['pid'] != null ? rowInfo.original['pid'] : '',
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                               selectedProductBrand: rowInfo.original['brand'] != null ? rowInfo.original['brand'] : '',
                               selectedProductPrice: rowInfo.original['price'] != null ? rowInfo.original['price'] : '',
                               selectedProductCurrency: rowInfo.original['currency'] != null ? rowInfo.original['currency'] : '',
                               selectedProductStock: rowInfo.original['stock'] != null ? rowInfo.original['stock'] : '',
                               selectedProductShippingPrice: rowInfo.original['shipping_price'] != null ? rowInfo.original['shipping_price'] : '',
                               selectedProductWeight: rowInfo.original['weight'] != null ? rowInfo.original['weight'] : '',
                               selectedProductShippingWeight: rowInfo.original['shipping_weight'] != null ? rowInfo.original['shipping_weight'] : '',
                               selectedProductShippingPrice1: rowInfo.original['shipping_price1'] != null ? rowInfo.original['shipping_price1'] : '',
                               selectedProductSpid: rowInfo.original['source_site_product_id'] != null ? rowInfo.original['source_site_product_id'] : '',
                               selectedProductImage: rowInfo.original['image_url'] != null ? rowInfo.original['image_url'] : '',
                               selectedProductStatu: rowInfo.original['statu'] != null ? rowInfo.original['status'] : '',
                               selectedMinMargin: rowInfo.original['min_margin'] != null ? rowInfo.original['min_margin'] : '',
                               selectedMarginRate: rowInfo.original['margin_rate'] != null ? rowInfo.original['margin_rate'] : '',
                               selectedMinPrice: rowInfo.original['min_price'] != null ? rowInfo.original['min_price'] : '',
                               selectedShippingCost: rowInfo.original['shipping_cost'] != null ? rowInfo.original['shipping_cost'] : '',
                               err_msg: ''
                             },() => {console.log(this.state.selectedProductId);this.getProductDescription(); this.getProductOptions(); });
                           },
                           style: {
                             background: '#00ACFF'
                           }
                         }
                       }
                       else if(rowInfo.original['is_fail'] == true){
                         return {
                           onClick: (e) => {
                             this.setState({
                               selectedProductIndex: rowInfo.index,
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                               selectedProductNodeId: rowInfo.original['node_id'] != null ? rowInfo.original['node_id'] : '',
                               
                             }, () => {console.log('is_fail = true'); this.getErrMsg();});
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
                               selectedProductName: rowInfo.original['name'] != null ? rowInfo.original['name'] : '',
                               selectedProductUrl: rowInfo.original['purl'] != null ? rowInfo.original['purl'] : '',
                               selectedProductPid: rowInfo.original['pid'] != null ? rowInfo.original['pid'] : '',
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                               selectedProductBrand: rowInfo.original['brand'] != null ? rowInfo.original['brand'] : '',
                               selectedProductPrice: rowInfo.original['price'] != null ? rowInfo.original['price'] : '',
                               selectedProductCurrency: rowInfo.original['currency'] != null ? rowInfo.original['currency'] : '',
                               selectedProductStock: rowInfo.original['stock'] != null ? rowInfo.original['stock'] : '',
                               selectedProductShippingPrice: rowInfo.original['shipping_price'] != null ? rowInfo.original['shipping_price'] : '',
                               selectedProductWeight: rowInfo.original['weight'] != null ? rowInfo.original['weight'] : '',
                               selectedProductShippingWeight: rowInfo.original['shipping_weight'] != null ? rowInfo.original['shipping_weight'] : '',
                               selectedProductShippingPrice1: rowInfo.original['shipping_price1'] != null ? rowInfo.original['shipping_price1'] : '',
                               selectedProductSpid: rowInfo.original['source_site_product_id'] != null ? rowInfo.original['source_site_product_id'] : '',
                               selectedProductImage: rowInfo.original['image_url'] != null ? rowInfo.original['image_url'] : '',
                               selectedProductStatu: rowInfo.original['statu'] != null ? rowInfo.original['status'] : '',
                               selectedMinMargin: rowInfo.original['min_margin'] != null ? rowInfo.original['min_margin'] : '',
                               selectedMarginRate: rowInfo.original['margin_rate'] != null ? rowInfo.original['margin_rate'] : '',
                               selectedMinPrice: rowInfo.original['min_price'] != null ? rowInfo.original['min_price'] : '',
                               selectedShippingCost: rowInfo.original['shipping_cost'] != null ? rowInfo.original['shipping_cost'] : '',
                               err_msg: ''
                             },() => {console.log(this.state.selectedProductId);this.getProductDescription(); this.getProductOptions(); });
                           },
                         }
                       }
                     }
                     else{
                       if(rowInfo.original['is_fail'] == true){
                         return {
                           onClick: (e) => {
                             this.setState({
                               selectedProductIndex: rowInfo.index,
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                               selectedProductNodeId: rowInfo.original['node_id'] != null ? rowInfo.original['node_id'] : '',
                               selectedProductName: rowInfo.original['name'] != null ? rowInfo.original['name'] : '',
                               
                             }, () => {console.log('is_fail = true'); this.getErrMsg()});
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
                               selectedProductName: rowInfo.original['name'] != null ? rowInfo.original['name'] : '',
                               selectedProductUrl: rowInfo.original['purl'] != null ? rowInfo.original['purl'] : '',
                               selectedProductPid: rowInfo.original['pid'] != null ? rowInfo.original['pid'] : '',
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                               selectedProductBrand: rowInfo.original['brand'] != null ? rowInfo.original['brand'] : '',
                               selectedProductPrice: rowInfo.original['price'] != null ? rowInfo.original['price'] : '',
                               selectedProductCurrency: rowInfo.original['currency'] != null ? rowInfo.original['currency'] : '',
                               selectedProductStock: rowInfo.original['stock'] != null ? rowInfo.original['stock'] : '',
                               selectedProductShippingPrice: rowInfo.original['shipping_price'] != null ? rowInfo.original['shipping_price'] : '',
                               selectedProductWeight: rowInfo.original['weight'] != null ? rowInfo.original['weight'] : '',
                               selectedProductShippingWeight: rowInfo.original['shipping_weight'] != null ? rowInfo.original['shipping_weight'] : '',
                               selectedProductShippingPrice1: rowInfo.original['shipping_price1'] != null ? rowInfo.original['shipping_price1'] : '',
                               selectedProductSpid: rowInfo.original['source_site_product_id'] != null ? rowInfo.original['source_site_product_id'] : '',
                               selectedProductImage: rowInfo.original['image_url'] != null ? rowInfo.original['image_url'] : '',
                               selectedProductStatu: rowInfo.original['statu'] != null ? rowInfo.original['status'] : '',
                               selectedMinMargin: rowInfo.original['min_margin'] != null ? rowInfo.original['min_margin'] : '',
                               selectedMarginRate: rowInfo.original['margin_rate'] != null ? rowInfo.original['margin_rate'] : '',
                               selectedMinPrice: rowInfo.original['min_price'] != null ? rowInfo.original['min_price'] : '',
                               selectedShippingCost: rowInfo.original['shipping_cost'] != null ? rowInfo.original['shipping_cost'] : '',
                               err_msg: ''
                             },() => {console.log(this.state.selectedProductId);this.getProductDescription(); this.getProductOptions(); });
                           },
                         }
                       }
                     }
                   }
                   else{
                     return {
                     }
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
                     accessor: "statu",
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
                     accessor: "is_fail",
                     width: 100,
                     Cell: ( row ) => {
                       if (row.value == true) {
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
                           > O </div>
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
              <div style={{marginTop:'30px', width:'100%'}}>
              </div>
              <div class='row' style ={{marginTop:'1.5%', width:'100%'}}>
              </div>
              <Form.Textarea
                  row={100}
                  spellCheck="false" 
                  style={{width:'100%', height:'500px', minHeight:'500px', maxHeight:'500px', textAlign:'left', whiteSpace: 'pre-line'}}
                  value={err_msg}
                  wrap="off"
              />

              <label style={{paddingTop:'1%', paddingLeft:'1%', fontWeight:'bold'}}> My site 업로드 / 업데이트 이력 
                <img
                  src={refreshIcon}
                  width="20"
                  height="20"
                  onClick={() =>
                    this.refreshMsiteList()
                  }
                  style = {{cursor:'pointer', marginLeft:'0.5%', marginBottom:'0.2%' }}
                />
              </label> 
              <ReactTable
                data = {mysite_items}
                columns={[
                    {
                        Header: "Msite vm ID",
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
                        Header: "Finish Time",
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
                        Header: "Crawling ID",
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
                                             this.setState({smhistoryId: row.value, errmysitemodalShow: true})
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
               <label style={{width:'100%', fontWeight:'Bold', fontSize:'20px', textAlign:'center'}}>
                 진행 상황 ({this.state.current_my_num} / {this.state.expected_my_num})
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
               <ProgressBar animated style={{width:'98%', height:'30px', marginLeft:"1%"}} now={this.state.progress_my} label={`${this.state.progress_my}%`} />

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
                               selectedProductName: rowInfo.original['name'] != null ? rowInfo.original['name'] : '',
                               selectedProductUrl: rowInfo.original['purl'] != null ? rowInfo.original['purl'] : '',
                               selectedProductPid: rowInfo.original['pid'] != null ? rowInfo.original['pid'] : '',
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                               selectedProductBrand: rowInfo.original['brand'] != null ? rowInfo.original['brand'] : '',
                               selectedProductPrice: rowInfo.original['price'] != null ? rowInfo.original['price'] : '',
                               selectedProductCurrency: rowInfo.original['currency'] != null ? rowInfo.original['currency'] : '',
                               selectedProductStock: rowInfo.original['stock'] != null ? rowInfo.original['stock'] : '',
                               selectedProductShippingPrice: rowInfo.original['shipping_price'] != null ? rowInfo.original['shipping_price'] : '',
                               selectedProductWeight: rowInfo.original['weight'] != null ? rowInfo.original['weight'] : '',
                               selectedProductShippingWeight: rowInfo.original['shipping_weight'] != null ? rowInfo.original['shipping_weight'] : '',
                               selectedProductShippingPrice1: rowInfo.original['shipping_price1'] != null ? rowInfo.original['shipping_price1'] : '',
                               selectedProductSpid: rowInfo.original['source_site_product_id'] != null ? rowInfo.original['source_site_product_id'] : '',
                               selectedProductImage: rowInfo.original['image_url'] != null ? rowInfo.original['image_url'] : '',
                               selectedProductStatu: rowInfo.original['statu'] != null ? rowInfo.original['status'] : '',
                               selectedMinMargin: rowInfo.original['min_margin'] != null ? rowInfo.original['min_margin'] : '',
                               selectedMarginRate: rowInfo.original['margin_rate'] != null ? rowInfo.original['margin_rate'] : '',
                               selectedMinPrice: rowInfo.original['min_price'] != null ? rowInfo.original['min_price'] : '',
                               selectedShippingCost: rowInfo.original['shipping_cost'] != null ? rowInfo.original['shipping_cost'] : '',
                               err_msg: ""
                             },() => {console.log(this.state.selectedProductId);this.getProductDescription(); this.getProductOptions(); });
                           },
                           style: {
                             background: '#00ACFF'
                           }
                         }
                       }
                       else if(rowInfo.original['is_fail'] == true){
                         return {
                           onClick: (e) => {
                             this.setState({
                               selectedProductIndex: rowInfo.index,
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                               selectedProductNodeId: rowInfo.original['node_id'] != null ? rowInfo.original['node_id'] : '',
                               
                             }, () => {console.log('is_fail = true'); this.getErrMsg();});
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
                               selectedProductName: rowInfo.original['name'] != null ? rowInfo.original['name'] : '',
                               selectedProductUrl: rowInfo.original['purl'] != null ? rowInfo.original['purl'] : '',
                               selectedProductPid: rowInfo.original['pid'] != null ? rowInfo.original['pid'] : '',
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                               selectedProductBrand: rowInfo.original['brand'] != null ? rowInfo.original['brand'] : '',
                               selectedProductPrice: rowInfo.original['price'] != null ? rowInfo.original['price'] : '',
                               selectedProductCurrency: rowInfo.original['currency'] != null ? rowInfo.original['currency'] : '',
                               selectedProductStock: rowInfo.original['stock'] != null ? rowInfo.original['stock'] : '',
                               selectedProductShippingPrice: rowInfo.original['shipping_price'] != null ? rowInfo.original['shipping_price'] : '',
                               selectedProductWeight: rowInfo.original['weight'] != null ? rowInfo.original['weight'] : '',
                               selectedProductShippingWeight: rowInfo.original['shipping_weight'] != null ? rowInfo.original['shipping_weight'] : '',
                               selectedProductShippingPrice1: rowInfo.original['shipping_price1'] != null ? rowInfo.original['shipping_price1'] : '',
                               selectedProductSpid: rowInfo.original['source_site_product_id'] != null ? rowInfo.original['source_site_product_id'] : '',
                               selectedProductImage: rowInfo.original['image_url'] != null ? rowInfo.original['image_url'] : '',
                               selectedProductStatu: rowInfo.original['statu'] != null ? rowInfo.original['status'] : '',
                               selectedMinMargin: rowInfo.original['min_margin'] != null ? rowInfo.original['min_margin'] : '',
                               selectedMarginRate: rowInfo.original['margin_rate'] != null ? rowInfo.original['margin_rate'] : '',
                               selectedMinPrice: rowInfo.original['min_price'] != null ? rowInfo.original['min_price'] : '',
                               selectedShippingCost: rowInfo.original['shipping_cost'] != null ? rowInfo.original['shipping_cost'] : '',
                               err_msg: ""
                             },() => {console.log(this.state.selectedProductId);this.getProductDescription(); this.getProductOptions(); });
                           },
                         }
                       }
                     }
                     else{
                       if(rowInfo.original['is_fail'] == true){
                         return {
                           onClick: (e) => {
                             this.setState({
                               selectedProductIndex: rowInfo.index,
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                               selectedProductNodeId: rowInfo.original['node_id'] != null ? rowInfo.original['node_id'] : '',
                               selectedProductName: rowInfo.original['name'] != null ? rowInfo.original['name'] : '',
                               
                             }, () => {console.log('is_fail = true'); this.getErrMsg();});
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
                               selectedProductName: rowInfo.original['name'] != null ? rowInfo.original['name'] : '',
                               selectedProductUrl: rowInfo.original['purl'] != null ? rowInfo.original['purl'] : '',
                               selectedProductPid: rowInfo.original['pid'] != null ? rowInfo.original['pid'] : '',
                               selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                               selectedProductBrand: rowInfo.original['brand'] != null ? rowInfo.original['brand'] : '',
                               selectedProductPrice: rowInfo.original['price'] != null ? rowInfo.original['price'] : '',
                               selectedProductCurrency: rowInfo.original['currency'] != null ? rowInfo.original['currency'] : '',
                               selectedProductStock: rowInfo.original['stock'] != null ? rowInfo.original['stock'] : '',
                               selectedProductShippingPrice: rowInfo.original['shipping_price'] != null ? rowInfo.original['shipping_price'] : '',
                               selectedProductWeight: rowInfo.original['weight'] != null ? rowInfo.original['weight'] : '',
                               selectedProductShippingWeight: rowInfo.original['shipping_weight'] != null ? rowInfo.original['shipping_weight'] : '',
                               selectedProductShippingPrice1: rowInfo.original['shipping_price1'] != null ? rowInfo.original['shipping_price1'] : '',
                               selectedProductSpid: rowInfo.original['source_site_product_id'] != null ? rowInfo.original['source_site_product_id'] : '',
                               selectedProductImage: rowInfo.original['image_url'] != null ? rowInfo.original['image_url'] : '',
                               selectedProductStatu: rowInfo.original['statu'] != null ? rowInfo.original['status'] : '',
                               selectedMinMargin: rowInfo.original['min_margin'] != null ? rowInfo.original['min_margin'] : '',
                               selectedMarginRate: rowInfo.original['margin_rate'] != null ? rowInfo.original['margin_rate'] : '',
                               selectedMinPrice: rowInfo.original['min_price'] != null ? rowInfo.original['min_price'] : '',
                               selectedShippingCost: rowInfo.original['shipping_cost'] != null ? rowInfo.original['shipping_cost'] : '',
                               err_msg: ''
                             },() => {console.log(this.state.selectedProductId);this.getProductDescription(); this.getProductOptions(); });
                           },
                         }
                       }
                     }
                   }
                   else{
                     return {
                     }
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
                     accessor: "statu",
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
                     accessor: "is_fail",
                     width: 100,
                     Cell: ( row ) => {
                       if (row.value == true) {
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
                           > O </div>
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
              <div style={{marginTop:'30px', width:'100%'}}>
              </div>
              <div class='row'>
                <div class='col-sm-6'>
                  <Image src={this.state.selectedProductImage || ''} rounded style= {{height:'450px', width:'450px', marginLeft:'150px'}}/>
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
                    <input readonly='readonly'  name="name" class="form-control" style={{width:'25%'}} value={this.state.selectedProductBrand}/>
                    <label style={{marginTop:'8px',float:'right', width:'14%', marginLeft:'6%'}}> 제조사:</label>
                    <input readonly='readonly'  name="name" class="form-control" style={{float:'right', width:'25%'}} value={this.state.selectedProductBrand}/>
                  </div>

                  <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                    <label style={{marginTop:'8px', marginLeft: '15px',width:'25%'}}> URL :</label>
                    <input readonly='readonly' name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.selectedProductUrl}/>
                  </div>

                  <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                    <label style={{marginTop:'8px', marginLeft: '15px',width:'25%'}}> 무게:</label>
                    <input readonly='readonly'  name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.selectedWeight}/>
                  </div>
                  <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                    <ReactTable
                      data = {this.state.productOptionValues}
                      getTdProps={(state, rowInfo, column, instance) => {
                        if(rowInfo){
                          if(this.state.selectedProductIndex0 !== null){ // When you click a row not at first.
                            return {
                              onClick: (e) => {
                                this.setState({
                                  selectedProductIndex0: rowInfo.index,
                                  selectedProductId: rowInfo.original['id'],
                                });
                              },
                              style: {
                                background: rowInfo.index === this.state.selectedProductIndex0 ? '#00ACFF' : null
                              }
                            }
                          }
                          else { // When you click a row at first.
                            return {
                              onClick: (e) => {
                                this.setState({
                                  selectedProductIndex0: rowInfo.index,
                                  selectedProductId: rowInfo.original['id'],
                                });
                              }
                            }
                          }
                        }
                        else{
                          if(this.state.selectedProductIndex0 !== null){ // When you click a row not at first.
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
                          Header: "옵션 이름",
                          resizable: false,
                          accessor: "oname",
                          Cell: ( row ) => {
                            return (
                              <div
                                style={{
                                  textAlign:"center",
                                  paddingTop:"3px"
                                }}
                              > {row.value} </div>
                            )
                          }
                        },
                        {
                          Header: "옵션 값",
                          resizable: false,
                          accessor: "ovalue",
                          Cell: ( row ) => {
                            return (
                              <div
                                style={{
                                  textAlign:"center",
                                  paddingTop:"3px"
                                }}
                              > {row.value} </div>
                            )
                          }
                        }
                      ]}
                      minRows={4}
                      defaultPageSize={999}
                      showPagination ={false}
                      bordered = {false} 
                      style={{
                        height: "180px",
                        width: "100%"
                      }}
                      className="-striped -highlight"
                    />
                  </div>
                </div>
              </div>
              <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                <ReactTable
                  data = {this.state.productDescriptions}
                  columns={[
                    {
                      Header: "Key",
                      resizable: false,
                      accessor: "key",
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
                  defaultPageSize={1000}
                  showPagination ={false}
                  bordered = {false} 
                  style={{
                    height: "180px",
                    width: "100%"
                  }}
                  className="-striped -highlight"
                />
              </div>
              <label style={{paddingTop:'1%', paddingLeft:'1%', fontWeight:'bold'}}> My site 업로드 / 업데이트 이력 
                <img
                  src={refreshIcon}
                  width="20"
                  height="20"
                  onClick={() =>
                    this.refreshMsiteList()
                  }
                  style = {{cursor:'pointer', marginLeft:'0.5%', marginBottom:'0.2%' }}
                />
              </label> 
              <ReactTable
                data = {mysite_items}
                columns={[
                    {
                        Header: "Msite vm ID",
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
                        Header: "Finish Time",
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
                        Header: "Crawling ID",
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
                                             this.setState({smhistoryId: row.value, errmysitemodalShow: true})
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
export default MysiteProductDetailPage;
