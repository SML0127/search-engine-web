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


class CrawledHistoryModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
        this.getProductHistoryName = this.getProductHistoryName.bind(this)
        this.getProductHistoryTime = this.getProductHistoryTime.bind(this)
    }

    onTodoChange(key,value){
      this.setState({
        [key]: value
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
          productLists: [],
          selectedProductIndex: null,
          selectedProductIndex1: null,
          selectedProductIndex2: null,
        }
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
             return {num: index+1, execution_id: execution_id, crawled_time: crawled_time, node_id: node_id };
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
        if (response['data']['success'] == true) {
          let productDetail = response['data']['result'];
          productDetail = productDetail.map(function(row, index){
            const key = row[0] 
            if(typeof(row[1]) == 'object'){
              const value = JSON.stringify(row[1], undefined, 4) 
              return {num: index+1, key: key, value: value};
            }
            else if(typeof(row[1]) == 'array'){
              const value = row[1].toString() 
              return {num: index+1, key: key, value: value};
            }
            else{
              const value = row[1] 
              return {num: index+1, key: key, value: value};
            }
          });

          obj.setState({productDetail: productDetail});
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
                              selectedMpid: rowInfo.original['mpid'],
                              selectedUrl: rowInfo.original['url'],
                              productCrawledTime: [],
                              productDetail: []
                            }, () => {this.getProductHistoryTime(this.state.selectedUrl)});
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
                              selectedMpid: rowInfo.original['mpid'],
                              selectedUrl: rowInfo.original['url'],
                              productCrawledTime: [],
                              productDetail: []
                            }, () => {this.getProductHistoryTime(this.state.selectedUrl)});
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
                      Header: "Product(URL)",
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
              <ReactTable
                data = {this.state.productCrawledTime}
                getTdProps={(state, rowInfo, column, instance) => {
                  if(rowInfo){
                    if(this.state.selectedProductIndex2 !== null){ // When you click a row not at first.
                      return {
                        onClick: (e) => {
                          this.setState({
                            selectedProductIndex2: rowInfo.index,
                            selectedExecutionId: rowInfo.original['execution_id'],
                            selectedNodeId: rowInfo.original['node_id'],
                            productDetail: []
                          },() => {this.getProductDetail(this.state.selectedNodeId)});
                        },
                        style: {
                          background: rowInfo.index === this.state.selectedProductIndex2 ? '#00ACFF' : null
                        }
                      }
                    }
                    else { // When you click a row at first.
                      return {
                        onClick: (e) => {
                          this.setState({
                            selectedProductIndex2: rowInfo.index,
                            selectedExecutionId: rowInfo.original['execution_id'],
                            selectedNodeId: rowInfo.original['node_id'],
                            productDetail: []
                          },() => {this.getProductDetail(this.state.selectedNodeId)});
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
                    Header: "Execution id",
                    resizable: false,
                    accessor: "execution_id",
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
                    Header: "Crawled time",
                    resizable: false,
                    accessor: "crawled_time",
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
export default CrawledHistoryModal;
