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


class HistoryModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
        this.getProductHistoryName = this.getProductHistoryName.bind(this)
        this.getProductHistoryTargetsite = this.getProductHistoryTargetsite.bind(this)
        this.getProductHistoryTime = this.getProductHistoryTime.bind(this)
    }

    onTodoChange(key,value){
      this.setState({
        [key]: value
      });
    }



    getMpidPricingInfo(){
      const obj = this;
      //console.log(userId, obj.props.JobId, statu)
      axios.post(setting_server.DB_SERVER+'/api/db/pricinginformation', {
          req_type: "get_mpid_pricing_information",
          job_id: obj.props.JobId,
          mpid: obj.state.selectedProductMpid
      })
      .then(function (response) {

        if (response['data']['success'] === true) {
          console.log(response)
          //min_margin, margin_rate, min_price, shipping_cost 
          let min_margin = response['data']['result'][0][0]
          let margin_rate = response['data']['result'][0][1]
          let min_price = response['data']['result'][0][2]
          let shipping_cost = response['data']['result'][0][3]
          obj.setState({selectedMinMargin: min_margin, selectedMarginRate: margin_rate, selectedMinPrice: min_price, selectedShippingCost: shipping_cost})
        } else {
          console.log('getCountryOptions Failed');
        }
      })
      .catch(function (error) {
          console.log(error);
      });
    }

    saveMpidPricingInfo(){
      const obj = this;
      //console.log(userId, obj.props.JobId, statu)
      axios.post(setting_server.DB_SERVER+'/api/db/pricinginformation', {
          req_type: "save_mpid_pricing_information",
          job_id: obj.props.JobId,
          mpid: obj.state.selectedProductMpid,
          min_margin: obj.state.selectedMinMargin,
          margin_rate: obj.state.selectedMarginRate,
          min_price: obj.state.selectedMinPrice,
          min_shipping_cost: obj.state.selectedShippingCost
      })
      .then(function (resultData) {

      })
      .catch(function (error) {
          console.log(error);
      });
    }




    
    componentDidMount(){
      if (this.props.show == true){
        this.state = this.initState()
        this.getProductHistoryName(this.props.userId);
      }
    }
    

    componentWillReceiveProps(nextProps) {
      if (nextProps.show == true){
        console.log('Get List of Products')
        this.state = this.initState()
        this.getProductHistoryName(this.props.userId);
      }
    }

    initState() {
      let curUrl = window.location.href;
        return {
          programs_info: [],
          productLists: [],
          productOptionValues: [],
          productDescriptions: [],
          productOptions: [],
          selectedProductIndex: null,
          selectedProductIndex1: null,
          selectedProductIndex2: null,
          selectedProductId: -1,
          selectedProductName: null,
          selectedProductUrl: null,
          option: '',
          options: [],
        }
    }
 

  updateMystieTMP(){

      const obj = this;
      //console.log(userId, obj.props.JobId, statu)
      axios.post(setting_server.DRIVER_UTIL_SERVER+'/api/driver/', {
        req_type: "update_mysite",
        job_id: obj.props.JobId,
      })
      .then(function (response) {
         console.log(response)
         obj.getProductHistory(obj.props.userId);
      })
      .catch(function (error){
        console.log(error);
      });
    }

  getProductHistoryName(userId, statu = -1 ){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
        req_type: "get_product_history_name",
        job_id: obj.props.JobId,
      })
      .then(function (response) {
        if( Object.keys(response['data']['result']).length  == 0){
           obj.setState({productLists: [], productOptionValues: [], productDescriptions: []});
           return;
        }
        if (response['data']['success'] == true) {
          let productLists = response['data']['result'];
          console.log(productLists)
          var mpid_name_dict = {}
          for(var idx in productLists){
            var mpid = parseInt(productLists[idx][0])
            var name = productLists[idx][1]['product_name']
            if (name != null){
              mpid_name_dict[mpid] = name
            }
          }
          var res = [];
          var num = 1
          for (var key in mpid_name_dict) {
            if (mpid_name_dict.hasOwnProperty(key)) {
              res.push( {'num':num, 'mpid':parseInt(key), 'name':mpid_name_dict[key] } );
              num = num + 1
            }
          }
          console.log(res)
          obj.setState({productLists: res});
        } else {
          console.log(response)
          console.log('Failed to get pl');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }




  getProductHistoryTargetsite(selected_mpid){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
        req_type: "get_product_history_targetsite",
        job_id: obj.props.JobId,
        mpid: selected_mpid
      })
      .then(function (response) {
        if( Object.keys(response['data']['result']).length  == 0){
           obj.setState({productTargetsiteLists: [], productUploadTime: []});
           return;
        }
        if (response['data']['success'] == true) {
          let productTargetsiteLists = response['data']['result'];
          console.log(productTargetsiteLists)
          productTargetsiteLists = productTargetsiteLists.map(function(row, index){
            const targetsite = row[0]  
            return {num: index+1, targetsite:targetsite };
          })
          console.log(productTargetsiteLists)
          obj.setState({productTargetsiteLists: productTargetsiteLists});
        } else {
          console.log(response)
          console.log('Failed to get pl');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

  getProductHistoryTime(selected_targetsite){
      const obj = this;

      axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
        req_type: "get_product_history_time",
        job_id: obj.props.JobId,
        mpid: obj.state.selectedMpid,
        targetsite: selected_targetsite
      })
      .then(function (response) {
        console.log(response)
        if (response['data']['success'] == true) {
          let productUploadTime = response['data']['result'];
          console.log(productUploadTime)
          // mpid, origin_product, cast(upload_time as text), converted_product
          productUploadTime = productUploadTime.map(function(row, index){
            const mpid = row[0];
            const upload_time = row[1]; 
            return {num: index+1, mpid: mpid, upload_time: upload_time };
          });
          
          obj.setState({productUploadTime: productUploadTime});
        } else {
          console.log(response)
          //console.log('Failed to get pl');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

  getProductHistoryDetail(selected_upload_time){
      const obj = this;

      axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
        req_type: "get_product_history_detail",
        job_id: obj.props.JobId,
        mpid: obj.state.selectedMpid,
        targetsite: obj.state.selectedTargetsite,
        upload_time: selected_upload_time
      })
      .then(function (response) {
        console.log(response)
        if (response['data']['success'] == true) {
          let productDetail = response['data']['result'];

          let productOptionValues = []
          for (var key in productDetail['option_value']){
             for(var idx in productDetail['option_value'][key]){
                productOptionValues.push({oname: key, ovalue: productDetail['option_value'][key][idx]})
             }
          }
          console.log(productOptionValues)
          obj.setState({
              selectedProductName: productDetail['name'],
              selectedProductPrice: productDetail['price'],
              selectedProductMpid: productDetail['mpid'],
              selectedProductSpid: productDetail['source_site_product_id'],
              selectedProductStock: productDetail['stock'],
              selectedProductWeight: productDetail['weight'],
              selectedProductBrand: productDetail['brand'],
              selectedImageLink: productDetail['image_url'],
              selectedProductUrl: productDetail['url'],
              default_weight: productDetail['default_weight'],
              dollar2krw: productDetail['dollar2krw'],
              exchange_rate: productDetail['exchange_rate'],
              margin_rate: productDetail['margin_rate'],
              min_margin: productDetail['min_margin'],
              tariff_rate: productDetail['tariff_rate'],
              tariff_threshold: productDetail['tariff_threshold'],
              vat_rate: productDetail['vat_rate'],
              crawling_time: productDetail['crawling_time'],
              productOptionValues: productOptionValues
          });
        } else {
          console.log(response)
          //console.log('Failed to get pl');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }
           


  getCombinations(options, optionIndex, results, current) {
      var allKeys = Object.keys(options);
      var optionKey = allKeys[optionIndex];
      var vals = options[optionKey];
  
      for (var i = 0; i < vals.length; i++) {
          current[optionKey] = vals[i];
  
          if (optionIndex + 1 < allKeys.length) {
              this.getCombinations(options, optionIndex + 1, results, current);
          } else {
              // The easiest way to clone an object.
              var res = JSON.parse(JSON.stringify(current));
              results.push(res);
          }
      }
  
      return results;
  }


//create table product_option_view (id serial primary key, user_id varchar(50), job_id integer, option_name varchar(1024), option_value varchar(1024), product_id varchar(1024), price integer, list_price integer, stock integer, msg text);
  getProductOptionsOLD(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/producoptions', {
        req_type: "get_product_options",
        user_id: obj.props.userId,
        job_id: obj.props.JobId,
        pid: parseInt(obj.state.selectedProductPid)
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          let productOptions = response['data']['result'];

          let productOptionsCombination = {}
          productOptions = productOptions.map(function(row, index){
            const id = row[0];
            const oname = row[1];
            const ovalue = row[2];
            const pid = row[0];
            const list_price = row[3];
            const price = row[4];
            const stock = row[5];
            const stock_status = row[6] == 'None'? '':row[6];
            const msg = row[7] == 'None'? '':row[7];
            if( ovalue in  productOptionsCombination){
              productOptionsCombination[ovalue] = []
              productOptionsCombination[ovalue].push(ovalue)
            }
            else{
              productOptionsCombination[ovalue].push(ovalue)
            }
            return {num: index+1, id: id, oname: oname, ovalue: ovalue, pid: pid, price:price, list_price:list_price, stock:stock, stock_status: stock_status, msg: msg};
          });

          productOptions = productOptions.map(function(row, index){
            const id = row[0];
            const oname = row[1];
            const ovalue = row[2];
            const pid = row[0];
            const list_price = row[3];
            const price = row[4];
            const stock = row[5];
            const stock_status = row[6] == 'None'? '':row[6];
            const msg = row[7] == 'None'? '':row[7];
            if( ovalue in  productOptionsCombination){
              productOptionsCombination[ovalue] = []
              productOptionsCombination[ovalue].push(ovalue)
            }
            else{
              productOptionsCombination[ovalue].push(ovalue)
            }
            return {num: index+1, id: id, oname: oname, ovalue: ovalue, pid: pid, price:price, list_price:list_price, stock:stock, stock_status: stock_status, msg: msg};
          });
 
          obj.setState({productOptions: productOptions});
        
          var results  = obj.getCombinations(productOptionsCombination, 0, [], {});
          var productOptionsValueCombination = []
          for(let idx in results){
            var string = ""
          	for(let key in results[idx]){
              console.log(key)
            	string += results[idx][key] + " & "
          	}
            productOptionsValueCombination.push(string.slice(0,-3))
          }
         

          let options_tmp = new Set();
          let options =  new Set(productOptionsValueCombination
              .map(function(row, index){ 
               const option_combi_value = row[0];
               //console.log(option_name)
               return (<option value={option_combi_value}>{option_combi_value}</option>)
          }));

          obj.setState({
            options: options,
            option : Array.from(options_tmp)[0]
          });
          obj.setState({productOptions: productOptions});
          //console.log(obj.state)
          console.log(productOptions) 
          let productOptionValues = productOptions
               .map(function(row,idx){
                if (Array.from(options_tmp)[0] == row['oname']){
                  return {num: idx+1, id:row['id'], oname: row['oname'], ovalue: row['ovalue'], pid: row['pid'], price:row['price'], list_price:row['list_price'], stock:row['stock'], stock_status:row['stock_status'], msg:row['msg']};
                }
          })
          let processedOptionValues = []
          for (let val of productOptionValues) {
             //console.log(val)
             //console.log(typeof(val))
             if (val != undefined){
               processedOptionValues.push(val)
             }
          }
          //console.log(processedOptionValues)
          obj.setState({productOptionValues: processedOptionValues}); 
          //obj.setState({productOptionsValues: productOptionsValues});
        } else {
          console.log(response)
          console.log('Failed to get pl');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }


//create table product_option_view (id serial primary key, user_id varchar(50), job_id integer, option_name varchar(1024), option_value varchar(1024), product_id varchar(1024), price integer, list_price integer, stock integer, msg text);
  getProductOptions(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/producoptions', {
        req_type: "get_product_options",
        user_id: obj.props.userId,
        job_id: obj.props.JobId,
        pid: parseInt(obj.state.selectedProductPid)
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          console.log(response)
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

 
          console.log(productOptionValues) 
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
 


    loadUserProgram(nextProps) {
        var obj = this;
        axios.post(setting_server.DB_SERVER+'/api/db/userprogramtemp', {
            req_type: "get_user_program",
            project_id: nextProps.selectedProjectId
        })
        .then(function (resultData){
            obj.setState({
                programs_info: resultData["data"]['output']
            })
        })
        .catch(function (error){
        });
    }

    closeModal(){
        this.props.setModalShow(false)
    }

    render() {
        return (
            <Modal
                {...this.props}
                size='xl'
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={ () => {
                    this.props.setModalShow(false);
                }}
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" style={{width:'100%'}}>
                  <img
                    src={productIcon}
                    width="30"
                    height="30"
                    style={{
                      cursor: "pointer"
                    }}
                  />
                    <label style={{marginLeft:'1%'}}>
                    History of uploaded products

                    </label>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Page.Card 
                title={"Products"}
              >
                <ReactTable
                  data = {this.state.productLists}
                  getTdProps={(state, rowInfo, column, instance) => {
                    if(rowInfo){
                      if(this.state.selectedProductIndex !== null){ // When you click a row not at first.
                        return {
                          onClick: (e) => {
                            console.log(rowInfo.original)
                            this.setState({
                              selectedProductIndex: rowInfo.index,
                              selectedMpid: rowInfo.original['mpid'],
                              productTargetsiteLists: [],
                              productUploadTime: [],
                              selectedProductIndex1: null,
                              selectedProductIndex2: null,
                              selectedProductName: '', 
                              selectedProductPrice:  '',
                              selectedProductMpid: '',
                              selectedProductSpid: '',
                              selectedProductSprice: '',
                              selectedProductStock: '', 
                              selectedProductManufacturer: '', 
                              selectedImageLink: '', 
                              selectedProductUrl: '', 
                              default_weight: '', 
                              dollar2krw: '', 
                              exchange_rate: '',
                              margin_rate: '',
                              min_margin: '',
                              tariff_rate: '',
                              tariff_threshold: '', 
                              vat_rate: '',
                              crawling_time: '', 
                              productOptionValues:[]
                            }, () => {console.log('update!'); console.log(this.state.selectedProductIndex); console.log(this.state.selectedMpid); this.getProductHistoryTargetsite(this.state.selectedMpid)});
                          },
                          style: {
                            background: rowInfo.index === this.state.selectedProductIndex ? '#00ACFF' : null
                          }
                        }
                      }
                      else { // When you click a row at first.
                        return {
                          onClick: (e) => {
                            console.log(rowInfo.original)
                            this.setState({
                              selectedProductIndex: rowInfo.index,
                              selectedMpid: rowInfo.original['mpid'],
                              productTargetsiteLists: [],
                              productUploadTime: [],
                              selectedProductIndex1: null,
                              selectedProductIndex2: null,
                              selectedProductName: '', 
                              selectedProductPrice:  '',
                              selectedProductMpid: '',
                              selectedProductSpid: '',
                              selectedProductSprice: '',
                              selectedProductStock: '', 
                              selectedProductManufacturer: '', 
                              selectedImageLink: '', 
                              selectedProductUrl: '', 
                              default_weight: '', 
                              dollar2krw: '', 
                              exchange_rate: '',
                              margin_rate: '',
                              min_margin: '',
                              tariff_rate: '',
                              tariff_threshold: '', 
                              vat_rate: '',
                              crawling_time: '', 
                              productOptionValues:[]

                            }, () => {console.log('update!'); console.log(this.state.selectedProductIndex); console.log(this.state.selectedMpid); this.getProductHistoryTargetsite(this.state.selectedMpid)});
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
                      Header: "Mpid",
                      resizable: false,
                      accessor: 'mpid',
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
                      Header: "Product",
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
                    }
                  ]}
                  minRows={5}
                  showPagination ={true}
                  bordered = {false} 
                  style={{
                    height: "250px"
                  }}
                  className="-striped -highlight"
                />

              <div class='row' style ={{marginTop:'1.5%'}}>
                <div class='col-sm-6'>
                  <ReactTable
                    data = {this.state.productTargetsiteLists}
                    getTdProps={(state, rowInfo, column, instance) => {
                      if(rowInfo){
                        if(this.state.selectedProductIndex1 !== null){ // When you click a row not at first.
                          return {
                            onClick: (e) => {
                              console.log(rowInfo.original['image_url'])
                              this.setState({
                                selectedProductIndex1: rowInfo.index,
                                selectedTargetsite: rowInfo.original['targetsite'],
                                productUploadTime: [],
                                selectedProductIndex2: null,
                                selectedProductName: '', 
                                selectedProductPrice:  '',
                                selectedProductMpid: '',
                                selectedProductSpid: '',
                                selectedProductSprice: '',
                                selectedProductStock: '', 
                                selectedProductManufacturer: '', 
                                selectedImageLink: '', 
                                selectedProductUrl: '', 
                                default_weight: '', 
                                dollar2krw: '', 
                                exchange_rate: '',
                                margin_rate: '',
                                min_margin: '',
                                tariff_rate: '',
                                tariff_threshold: '', 
                                vat_rate: '',
                                crawling_time: '', 
                                productOptionValues:[]
                              }, () => {console.log('update!'); console.log(this.state.selectedProductIndex1); console.log(this.state.selectedTargetsite); this.getProductHistoryTime(this.state.selectedTargetsite)});
                            },
                            style: {
                              background: rowInfo.index === this.state.selectedProductIndex1 ? '#00ACFF' : null
                            }
                          }
                        }
                        else { // When you click a row at first.
                          return {
                            onClick: (e) => {
                              this.setState({
                                selectedProductIndex1: rowInfo.index,
                                selectedTargetsite: rowInfo.original['targetsite'],
                                productUploadTime: [],
                                selectedProductIndex2: null,
                                selectedProductName: '', 
                                selectedProductPrice:  '',
                                selectedProductMpid: '',
                                selectedProductSpid: '',
                                selectedProductSprice: '',
                                selectedProductStock: '', 
                                selectedProductManufacturer: '', 
                                selectedImageLink: '', 
                                selectedProductUrl: '', 
                                default_weight: '', 
                                dollar2krw: '', 
                                exchange_rate: '',
                                margin_rate: '',
                                min_margin: '',
                                tariff_rate: '',
                                tariff_threshold: '', 
                                vat_rate: '',
                                crawling_time: '', 
                                productOptionValues:[]

                              }, () => {console.log('update!'); console.log(this.state.selectedProductIndex1); console.log(this.state.selectedTargetsite); this.getProductHistoryTime(this.state.selectedTargetsite)});
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
                        Header: "Target Site",
                        resizable: false,
                        sortable: false,
                        accessor: "targetsite",
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
                    minRows={4}
                    bordered = {false} 
                    showPagination ={false}
                    style={{
                      height: "150px",
                      width:'100%'
                    }}
                    className="-striped -highlight"
                  />
                </div>
                <div class='col-sm-6'>
                  <ReactTable
                    data = {this.state.productUploadTime}
                    getTdProps={(state, rowInfo, column, instance) => {
                      if(rowInfo){
                        if(this.state.selectedProductIndex2 !== null){ // When you click a row not at first.
                          return {
                            onClick: (e) => {
                              console.log(rowInfo.original['image_url'])
                              this.setState({
                                selectedProductIndex2: rowInfo.index,
                                selectedUploadTime: rowInfo.original['upload_time'],
                                selectedProductName: '', 
                                selectedProductPrice:  '',
                                selectedProductCurrency: '',
                                selectedProductMpid: '',
                                selectedProductSpid: '',
                                selectedProductSprice: '',
                                selectedProductStock: '', 
                                selectedProductManufacturer: '', 
                                selectedImageLink: '', 
                                selectedProductUrl: '', 
                                default_weight: '', 
                                dollar2krw: '', 
                                exchange_rate: '',
                                margin_rate: '',
                                min_margin: '',
                                tariff_rate: '',
                                tariff_threshold: '', 
                                vat_rate: '',
                                crawling_time: '', 
                                productOptionValues:[]
                              },() => {console.log(this.state.selectedUploadTime);this.getProductHistoryDetail(this.state.selectedUploadTime)});
                            },
                            style: {
                              background: rowInfo.index === this.state.selectedProductIndex2 ? '#00ACFF' : null
                            }
                          }
                        }
                        else { // When you click a row at first.
                          return {
                            onClick: (e) => {
                              //console.log(rowInfo.original['image_url'])
                              this.setState({
                                selectedProductIndex2: rowInfo.index,
                                selectedUploadTime: rowInfo.original['upload_time'],
                                selectedProductName: '', 
                                selectedProductPrice:  '',
                                selectedProductCurrency: '',
                                selectedProductMpid: '',
                                selectedProductSpid: '',
                                selectedProductSprice: '',
                                selectedProductSku:  '',
                                selectedProductStock: '', 
                                selectedProductManufacturer: '', 
                                selectedImageLink: '', 
                                selectedProductUrl: '', 
                                default_weight: '', 
                                dollar2krw: '', 
                                exchange_rate: '',
                                margin_rate: '',
                                min_margin: '',
                                tariff_rate: '',
                                tariff_threshold: '', 
                                vat_rate: '',
                                crawling_time: '', 
                                productOptionValues:[]
                              },() => {console.log(this.state.selectedUploadTime);this.getProductHistoryDetail(this.state.selectedUploadTime)});
                            }
                          }
                        }
                      }
                      else{
                        if(this.state.selectedProductIndex2 !== null){ // When you click a row not at first.
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
                        Header: "Upload time",
                        resizable: false,
                        sortable: false,
                        accessor: "upload_time",
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
                    minRows={4}
                    bordered = {false} 
                    showPagination ={false}
                    style={{
                      height: "150px",
                      width:'100%'
                    }}
                    className="-striped -highlight"
                  />
                </div>
              </div>
              <div style={{borderBottom: '1px solid rgba(0, 0, 0, 0.09)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)', marginRight:'-20px', marginLeft:'-20px', marginTop:'30px'}}>
              </div>
              <div style={{marginTop:'30px'}}>
                 <div class='row'>
                   <div class='col-sm-6'>


                     <div class='row' style={{width:'100%'}}>                      
                       <label style={{marginTop:'8px', marginLeft: '15px', width:'25%'}}> Product name :</label>
                       <input readonly='readonly' name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.selectedProductName}/>
                     </div>

                     <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                       <label style={{marginTop:'8px', marginLeft: '15px', width:'25%'}}> URL :</label>
                       <input readonly='readonly' name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.selectedProductUrl}/>
                     </div>

                     <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                       <label style={{marginTop:'8px', marginLeft: '15px', width:'25%'}}> Crawling date :</label>
                       <input readonly='readonly' name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.crawling_time}/>
                     </div>
                     <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                       <label style={{marginTop:'8px', marginLeft: '15px',width:'25%'}}> Image link :</label>
                         <OverlayTrigger
                           placement="right"
                           delay={{ show: 250, hide: 400 }}
                           overlay={
                             <Tooltip>
                               <Image src={this.state.selectedImageLink || ''} rounded />
                             </Tooltip>
                           }
                         >
                         <input readonly='readonly'  name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.selectedImageLink}/>
                         </OverlayTrigger> 
                     </div>

                     <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                       <label style={{marginTop:'8px', marginLeft: '15px', width:'25%'}}> My Product ID :</label>
                       <input  readonly='readonly' name="name" class="form-control" style={{ width:'20%'}} value={this.state.selectedProductMpid}/>
                       <label style={{marginTop:'8px', marginLeft:'4%',float:'right', width:'26%'}}> Product ID:</label>
                       <input readonly='readonly'  name="name" class="form-control" style={{float:'right', width:'20%'}} value={this.state.selectedProductSpid}/>
                     </div>

                     <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                       <label style={{marginTop:'8px', marginLeft: '15px', width:'25%'}}> Brand :</label>
                       <input readonly='readonly'  name="name" class="form-control" style={{width:'20%'}} value={this.state.selectedProductBrand}/>
                       <label style={{marginTop:'8px',float:'right', width:'26%', marginLeft:'4%'}}> Stock :</label>
                       <input readonly='readonly'  name="name" class="form-control" style={{float:'right', width:'20%'}} value={this.state.selectedProductStock}/>
                     </div>

                     <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                       <label style={{marginTop:'8px', marginLeft: '15px', width:'25%'}}> Price :</label>
                       <input readonly='readonly'  name="name" class="form-control" style={{width:'20%'}}value={this.state.selectedProductPrice}/>
                       <label style={{marginTop:'8px', float:'right', width:'26%', marginLeft:'4%'}}> Currency :</label>
                       <input readonly='readonly'  name="name" class="form-control" style={{float:'right', width:'20%'}} value={this.state.selectedProductCurrency}/>
                     </div>

                     <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                       <label style={{marginTop:'8px', marginLeft: '15px', width:'25%'}}> Weight :</label>
                       <input readonly='readonly'  name="name" class="form-control" style={{width:'20%'}}value={this.state.selectedProductWeight}/>
                       <label style={{marginTop:'8px', float:'right', width:'26%', marginLeft:'4%'}}> Manufacturer :</label>
                       <input readonly='readonly'  name="name" class="form-control" style={{float:'right', width:'20%'}} value={this.state.selectedProductBrand}/>
                     </div>

                     


                   </div>
                   <div class='col-sm-6'>
                        
                     <div class ='row' style={{marginLeft:'0.6%'}}>

                       <div class = 'row' style={{width:'100%'}}>
                         <ReactTable
                           data = {this.state.productOptionValues}
                           getTdProps={(state, rowInfo, column, instance) => {
                             if(rowInfo){
                               if(this.state.selectedProductIndex3 !== null){ // When you click a row not at first.
                                 return {
                                   onClick: (e) => {
                                     this.setState({
                                       selectedProductIndex3: rowInfo.index,
                                     }, () => {console.log('update!'); console.log(this.state.selectedProductIndex3)});
                                   },
                                   style: {
                                     background: rowInfo.index === this.state.selectedProductIndex3 ? '#00ACFF' : null
                                   }
                                 }
                               }
                               else { // When you click a row at first.
                                 return {
                                   onClick: (e) => {
                                     this.setState({
                                       selectedProductIndex3: rowInfo.index,
                                     }, () => {console.log('update!'); console.log(this.state.selectedProductIndex3)});
                                   }
                                 }
                               }
                             }
                             else{
                               if(this.state.selectedProductIndex3 !== null){ // When you click a row not at first.
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
                               Header: "Option Name",
                               resizable: false,
                               accessor: "oname",
                               width:250,
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
                               Header: "Option Value",
                               resizable: false,
                               accessor: "ovalue",
                               width:250,
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
                             height: "180px"
                           }}
                           className="-striped -highlight"
                         />
                       </div>
                     </div>

                     <div class = 'row' style ={{marginTop:'1.5%'}}>
                       <label style={{marginTop:'8px', width:'30%'}}> Dollar to krw :</label>
                       <input readonly='readonly' name="name" type='number' class="form-control"  style={{width:"18%", float: 'right'}} value= {this.state.dollar2krw} onChange={e => this.onTodoChange('dollar2krw',e.target.value)}/>
                       <label style={{marginTop:'8px', marginLeft: '3%', width:'25%'}}> Exchange Rate :</label>
                       <input readonly='readonly' name="name" type='number' class="form-control" style={{ width:"19%", float: 'right'}} value= {this.state.exchange_rate} onChange={e => this.onTodoChange('exchange_rate',e.target.value)}/>
                     </div>
                     <div class = 'row'>
                       <label style={{marginTop:'8px', width:'30%'}}> Margin Rate :</label>
                       <input readonly='readonly' name="name" type='number' class="form-control" style={{ width:"18%", float: 'right'}} value= {this.state.margin_rate} onChange={e => this.onTodoChange('margin_rate',e.target.value)}/>

                       <label style={{marginTop:'8px', marginLeft: '3%', width:'25%'}}> Min Margin :</label>
                       <input readonly='readonly' name="name" type='number' class="form-control" style={{width:"19%", float: 'right'}} value= {this.state.min_margin} onChange={e => this.onTodoChange('min_margin',e.target.value)}/>
                     </div>

                     <div class = 'row'>
                       <label style={{marginTop:'8px', width:'30%'}}> Tariff Rate :</label>
                       <input readonly='readonly' name="name" type='number' class="form-control" style={{ width:"18%", float: 'right'}} value= {this.state.tariff_rate} onChange={e => this.onTodoChange('tariff_rate',e.target.value)}/>

                       <label style={{marginTop:'8px', marginLeft: '3%', width:'25%'}}> Tariff Threshold :</label>
                       <input readonly='readonly' name="name" type='number' class="form-control" style={{width:"19%", float: 'right'}} value= {this.state.tariff_threshold} onChange={e => this.onTodoChange('tariff_threshold',e.target.value)}/>
                     </div>

                     <div class = 'row'>
                       <label style={{marginTop:'8px', width:'30%'}}> Vat Rate :</label>
                       <input readonly='readonly' name="name" type='number' class="form-control" style={{ width:"18%", float: 'right'}} value= {this.state.vat_rate} onChange={e => this.onTodoChange('vat_rate',e.target.value)}/>

                       <label style={{marginTop:'8px', marginLeft: '3%', width:'25%'}}> Default Weight :</label>
                       <input readonly='readonly' name="name" type='number' class="form-control" style={{width:"19%", float: 'right'}} value= {this.state.default_weight} onChange={e => this.onTodoChange('default_weight',e.target.value)}/>
                     </div>

                   </div>
                   
                 </div>
               </div>
              </Page.Card>
            </Modal.Body>
            </Modal>
        );
    }
}
export default HistoryModal;
