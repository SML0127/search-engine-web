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
//import { Checkbox } from 'pretty-checkbox-react';
//import 'pretty-checkbox';
//import { Checkbox1 } from '@material-ui/core';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Image from 'react-bootstrap/Image'
import setting_server from '../setting_server';


class PIModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
        this.getSelectedCategory = this.getSelectedCategory.bind(this)
        this.getProductList = this.getProductList.bind(this)
        this.getProductDescription = this.getProductDescription.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.onBoxChange = this.onBoxChange.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.checkOneBox = this.checkOneBox.bind(this);
        this.updateOption = this.updateOption.bind(this)
        this.getMpid = this.getMpid.bind(this)
    }

    getMpid1(){
       for(let val of this.state.productLists){
          console.log(val['mpid'], val['boxChecked'])
       }
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



    getMpid(){
      let mpid_list = []
      for(let val of this.state.productLists){
         if (val['boxChecked'] == true){ 
            mpid_list.push(val['mpid'])
         }
      }
      console.log(mpid_list)
      const obj = this;
      //console.log(userId, obj.props.JobId, statu)
      axios.post(setting_server.DRIVER_UTIL_SERVER+'/api/driver/', {
//          req_type: "run_transformation_to_mysite",
          req_type:"upload_targetsite",
          job_id: obj.props.JobId,
          mpids : mpid_list
      })
      .then(function (resultData) {

      })
      .catch(function (error) {
          console.log(error);
      });
    }


    updateOption(event) {
      console.log(event.target.value)
      this.setState({option: event.target.value},()=> {
          let selectedOption = this.state.option
          let productOptionValues = this.state.productOptions
               .map(function(row,idx){
                if (selectedOption == row['oname']){
                  //console.log(row)
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
          this.setState({productOptionValues: processedOptionValues});
      });
    }
    
    checkOneBox(idx){
      this.state.productLists[idx]['boxChecked'] = !this.state.productLists[idx]['boxChecked'];
    }

    checkAll(){
      if(this.state.isAllChecked){
        for (let i = 0; i < this.state.productLists.length; i++) {
          this.state.productLists[i]['boxChecked'] = false;
        }
      }
      else{
        for (let i = 0; i < this.state.productLists.length; i++) {
          this.state.productLists[i]['boxChecked'] = true;
        }
      }
      this.setState({isAllChecked: !this.state.isAllChecked })
    }
    onBoxChange(e) {
      console.log(e.target)
      this.setState({ checked1: !this.state.checked1 });
       
    }
    handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState({
        [name]: value
      });
    }

    componentDidMount(){
       //console.log(this.props)
    }
    
    getSelectedCategory(selected_category){
        this.setState({selected_category: selected_category})
    }

    componentWillReceiveProps(nextProps) {
      this.getProductList(this.props.userId);
      //this.loadUserProgram(nextProps);
    }

    initState() {
      let curUrl = window.location.href;
        return {
          programs_info: [],
          productLists: [],
          productOptionValues: [],
          productDescriptions: [],
          isAllChecked: false,
          productOptions: [],
          isChecked: '',
          checked1: false,
          disabled: false,
          isBoxChecked:false,
          selectedProductIndex: 0,
          selectedProductId: -1,
          selectedProductName: null,
          selectedProductUrl: null,
          minMargin: 15000,
          minSellingPrice : 120000,
          shippingCost: 30000,
          marginRate:0.2,
          option: '',
          options: [],
        }
    }
 
  restoreMystieTMP(){
      //console.log('get product list')
      const obj = this;
      //console.log(userId, obj.props.JobId, statu)
      axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
        req_type: "restore_mysite",
        job_id: obj.props.JobId,
      })
      .then(function (response) {
         console.log(response)
         obj.getProductList(obj.props.userId);
      })
      .catch(function (error){
        console.log(error);
      });
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
         obj.getProductList(obj.props.userId);
      })
      .catch(function (error){
        console.log(error);
      });
    }


//create table products (id serial primary key, user_id varchar(50),job_id integer, name varchar(1024), product_id varchar(1024), my_product_id varchar(1024), product_url varchar(1024), brand varchar(1024), sku  varchar(1024), price integer, list_price integer, origin  varchar(1024), manufacturer  varchar(1024), status integer);
  getProductList(userId, statu = -1 ){
      //console.log('get product list')
      const obj = this;
      //console.log(userId, obj.props.JobId, statu)
      axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
        req_type: "get_product_list",
        user_id: userId,
        job_id: obj.props.JobId,
        statu: statu
      })
      .then(function (response) {
        if( Object.keys(response['data']['result']).length  == 0){
           obj.setState({productLists: [], productOptionValues: [], productDescriptions: []});
           return;
        }
        console.log("update product list")
        if (response['data']['success'] == true) {
          let productLists = response['data']['result'];
          productLists = productLists.map(function(row, index){
            const id = row[0] == 'None'? '':row[0];
            const name = row[1] == 'None'? '':row[1];
            const pid = row[2] == 'None'? '':String(row[2]).padStart(6, '0');
            const mpid = row[2] == 'None'? '':String(row[2]).padStart(6, '0');
            const purl = row[3] == 'None'? '':row[3];
            const brand = '';
            const sku = row[4] == 'None'? '':row[4];
            const price = row[5];
            const list_price = row[6];
            const origin = row[7] == 'None'? '':row[7];
            const statu = row[8] == 'None'? '':row[8];
            const manufacturer = row[9] == 'None'? '':row[9];
            const image_url = row[10] == 'None'? '':row[10];
            return {num: index+1, id:id, name:name, pid:pid, mpid:mpid, purl:purl, brand:brand, sku:sku, price:price, list_price:list_price, origin: origin, manufacturer: manufacturer, statu:statu, image_url:image_url, boxChecked: false, min_margin: 0, margin_rate: 0, min_price: 0, shipping_cost: 0};
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

  getProductDescription(){
      const obj = this;

      axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
        req_type: "get_product_description",
        user_id: obj.props.userId,
        job_id: obj.props.JobId,
        mpid: obj.state.selectedProductMpid
      })
      .then(function (response) {
        console.log(response)
        if (response['data']['success'] == true) {
          let productDescriptions = response['data']['result'];
          let selectedProductSpid = ''
          productDescriptions = productDescriptions.map(function(row, index){
            const key = row[0];
            const value = row[1]; 
            if(key == 'spid'){
              selectedProductSpid = value
            }
            return {num: index+1, key: key, value: value };
          });
          
          obj.setState({productDescriptions: productDescriptions, selectedProductSpid: selectedProductSpid});
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
          let productOptions = response['data']['result'];

          let productOptionsCombination = {}
          let option_stock = 999
          let option_price = 0
          let option_stock_status = ""
          let option_msg = ""
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
            option_stock = stock
            option_price = price
            option_stock_status = stock_status
            option_msg = msg
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
         


          let productOptionValues = productOptionsValueCombination
               .map(function(row,idx){
                return {num: idx+1, name:row, stock: option_stock, price: option_price, stock_status: option_stock_status, msg: option_msg}
          })

          //console.log(processedOptionValues)
          obj.setState({productOptionValues: productOptionValues}); 
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
                    Product Information

                    </label>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Page.Card 
                title={"Products"}
              >
                 <Button 
                   class="btn btn-outline-dark"
                   type="button"
                   style={{width:'120px'}}
                   onClick = {(e) => this.getProductList(this.props.userId, -1)}
                 >
                 All
                 </Button>
                 <Button 
                   class="btn btn-outline-dark"
                   type="button"
                   style={{width:'120px'}}
                   onClick = {(e) => this.getProductList(this.props.userId, 2)}
                 >
                 New
                 </Button>
                 <Button 
                   class="btn btn-outline-dark"
                   type="button"
                   style={{width:'120px'}}
                   onClick = {(e) => this.getProductList(this.props.userId, 3)}
                 >
                 Deleted
                 </Button>
                 <Button 
                   class="btn btn-outline-dark"
                   type="button"
                   style={{width:'120px'}}
                   onClick = {(e) => this.getProductList(this.props.userId, 1)}
                 >
                 Updated
                 </Button>
                 <Button 
                   class="btn btn-outline-dark"
                   type="button"
                   style={{width:'120px'}}
                   onClick = {(e) => this.getProductList(this.props.userId, 0)}
                 >
                 Up-to-date
                 </Button>
                <ReactTable
                  data = {this.state.productLists}
                  getTdProps={(state, rowInfo, column, instance) => {
                    if(rowInfo){
                      if(this.state.selectedProductIndex !== null){ // When you click a row not at first.
                        return {
                          onClick: (e) => {
                            //console.log(rowInfo.original['image_url'])
                            this.setState({
                              selectedProductIndex: rowInfo.index,
                              selectedProductId: rowInfo.original['id'] != null ? rowInfo.original['id'] : '' ,
                              selectedProductName: rowInfo.original['name'] != null ? rowInfo.original['name'] : '',
                              selectedProductUrl: rowInfo.original['purl'] != null ? rowInfo.original['purl'] : '',
                              selectedProductPid: rowInfo.original['pid'] != null ? rowInfo.original['pid'] : '',
                              selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                              selectedProductSku: rowInfo.original['sku'] != null ? rowInfo.original['sku'] : '',
                              selectedProductBrand: rowInfo.original['brand'] != null ? rowInfo.original['brand'] : '',
                              selectedProductPrice: rowInfo.original['price'] != null ? rowInfo.original['price'] : '',
                              selectedProductSprice: rowInfo.original['list_price'] != null ? rowInfo.original['list_price'] : '',
                              selectedProductOrigin: rowInfo.original['origin'] != null ? rowInfo.original['origin'] : '',
                              selectedProductManufacturer: rowInfo.original['manufacturer'] != null ? rowInfo.original['manufacturer'] : '',
                              selectedImageLink: rowInfo.original['image_url'] != null ? rowInfo.original['image_url'] : '',
                              selectedProductStatu: rowInfo.original['statu'] != null ? rowInfo.original['status'] : '',
                              selectedMinMargin: rowInfo.original['min_margin'] != null ? rowInfo.original['min_margin'] : '',
                              selectedMarginRate: rowInfo.original['margin_rate'] != null ? rowInfo.original['margin_rate'] : '',
                              selectedMinPrice: rowInfo.original['min_price'] != null ? rowInfo.original['min_price'] : '',
                              selectedShippingCost: rowInfo.original['shipping_cost'] != null ? rowInfo.original['shipping_cost'] : ''
                            },() => {console.log(this.state.selectedProductId);this.getProductDescription(); this.getProductOptions(); this.getMpidPricingInfo(); console.log(rowInfo.original['boxChecked'])});
                          },
                          style: {
                            background: rowInfo.index === this.state.selectedProductIndex ? '#00ACFF' : null
                          }
                        }
                      }
                      else { // When you click a row at first.
                        return {
                          onClick: (e) => {
                            //console.log(rowInfo.original['image_url'])
                            this.setState({
                              selectedProductIndex: rowInfo.index,
                              selectedProductId: rowInfo.original['id'] != null ? rowInfo.original['id'] : '' ,
                              selectedProductName: rowInfo.original['name'] != null ? rowInfo.original['name'] : '',
                              selectedProductUrl: rowInfo.original['purl'] != null ? rowInfo.original['purl'] : '',
                              selectedProductPid: rowInfo.original['pid'] != null ? rowInfo.original['pid'] : '',
                              selectedProductMpid: rowInfo.original['mpid'] != null ? rowInfo.original['mpid'] : '',
                              selectedProductSku: rowInfo.original['sku'] != null ? rowInfo.original['sku'] : '',
                              selectedProductBrand: rowInfo.original['brand'] != null ? rowInfo.original['brand'] : '',
                              selectedProductPrice: rowInfo.original['price'] != null ? rowInfo.original['price'] : '',
                              selectedProductSprice: rowInfo.original['list_price'] != null ? rowInfo.original['list_price'] : '',
                              selectedProductOrigin: rowInfo.original['origin'] != null ? rowInfo.original['origin'] : '',
                              selectedProductManufacturer: rowInfo.original['manufacturer'] != null ? rowInfo.original['manufacturer'] : '',
                              selectedImageLink: rowInfo.original['image_url'] != null ? rowInfo.original['image_url'] : '',
                              selectedProductStatu: rowInfo.original['statu'] != null ? rowInfo.original['status'] : '',
                              selectedMinMargin: rowInfo.original['min_margin'] != null ? rowInfo.original['min_margin'] : '',
                              selectedMarginRate: rowInfo.original['margin_rate'] != null ? rowInfo.original['margin_rate'] : '',
                              selectedMinPrice: rowInfo.original['min_price'] != null ? rowInfo.original['min_price'] : '',
                              selectedShippingCost: rowInfo.original['shipping_cost'] != null ? rowInfo.original['shipping_cost'] : ''
                            }, () => {console.log('update!');this.getProductDescription(); this.getProductOptions(); this.getMpidPricingInfo(); console.log(this.state.selectedProductId)});
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
                      Header:( row ) => {
                        return (
                           <div
                             onClick={e => this.checkAll()}
                           >
                             <Checkbox
                               checked={this.state.isAllChecked}
                               disabled={this.state.disabled}
                             />
                           </div>
                        )
                      },
                      width: 50,
                      resizable: false,
                      sortable: false,
                      accessor: "boxChecked",
                      Cell: ( row ) => {
                        return (
                         <div 
                           style={{marginLeft:'27%', marginTop:'10%'}}
                           onClick={e => this.checkOneBox(row.original.num - 1)}
                         >
                           <Checkbox
                             style={{width:'100%', height:'100%'}}
                             checked={row.value}
                             disabled={this.state.disabled}
                           />
                         </div>
                        )
                      }
                    },
                    {
                      Header: "Name",
                      resizable: false,
                      sortable: false,
                      accessor: "name",
                      Cell: ( row ) => {
                        if (row.original.statu == 1){ // updatd
                          return (
                            <div
                              style={{
                                textAlign:"center",
                                paddingTop:"4px",
                                color:'green'
                              }}
                            > {row.value} </div>
                          )
                        }
                        else if(row.original.statu == 2){ // New
                          return (
                            <div
                              style={{
                                textAlign:"center",
                                paddingTop:"4px",
                                color:'blue'
                              }}
                            > {row.value} </div>
                          )
                        }
                        else if(row.original.statu == 3){ // Deleted
                          return (
                            <div
                              style={{
                                textAlign:"center",
                                paddingTop:"4px",
                                color: 'gray'
                              }}
                            > {row.value} </div>
                          )
                        }
                        else{
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
                    },
                    {
                      Header: "Product ID",
                      resizable: false,
                      sortable: false,
                      width: 150,
                      accessor: "pid",
                      Cell: ( row ) => {
                        if (row.original.statu == 1){ // updatd
                          return (
                            <div
                              style={{
                                textAlign:"center",
                                paddingTop:"4px",
                                color:'green'
                              }}
                            > {row.value} </div>
                          )
                        }
                        else if(row.original.statu == 2){ // New
                          return (
                            <div
                              style={{
                                textAlign:"center",
                                paddingTop:"4px",
                                color:'blue'
                              }}
                            > {row.value} </div>
                          )
                        }
                        else if(row.original.statu == 3){ // Deleted
                          return (
                            <div
                              style={{
                                textAlign:"center",
                                paddingTop:"4px",
                                color: 'gray'
                              }}
                            > {row.value} </div>
                          )
                        }
                        else{
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
                    },
                    {
                      Header: "URL",
                      resizable: false,
                      sortable: false,
                      accessor: "purl",
                      Cell: ( row ) => {
                        if (row.original.statu == 1){ // updatd
                          return (
                            <div
                              style={{
                                textAlign:"center",
                                paddingTop:"4px",
                                color:'green'
                              }}
                            > {row.value} </div>
                          )
                        }
                        else if(row.original.statu == 2){ // New
                          return (
                            <div
                              style={{
                                textAlign:"center",
                                paddingTop:"4px",
                                color:'blue'
                              }}
                            > {row.value} </div>
                          )
                        }
                        else if(row.original.statu == 3){ // Deleted
                          return (
                            <div
                              style={{
                                textAlign:"center",
                                paddingTop:"4px",
                                color: 'gray'
                              }}
                            > {row.value} </div>
                          )
                        }
                        else{
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
                    },
                  ]}
                  minRows={5}
                  showPagination ={true}
                  bordered = {false} 
                  style={{
                    height: "250px"
                  }}
                  className="-striped -highlight"
                />
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
                      
                       <label style={{marginTop:'8px', marginLeft: '15px',width:'25%'}}> URL :</label>
                       <input readonly='readonly' name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.selectedProductUrl}/>
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
                       <label style={{marginTop:'8px',float:'right', width:'26%', marginLeft:'4%'}}> SKU :</label>
                       <input readonly='readonly'  name="name" class="form-control" style={{float:'right', width:'20%'}} value={this.state.selectedProductSku}/>
                     </div>

                     <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                       <label style={{marginTop:'8px', marginLeft: '15px', width:'25%'}}> Original price :</label>
                       <input readonly='readonly'  name="name" class="form-control" style={{width:'20%'}}value={this.state.selectedProductPrice}/>
                       <label style={{marginTop:'8px', float:'right', width:'26%', marginLeft:'4%'}}> Selling price :</label>
                       <input readonly='readonly'  name="name" class="form-control" style={{float:'right', width:'20%'}} value={this.state.selectedProductSprice}/>
                     </div>


                     <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                       <label style={{marginTop:'8px', marginLeft: '15px',width:'25%'}}> Origin :</label>
                       <input readonly='readonly'  name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.selectedProductOrigin}/>
                     </div>

                     <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                       <label style={{marginTop:'8px', marginLeft: '15px',width:'25%'}}> Manufacturer :</label>
                       <input readonly='readonly'  name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.selectedProductManufacturer}/>
                     </div>
                     <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                       <label style={{marginTop:'8px', marginLeft: '15px',width:'25%'}}> Image link:</label>
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
                     


                   </div>
                   <div class='col-sm-6'>
                        
                     <div class ='row' style={{marginLeft:'0.6%'}}>

                       <div class = 'row' style={{width:'100%'}}>
                         <ReactTable
                           data = {this.state.productOptionValues}
                           getTdProps={(state, rowInfo, column, instance) => {
                             if(rowInfo){
                               if(this.state.selectedProductIndex1 !== null){ // When you click a row not at first.
                                 return {
                                   onClick: (e) => {
                                     this.setState({
                                       selectedProductIndex1: rowInfo.index,
                                       selectedProductId: rowInfo.original['id'],
                                     });
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
                                       selectedProductId: rowInfo.original['id'],
                                     }, () => {console.log('update!'); console.log(this.state.selectedProductId)});
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
                               Header: "Option",
                               resizable: false,
                               accessor: "name",
                               Cell: ( row ) => {
                                 console.log(row)
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
                               Header: "Stock",
                               resizable: false,
                               accessor: "stock",
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
                               Header: "Price",
                               resizable: false,
                               accessor: "price",
                               Cell: ( row ) => {
                                 console.log(row)
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
                               Header: "Out of stock message",
                               resizable: false,
                               width:200,
                               accessor: "msg",
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
                       <label style={{marginTop:'8px', width:'30%'}}> Minimum margin :</label>
                       <input name="name" type='number' class="form-control"  style={{width:"18%", float: 'right'}} value= {this.state.selectedMinMargin} onChange={e => this.onTodoChange('selectedMinMargin',e.target.value)}/>
                       <label style={{marginTop:'8px', marginLeft: '3%', width:'25%'}}> Margin rate :</label>
                       <input name="name" type='number' class="form-control" style={{ width:"19%", float: 'right'}} value= {this.state.selectedMarginRate} onChange={e => this.onTodoChange('selectedMarginRate',e.target.value)}/>
                     </div>
                     <div class = 'row'>
                       <label style={{marginTop:'8px', width:'30%'}}> Minimum selling price :</label>
                       <input name="name" type='number' class="form-control" style={{ width:"18%", float: 'right'}} value= {this.state.selectedMinPrice} onChange={e => this.onTodoChange('selectedMinPrice',e.target.value)}/>

                       <label style={{marginTop:'8px', marginLeft: '3%', width:'25%'}}> Shipping cost :</label>
                       <input name="name" type='number' class="form-control" style={{width:"19%", float: 'right'}} value= {this.state.selectedShippingCost} onChange={e => this.onTodoChange('selectedShippingCost',e.target.value)}/>
                     </div>


                     <Button
                       class="btn btn-outline-dark"
                       type="button"
                       style={{float:'right', marginRight:'2.7%', marginTop:'2%'}}
                       onClick={() => {
                               this.getMpid()
                       }}
                     >
                     Upload
                     </Button>

                     <Button 
                       class="btn btn-outline-dark"
                       type="button"
                       style={{float:'right', marginRight:'2.7%', marginTop:'2%'}}
                       onClick={() => {
                               this.saveMpidPricingInfo()
                       }}
                     >
                     Save
                     </Button>
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

               </div>
              </Page.Card>
            </Modal.Body>
            </Modal>
        );
    }
}
export default PIModal;
