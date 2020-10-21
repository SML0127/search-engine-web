import React, { Component } from "react";
import Calendar from "react-calendar"
import ReactTable from "react-table"
import 'react-table/react-table.css'
import "./tree.css";
import {Button} from "tabler-react"
import axios from 'axios'
import jobConfigIcon from './job_config.png';
import RegisterTargetSiteAndPricingInfoModal from "./RegisterTargetSiteAndPricingInfoModal";
import { 
  Modal,
  ModalHeader,
  ModalBody,
}  from 'reactstrap';
import setting_server from '../../../setting_server';


class Tree extends Component {

   constructor(props) {
       super(props);
       this.state = this.initState();
       this.getRegisteredTargetSites = this.getRegisteredTargetSites.bind(this)
   }

   clickRegisterModal(){
    this.setState({showRegisterModal: true})
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
           return {num: index+1, id: id, label: label, url: url, category: category, c_num: c_num};
         });
         obj.setState({registeredTargetSites: registeredTargetSites, selectedRegisteredTargetSiteIndex: null});
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
       tjcid: obj.state.selectedRegisteredTargetSiteId

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
      }
    }

    componentWillReceiveProps(nextProps) {
      if(this.props.refresh != nextProps.refresh){
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
              Deregister
              </Button>
              <Button 
                class="btn btn-outline-dark"
                type="button"
                style={{marginTop:'10px',marginRight:'1%', float:'right'}}
                onClick = {()=> this.clickRegisterModal() }
              >
              Register
              </Button>

              <RegisterTargetSiteAndPricingInfoModal
                  show={this.state.showRegisterModal}
                  JobId = {this.props.jobId}
                  userId={this.props.userId}
                  country={this.props.country}
                  getRegisteredTargetSites = {this.getRegisteredTargetSites}
                  setModalShow = {(s) => this.setState({showRegisterModal: s})}
              />
            </div>
        );
    }
}

export default Tree;
