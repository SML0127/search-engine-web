import React, { Component } from "react";
import Calendar from "react-calendar"
import ReactTable from "react-table"
import 'react-table/react-table.css'
import "./tree.css";
import {Button} from "tabler-react"
import axios from 'axios'
import jobConfigIcon from './job_config.png';
import RegisterTargetSiteAndPricingInfoModal from "./RegisterTargetSiteAndPricingInfoModal";
import UpdateTargetSiteAndPricingInfoModal from "./UpdateTargetSiteAndPricingInfoModal";
import { 
  Modal,
  ModalHeader,
  ModalBody,
}  from 'reactstrap';
import setting_server from '../../../setting_server';
import Checkbox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';

let gvar_selectedRegisteredTargetSiteId = null
class Tree extends Component {

   constructor(props) {
       super(props);
       this.state = this.initState();
       this.getRegisteredTargetSites = this.getRegisteredTargetSites.bind(this)
       this.checkAll = this.checkAll.bind(this);
       this.checkOneBox = this.checkOneBox.bind(this);
   }

   checkOneBox(idx, tsid){
     //this.state.registeredTargetSites[idx]['boxChecked'] = !this.state.registeredTargetSites[idx]['boxChecked'];
     console.log(tsid)
     const obj = this;
     axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
       req_type: "check_target_site",
       tjcid: tsid,
       checked: !this.state.registeredTargetSites[idx]['boxChecked']
     })
     .then(function (response) {
       if (response['data']['success'] == true) {
         obj.state.registeredTargetSites[idx]['boxChecked'] = !obj.state.registeredTargetSites[idx]['boxChecked'];
         obj.getRegisteredTargetSites()
       } else {
         console.log('getRegisteredTargetSites Failed');
       }
     })
     .catch(function (error){
       console.log(error);
     });
   }
   checkAll(){
     const obj = this;
     if(this.state.isAllChecked){
       axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
         req_type: "check_false_all_target_site",
         job_id: obj.props.jobId,
       })
       .then(function (response) {
         if (response['data']['success'] == true) {
           //obj.state.registeredTargetSites[idx]['boxChecked'] = !obj.state.registeredTargetSites[idx]['boxChecked'];
           obj.getRegisteredTargetSites()
         } else {
           console.log('getRegisteredTargetSites Failed');
         }
       })
       .catch(function (error){
         console.log(error);
       });

       //for (let i = 0; i < this.state.registeredTargetSites.length; i++) {
       //  this.state.registeredTargetSites[i]['boxChecked'] = false;
       //}
     }
     else{
       axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
         req_type: "check_true_all_target_site",
         job_id: obj.props.jobId,
       })
       .then(function (response) {
         if (response['data']['success'] == true) {
           //obj.state.registeredTargetSites[idx]['boxChecked'] = !obj.state.registeredTargetSites[idx]['boxChecked'];
           obj.getRegisteredTargetSites()
         } else {
           console.log('getRegisteredTargetSites Failed');
         }
       })
       .catch(function (error){
         console.log(error);
       });
       //for (let i = 0; i < this.state.registeredTargetSites.length; i++) {
       //  this.state.registeredTargetSites[i]['boxChecked'] = true;
       //}
     }
     this.setState({isAllChecked: !this.state.isAllChecked })
   }

   clickRegisterModal(){
    this.setState({showRegisterModal: true})
   }

   clickUpdateModal(){
    this.setState({showUpdateModal: true})
   }


   getRegisteredTargetSites(){
     const obj = this;
     axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
       req_type: "get_registered_target_site",
       job_id: obj.props.jobId,
     })
     .then(function (response) {
       if (response['data']['success'] == true) {
         let registeredTargetSites = response['data']['result'];
         registeredTargetSites = registeredTargetSites.map(function(row, index){
           const id = row[0];
           const label = row[1];
           const url = row[2];
           const category = row[3];
           const c_num = row[4] == -999 ? '' : row[4]
           const max_items = row[5] == -999 ? '' : row[5]
           const checked = row[6]
           return {num: index+1, id: id, label: label, url: url, category: category, c_num: c_num, max_items: max_items, boxChecked: checked};
         });
         obj.setState({registeredTargetSites: registeredTargetSites, selectedRegisteredTargetSiteIndex: null});
         gvar_selectedRegisteredTargetSiteId = null
       } else {
         console.log('getRegisteredTargetSites Failed');
       }
     })
     .catch(function (error){
       console.log(error);
     });
   }




   deregisterTargetSite(){
     const obj = this;
     axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
       req_type: "deregister_target_site",
       tjcid: gvar_selectedRegisteredTargetSiteId

     })
     .then(function (response) {
       if (response['data']['success'] == true) {

         obj.getRegisteredTargetSites()
       } else {
         console.log('getRegisteredTargetSites Failed');
       }
     })
     .catch(function (error){
       console.log(error);
     });
   }


    initState(){
      return {
        selectedRegisteredTargetSiteIndex: null,
        isAllChecked: false,
        disabled: false,
        registeredTargetSites: []
      }
    }


    componentDidMount(){
      this.getRegisteredTargetSites();
      //this.loadTmpPricingInformation();
      
    }


    render() {

        return (
            <div>
              <label for="name"  style={{display: "flex",justifyContent: "center",alignItems: "center", fontWeight: "bold", fontSize:'20px'}}> Registered Target Site & Category </label>
              <ReactTable
                data = {this.state.registeredTargetSites}
                getTdProps={(state, rowInfo, column, instance) => {
                  if(rowInfo){
                    if(this.state.selectedRegisteredTargetSiteIndex !== null){ 
                      return {
                        onClick: (e) => {
                          this.setState({
                            selectedRegisteredTargetSiteIndex: rowInfo.index,
                            selectedRegisteredTargetSiteId: rowInfo.original['id'],
                          });
                          gvar_selectedRegisteredTargetSiteId = rowInfo.original['id']
                        },
                        style: {
                          background: rowInfo.index == this.state.selectedRegisteredTargetSiteIndex ? '#00ACFF' : null
                        }
                      }
                    }
                    else { // When you click a row at first.
                      return {
                        onClick: (e) => {
                          this.setState({
                            selectedRegisteredTargetSiteIndex: rowInfo.index,
                            selectedRegisteredTargetSiteId: rowInfo.original['id'],
                          });
                          gvar_selectedRegisteredTargetSiteId = rowInfo.original['id']
                        },
                        style: {
                          background: rowInfo.index == this.state.selectedRegisteredTargetSiteIndex ? '#00ACFF' : null
                        }
                      }
                    }
                  }
                  else{
                    if(this.state.selectedRegisteredTargetSiteIndex !== null){ // When you click a row not at first.
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
                         onClick={e => this.checkOneBox(row.original.num - 1, row.original['id'])}
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
                    Header: "Target Site",
                    resizable: false,
                    accessor: "label",
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
                    accessor: "url",
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
                    Header: "Category",
                    resizable: false,
                    accessor: "category",
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
                    Header: "Category Num",
                    resizable: false,
                    accessor: "c_num",
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
                    Header: "Max # of uploads",
                    resizable: false,
                    accessor: "max_items",
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
                minRows={3}
                showPagination ={false}
                bordered = {false} 
                style={{
                  height: "160px"
                }}
                className="-striped -highlight"
              />

              <Button 
                class="btn btn-outline-dark"
                type="button"
                style={{marginTop:'10px', float:'right'}}
                onClick = {()=> this.deregisterTargetSite() }
              >
              Delete
              </Button>
              <Button 
                class="btn btn-outline-dark"
                type="button"
                style={{marginTop:'10px',marginRight:'1%', float:'right'}}
                onClick = {()=> this.clickRegisterModal() }
              >
              Register / Update
              </Button>


              <RegisterTargetSiteAndPricingInfoModal
                  show={this.state.showRegisterModal}
                  JobId = {this.props.jobId}
                  userId={this.props.userId}
                  country={this.props.country}
                  getRegisteredTargetSites = {this.getRegisteredTargetSites}
                  selectedRegisteredTargetSiteId = {gvar_selectedRegisteredTargetSiteId}
                  setModalShow = {(s) => this.setState({showRegisterModal: s})}
              />

            </div>
        );
    }
}

export default Tree;
