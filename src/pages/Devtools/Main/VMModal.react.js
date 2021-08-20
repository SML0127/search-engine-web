// @flow

import ReactTable from "react-table"
import 'react-table/react-table.css'
import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import ConfigCategoryTree from '../TreeView/components/config-category-tree';
import TargetConfigCategoryTree from '../TreeView/components/vm-config-category-tree';
import jobVMIcon from './admin.png';
import {
  Form,
  Page,
  Card,
  Button,
} from "tabler-react";
import setting_server from '../setting_server';
import refreshIcon from './refresh.png';

class VMModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
        this.getSelectedCategory = this.getSelectedCategory.bind(this)
        this.getProductList = this.getProductList.bind(this)
        this.updateOptions = this.updateOptions.bind(this)
    }

    componentDidMount(){
      if (this.props.show == true){
        this.getProductList();
        this.getJobWorking();
      }
    }
    
    getSelectedCategory(selected_category){
        this.setState({selected_category: selected_category})
    }
    

    componentWillReceiveProps(nextProps) {
      if (nextProps.show == true){
        console.log('Get List of Products')
        this.getProductList();
        this.getJobWorking();
      }
      //this.loadUserProgram(nextProps);
    }

    //componentDidMount() {
    //  this.getProductList(this.props.userId);
    //  this.getJobWorking();
    //  //this.loadUserProgram(nextProps);
    //}
    reload(){
      this.getProductList();
      this.getJobWorking();
    }
    getJobWorking() {
        var obj = this;
        axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
            req_type: "load_job_working",
            job_id: obj.props.JobId
        })
        .then(function (response) {
          if (response['data']['success'] === true) {
            //crawling_working, mysite_working, targetsite_working
            let c_text = response['data']['result'][0][0]
            let m_text = response['data']['result'][0][1]
            let t_text = response['data']['result'][0][2]
            obj.setState({crawlingText: c_text, mysiteText: m_text, targetText: t_text})
          } else {
            console.log('getCountryOptions Failed');
          }
        })
        .catch(function (error) {
            console.log(error);
        });
    }




    initState() {
      let curUrl = window.location.href;
        return {
          programs_info: [],
          productLists: [],
          selectedProductIndex: null,
          selectedProductId: null,
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
    
    updateOptions(event) {
      this.setState({option: event.target.value});
    }


  getProductList(statu = -1 ){
      const obj = this;
      //console.log(userId, obj.props.JobId, statu)
      axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
        req_type: "get_product_list",
        job_id: obj.props.JobId,
        statu: statu
      })
      .then(function (response) {
        
        if( Object.keys(response['data']['result']).length  == 0){
           obj.setState({productLists: [], productOptionValues: [], productDescriptions: []});
           return;
        }
      //console.log(response)
        if (response['data']['success'] == true) {
          let productLists = response['data']['result'];
          productLists = productLists.map(function(row, index){
            // mpid, name, url, price, shpiping_price, brand, weight, shipping_weight, dimension_weight, source_site_product_id, status, image_url, num_options, num_images
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
            const dimension_weight = row[8] == 'None'? '':row[8];
            const source_site_product_id = row[9] == 'None'? '':row[9];
            const statu = row[10] == 'None'? '':row[10];
            const image_url = row[11] == 'None'? '':row[11];
            return {num: index+1, id:id, name:name, mpid:mpid, purl:purl, price:price, shpiping_price:shpiping_price, brand:brand, weight:weight, shipping_weight:shipping_weight, dimension_weight: dimension_weight, source_site_product_id: source_site_product_id, statu:statu, image_url:image_url, boxChecked: false};
          });
          obj.setState({productLists: productLists});
        } else {
          //console.log(response)
          //console.log('Failed to get pl');
        }
      })
      .catch(function (error){
        console.log("job id = ",obj.props.JobId)
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
                    src={jobVMIcon}
                    width="30"
                    height="30"
                    style={{
                      cursor: "pointer"
                    }}
                  />
                    <label style={{marginLeft:'1%'}}>
                    View Maintenance
                    </label>
                  <img
                    src={refreshIcon}
                    width="30"
                    height="30"
                    onClick={() =>
                      this.reload()
                    }
                    style = {{marginLeft:'1%'}}

                  />

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
                   onClick = {(e) => this.getProductList(-1)}
                 >
                 All
                 </Button>
                 <Button 
                   class="btn btn-outline-dark"
                   type="button"
                   style={{width:'120px'}}
                   onClick = {(e) => this.getProductList(2)}
                 >
                 New
                 </Button>
                 <Button 
                   class="btn btn-outline-dark"
                   type="button"
                   style={{width:'120px'}}
                   onClick = {(e) => this.getProductList(3)}
                 >
                 Deleted
                 </Button>
                 <Button 
                   class="btn btn-outline-dark"
                   type="button"
                   style={{width:'120px'}}
                   onClick = {(e) => this.getProductList(1)}
                 >
                 Updated
                 </Button>
                 <Button 
                   class="btn btn-outline-dark"
                   type="button"
                   style={{width:'120px'}}
                   onClick = {(e) => this.getProductList(0)}
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
                            this.setState({
                              selectedProductIndex: rowInfo.index,
                              selectedProductId: rowInfo.original['id'],
                              selectedProductName: rowInfo.original['name'],
                              selectedProductUrl: rowInfo.original['purl'],
                              selectedProductPid: rowInfo.original['pid'],
                              selectedProductMpid: rowInfo.original['mpid'],
                            });
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
                              selectedProductId: rowInfo.original['id'],
                              selectedProductName: rowInfo.original['name'],
                              selectedProductUrl: rowInfo.original['purl'],
                              selectedProductPid: rowInfo.original['pid'],
                              selectedProductMpid: rowInfo.original['mpid'],
                            }, () => {console.log('update!'); console.log(this.state.selectedProductId)});
                          }
                        }
                      }
                    }
                    else{
                      if(this.state.selectedProductIndex !== null){ // When you click a row not at first.
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex: rowInfo.index,
                              selectedProductId: rowInfo.original['id'],
                              selectedProductName: rowInfo.original['name'],
                              selectedProductUrl: rowInfo.original['purl'],
                              selectedProductPid: rowInfo.original['pid'],
                              selectedProductMpid: rowInfo.original['mpid'],
                            }, () => {console.log('update!'); console.log(this.state.selectedProductId)});
                          }
                        }
                      }
                      else { // When you click a row at first.
                        return {
                          onClick: (e) => {
                            this.setState({
                              selectedProductIndex: rowInfo.index,
                              selectedProductId: rowInfo.original['id'],
                              selectedProductName: rowInfo.original['name'],
                              selectedProductUrl: rowInfo.original['purl'],
                              selectedProductPid: rowInfo.original['pid'],
                              selectedProductMpid: rowInfo.original['mpid'],
                            }, () => {console.log('update!'); console.log(this.state.selectedProductId)});
                          }
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
                      accessor: "name",
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
                      Header: "Product ID",
                      resizable: false,
                      accessor: "mpid",
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
                      Header: "URL",
                      resizable: false,
                      accessor: "purl",
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
                  defaultPageSize={5}
                  showPagination ={true}
                  bordered = {false} 
                  style={{
                    height: "250px"
                  }}
                  className="-striped -highlight"
                />
            
              <div style={{borderBottom: '1px solid rgba(0, 0, 0, 0.09)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)', marginRight:'-20px', marginLeft:'-20px', marginTop:'30px'}}>
              </div>
              <div class='row'>
                <div class='col-sm-4' style={{borderRight: '1px solid rgba(0, 0, 0, 0.09)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)', marginBottom:'-2%'}} >
                  <div style={{height:'300px'}}>
                    <label for="name" style={{display: "flex",justifyContent: "center",alignItems: "center", fontWeight: "bold", fontSize:'18px', marginTop:'2%'}}> Crawling </label>
                    
                    <Form.Textarea style = {{width:'100%', height :'90%', maxHeight:'90%', fontSize:'13px'}} value={this.state.crawlingText}/>
                  </div>
                </div>
                <div class='col-sm-4' style={{borderRight: '1px solid rgba(0, 0, 0, 0.09)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)', marginBottom:'-2%'}} >
                  <div style={{height:'300px'}}>
                    <label for="name"  style={{display: "flex",justifyContent: "center",alignItems: "center", fontWeight: "bold", fontSize:'18px', marginTop:'2%'}}> Maintaining Products </label>
                    <Form.Textarea style = {{width:'100%', height :'90%', maxHeight:'90%', fontSize:'13px'}}  value={this.state.mysiteText}/>
                  </div>
                </div>
                <div class='col-sm-4'>
                  <div style={{height:'300px'}}>
                    <label for="name" style={{display: "flex",justifyContent: "center",alignItems: "center", fontWeight: "bold", fontSize:'18px', marginTop:'2%'}}> Transfer to Target Site </label>
                      <Form.Textarea style = {{width:'100%', height :'90%', maxHeight:'90%', fontSize:'13px'}}  value={this.state.targetText}/>
                  </div>
                </div>
              </div>
              </Page.Card>
            </Modal.Body>
            </Modal>
        );
    }
}
export default VMModal;
