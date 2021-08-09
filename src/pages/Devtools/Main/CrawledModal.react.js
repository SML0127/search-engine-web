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


var g_var_execId = -1
class CrawledModal extends React.Component {

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
      if (this.props.show == true){
        this.state = this.initState()
        this.getProductName();
      }
    }
    

    componentWillReceiveProps(nextProps) {
      if (nextProps.show == true){
        g_var_execId = nextProps.execId;
        this.state = this.initState()
        this.getProductName();
      }
    }

    initState() {
      return {
        productLists: [],
        selectedProductIndex: null,
        selectedProductIndex1: null,
        selectedProductIndex2: null,
      }
    }


    getProductName(){
       const obj = this;
       axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
         req_type: "get_crawled_data",
         execution_id: g_var_execId,
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
             const statu = (parseInt(row[0]) == 1? "Success" : "Fail");
             
             const name = row[1].slice(1,-1)
             const node_id = row[2]
             return {num: index+1, name:name, statu:statu, node_id: node_id};
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



    getProductHistoryName(userId){
       const obj = this;
       axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
         req_type: "get_crawled_data_history",
         job_id: obj.props.JobId,
       })
       .then(function (response) {
         if( Object.keys(response['data']['result']).length  == 0){
            obj.setState({productLists: [], productOptionValues: [], productDescriptions: []});
            return;
         }
         if (response['data']['success'] == true) {
           let productLists = response['data']['result'];
           productLists = productLists.map(function(row, index){
             const mpid = row[0] 
             const url = row[1] 
             return {num: index+1, mpid: mpid, url:url};
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




     getProductHistoryTime(url){
       const obj = this;
       axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
         req_type: "get_crawled_time",
         job_id: obj.props.JobId,
         url: url
       })
       .then(function (response) {
         if (response['data']['success'] == true) {
           let productCrawledTime = response['data']['result'];
           productCrawledTime = productCrawledTime.map(function(row, index){
             const execution_id = row[0];
             const crawled_time = row[1]; 
             const node_id = row[2]; 
             if (row[3] == "Valid"){
               const invalid = ""; 
               return {num: index+1, execution_id: execution_id, crawled_time: crawled_time, node_id: node_id, invalid: invalid};
             }
             else if (row[3] == "Inalid"){
               const invalid = "Invalid page"; 
               return {num: index+1, execution_id: execution_id, crawled_time: crawled_time, node_id: node_id, invalid: invalid};
             }
             else{
               const invalid = "Fail to crawling"; 
               return {num: index+1, execution_id: execution_id, crawled_time: crawled_time, node_id: node_id, invalid: invalid};
             }
           });
           
           obj.setState({productCrawledTime: productCrawledTime});
         } else {
           console.log(response)
           //console.log('Failed to get pl');
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
        console.log(response)
        if (response['data']['success'] == true) {
          let productDetail = response['data']['result'];
          console.log(productDetail)
          var selectedProductUrl = ''
          var selectedProductDesc = ''
          var selectedProductName = ''
          var selectedProductPrice = ''
          var selectedProductStock = ''
          var selectedProductImage = ''
          var selectedProductShippingPrice = ''
          var selectedProductBrand = ''
          var selectedProductSpid = ''
          for(const val of productDetail){
            console.log(val)
            if (val[0] == 'url'){
              selectedProductUrl =  val[1]
            }
            else if (val[0] == 'name'){
              selectedProductName =  val[1]
            }
            else if (val[0] == 'description'){
              selectedProductDesc =  val[1]
            }
            else if (val[0] == 'price'){
              selectedProductPrice =  val[1]
            }
            else if (val[0] == 'stock'){
              selectedProductStock =  val[1]
            }
            else if (val[0] == 'shipping_price'){
              selectedProductShippingPrice =  val[1]
            }
            else if (val[0] == 'images'){
              selectedProductImage =  val[1][0]
            }
            else if (val[0] == 'source_site_product_id'){
              selectedProductSpid =  val[1]
            }
            //if (val[0] = '"url"'){
            //  selectedProductUrl =  val[1]
            //}
            //else if (val[0] = '"name"'){
            //  selectedProductName =  val[1]
            //}
            //else if (val[0] = '"description"'){
            //  selectedProductDesc =  val[1]
            //}
            //else if (val[0] = '"price"'){
            //  selectedProductPrice =  val[1]
            //}
            //else if (val[0] = '"stock"'){
            //  selectedProductStock =  val[1]
            //}
            //else if (val[0] = '"shipping_price"'){
            //  selectedProductShippingPrice =  val[1]
            //}
            //else if (val[0] = '"images"'){
            //  selectedProductImage =  val[1][0]
            //}
            //else if (val[0] = '"source_site_product_id"'){
            //  selectedProductSpid =  val[1]
            //}
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
            selectedProductSpid: selectedProductSpid
          })
          //obj.setState({productDetail: productDetail});
        } else {
          console.log(response)
          //console.log('Failed to get pl');
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
                            this.setState({
                              selectedProductIndex: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                            }, () => {this.getProductDetail(this.state.selectedNodeId)});
                          },
                          style: {
                            background: rowInfo.index === this.state.selectedProductIndex ? '#00ACFF' : null
                          }
                        }
                      }
                      else { // When you click a row at first.
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex: rowInfo.index,
                              selectedNodeId: rowInfo.original['node_id'],
                            }, () => {this.getProductDetail(this.state.selectedNodeId)});
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
                      Header: "Name",
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
                      Header: "status",
                      resizable: false,
                      accessor: 'statu',
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
                  showPagination ={true}
                  bordered = {false} 
                  style={{
                    height: "250px"
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
                      <input readonly='readonly'  name="name" class="form-control" style={{width:'20%'}} value={this.state.selectedBrand}/>
                      <label style={{marginTop:'8px',float:'right', width:'26%', marginLeft:'4%'}}> Stock :</label>
                      <input readonly='readonly'  name="name" class="form-control" style={{float:'right', width:'20%'}} value={this.state.selectedStock}/>
                    </div>

                    <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                      <label style={{marginTop:'8px', marginLeft: '15px', width:'25%'}}> Price :</label>
                      <input readonly='readonly'  name="name" class="form-control" style={{width:'20%'}} value={this.state.selectedProductPrice}/>
                      <label style={{marginTop:'8px', float:'right', width:'26%', marginLeft:'4%'}}> Currency :</label>
                      <input readonly='readonly'  name="name" class="form-control" style={{float:'right', width:'20%'}} value={this.state.selectedProductCurrency}/>
                    </div>


                    <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                      <label style={{marginTop:'8px', marginLeft: '15px',width:'25%'}}> Weight :</label>
                      <input readonly='readonly'  name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.selectedWeight}/>
                    </div>

                    <div class='row' style={{width:'100%', marginTop:'5px'}}>                      
                      <label style={{marginTop:'8px', marginLeft: '15px',width:'25%'}}> Manufacturer :</label>
                      <input readonly='readonly'  name="name" class="form-control" style={{width:"70%",float:'right'}} value={this.state.selectedBrand}/>
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
                defaultPageSize={1000}
                showPagination ={false}
                bordered = {false} 
                style={{
                  height: "180px"
                }}
                className="-striped -highlight"
               />
              </Page.Card>
            </Modal.Body>
            </Modal>
        );
    }
}
export default CrawledModal;
