// @flow

import * as React from "react";
import Collapsible from 'react-collapsible';
import {Tab as DTab} from 'react-draggable-tab';
import {Tabs as DTabs} from 'react-draggable-tab';
import {
  Container,
  Row,
  Col,
  Button
} from 'react-bootstrap';
import $ from "min-jquery";
// import ProjectList from './ProjectList';
import axios from 'axios';
import "../TreeView/App.css";
import JobTab from './JobTab';
import HomeTab from './HomeTab';
import ConfigTab from './ConfigTab';
import ScheduleTab from './ScheduleTab';
import WorkerTab from './WorkerTab';
import './style.css';
import setting_server from '../setting_server';


//import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
// Be sure to include styles at some point, probably during your bootstraping
//import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import JobConfigModal from "./JobConfigModal.react";
import VMModal from "./VMModal.react";
import PIModal from "./PIModal.react";
import MetisMenu from 'react-metismenu';
import './react-metismenu-standart.css';
import newGroupIcon from './add.png';
import configIcon from './gear.png';
import scheduleIcon from './schedule.png';
import workerIcon from './worker.png';
import folderIcon from './folder.png';
import productIcon from './product.png';
import jobConfigIcon from './job_config.png';
import jobVMIcon from './admin.png';
import NewProjectModal from './NewProjectModal';
import NewGroupModal from './NewGroupModal';
import DeleteGroupModal from './DeleteGroupModal';
import DeleteJobModal from './DeleteJobModal';
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from "constants";
import { AlertHeading } from "react-bootstrap/Alert";


var gUserId = -1 

class CustomLink extends React.Component {
  constructor() {
    super(); 
    this.onClick = this.onClick.bind(this);
    this.state = {
      count: 0,
      lastUpdate: '',
      isDeleteJobSelected: false,
      addJobConfigModalShow: false,
      addVMModalShow: false,
      addPIModalShow: false,
      url: ''
    }
    this.addJobConfigModal = this.addJobConfigModal.bind(this);
    this.addVMModal = this.addVMModal.bind(this);
    this.addPIModal = this.addPIModal.bind(this);
  }

  addJobConfigModal(){
    this.setState({addJobConfigModalShow: true})
  }

  addPIModal(){
    this.setState({addPIModalShow: true})
  }
  addVMModal(){
    this.setState({addVMModalShow: true})
  }
  onClick(e) {
    if (this.props.hasSubMenu) {
      if(this.state.isDeleteGroupSelected) {
        this.setState({isDeleteGroupSelected: false},
          this.props.activateMe({
            isDeleteGroupSelected: true,
            deleteGroupId: this.props.id
          })
        );
      }
      else {
        // selectedGroupId = this.props.id;
        // this.toggle(this, e, this.props.activateMe);
        this.props.activateMe({
          isGroupSelected: true,
          selectedGroupId: this.props.id,
        });
        this.props.toggleSubMenu(e);
        // selectedGroupId = this.props.id;
      }
    }
    else if (this.state.isDeleteJobSelected) {
      this.setState({isDeleteJobSelected: false},
        this.props.activateMe({
          isDeleteJobSelected: true,
          deleteJobId: this.props.id
        })
      );
    }
    else {
      this.props.activateMe({
        isDeleteJobSelected: false,
        item: [this.props.id, this.props.label, this.state.url],
      });
    }
  }

  componentWillMount(){
    this.loadCount();
    this.loadLastupdate();
    this.loadUrl();
    this.loadCountry();
  }


  loadCount() {
    const obj = this;
    axios.post(setting_server.DB_SERVER+'/api/db/job', {
      req_type: "get_num_of_product_in_job",
      job_id: this.props.id
    })
    .then(function (response) {
      if (response['data']['success'] == true) {
        obj.setState({count: response['data']['result'][0]});
        // lastUpdate = response['data']['result'][0][1];
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  loadLastupdate() {
    const obj = this;
    axios.post(setting_server.DB_SERVER+'/api/db/job', {
      req_type: "get_lastupdate",
      job_id: obj.props.id
    })
    .then(function (response) {
      if (response['data']['success'] == true) {
        if( response['data']['result'] == null ){
          
        }
        else{
          //console.log(obj.props.id)
          //console.log(response['data']['result'][0])
          obj.setState({lastUpdate: response['data']['result'][0]});
        }
        // lastUpdate = response['data']['result'][0][1];
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }


  loadCountry() {
    const obj = this;
    axios.post(setting_server.DB_SERVER+'/api/db/job', {
      req_type: "get_country",
      job_id: this.props.id
    })
    .then(function (response) {
      if (response['data']['success'] == true) {
        obj.setState({country: response['data']['result'][0]});
      } else {
        console.log('get_url Failed');
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  loadUrl() {
    const obj = this;
    axios.post(setting_server.DB_SERVER+'/api/db/job', {
      req_type: "get_url",
      job_id: this.props.id
    })
    .then(function (response) {
      if (response['data']['success'] == true) {
        obj.setState({
          url: response['data']['result'],
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    const obj = this;
    if (this.props.hasSubMenu) {
      return (
        <>
          <button className="metismenu-link" onClick={this.onClick}>
            <img
                src={folderIcon}
                width="21"
                height="21" 
                 
                style={{
                  cursor: "pointer",
                  marginRight:'4%',
                  marginBottom:'1.5%',
                  marginLeft:'4%'
                }}
            />
            <OverlayTrigger
              placement="left"
              delay={{ show: 250, hide: 400 }}
              overlay={
                <Tooltip>
                  Delete group 
                </Tooltip>
              }
            >
              <span
                style={{float: "right"}}
                onClick={(event) => {
                  event.stopPropagation();
                  this.setState({
                    isDeleteGroupSelected: true
                  }, this.onClick);
                }}
              >
                ✕
              </span>
            </OverlayTrigger>

            {this.props.children}
          </button>
        </>
      );
    } else if (this.state.url != '' && this.props.label.match('New!')) {
      let country =  this.state.country
      if(country != undefined){
         country = country[0].slice(0,2)
      }
      return (
        <>
        <button className="metismenu-link" onClick={this.onClick}>
          <label style={{fontSize:'17px', color:'black'}}>
            <label class="showupAfter8seconds" style = {{color:'red'}}>
              New! <b>[</b>{country}<b>]</b> {this.props.label.split('New!')[1]}
            </label>
          </label>
          <div style={{float:'right'}}>
          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={
              <Tooltip>
                Delete job 
              </Tooltip>
            }
          >
            <span
              style={{float: "right", marginRight: "5px", marginRight:'3%'}}
              onClick={(event) => {
                event.stopPropagation();
                this.setState({
                  isDeleteJobSelected: true
                }, this.onClick);
              }}
            >

            ✕
            </span>
          </OverlayTrigger>
          </div>
          <div style={{color: "#A6A7A9", marginRight:'3%'}}>
            <span>Count: </span>
            <span style={{textDecoration: "underline"}}>{this.state.count}</span>
            <span style={{float: "right"}}>{this.state.lastUpdate} </span>
            {/* <span>Last Update: {lastUpdate}</span> */}
          </div>
        </button>
        <div className="metismenu-link">
        <OverlayTrigger
          placement="left"
          delay={{ show: 250, hide: 400 }}
          overlay={
            <Tooltip>
              Configure job schedueling property 
            </Tooltip>
          }
        >
          <img
              src={jobConfigIcon}
              width="30"
              height="30"
              onClick={()=> this.addJobConfigModal()}
              style={{
                cursor: "pointer",
                float: "right"
              }}
          />
        </OverlayTrigger>
        <OverlayTrigger
          placement="left"
          delay={{ show: 250, hide: 400 }}
          overlay={
            <Tooltip>
              Check <br/> the products on my site
            </Tooltip>
          }
        >
          <img
            src={productIcon}
            width="30"
            height="30"
            onClick={() => this.addPIModal()}
            style={{
              cursor: "pointer",
              float: "right",
              marginRight: '3%',
            }}
          />
        </OverlayTrigger>
        <OverlayTrigger
          placement="left"
          delay={{ show: 250, hide: 400 }}
          overlay={
            <Tooltip>
              Check <br/>the current progress of <br/>the scheduled job
            </Tooltip>
          }
        >
          <img
            src={jobVMIcon}
            width="30"
            height="30"
            onClick={() => this.addVMModal()}
            style={{
              cursor: "pointer",
              float: "right",
              marginRight: '4%',
              marginTop: '1.2%',
            }}
          />
        </OverlayTrigger>

        </div>
        <JobConfigModal
            show={this.state.addJobConfigModalShow}
            JobId = {this.props.id}
            userId={gUserId}
            country = {this.state.country}
            setModalShow={(s) => this.setState({addJobConfigModalShow: s})}
        />
        <VMModal
            show={this.state.addVMModalShow}
            JobId = {this.props.id}
            userId={gUserId}
            setModalShow={(s) => this.setState({addVMModalShow: s})}
        />
        <PIModal
            show={this.state.addPIModalShow}
            JobId = {this.props.id}
            userId={gUserId}
            setModalShow={(s) => this.setState({addPIModalShow: s})}
        />
        </>
      );
    } else if (this.state.url != '') {
      let country =  this.state.country
      if(country != undefined){
         country = country[0].slice(0,2)
      }
      return (
        <>
        <button className="metismenu-link" onClick={this.onClick}>
          <label style={{fontSize:'13px', color:'black', display:'inline'}}>
             <b>[</b>{country}<b>]</b> {this.props.label}
          </label>
          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={
              <Tooltip>
                Delete job 
              </Tooltip>
            }
          >
            <span
              style={{float: "right", marginRight: "5px", marginRight:'3%'}}
              onClick={(event) => {
                event.stopPropagation();
                this.setState({
                  isDeleteJobSelected: true
                }, this.onClick);
              }}
            >

            ✕
            </span>
          </OverlayTrigger>
          <div style={{color: "#A6A7A9", marginRight:'3%'}}>
            <span>Count: </span>
            <span style={{textDecoration: "underline"}}>{this.state.count}</span>
            <span style={{float: "right"}}>{this.state.lastUpdate} </span>
          </div>
        </button>
        <div className="metismenu-link">
          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={
              <Tooltip>
                Configure job schedueling property 
              </Tooltip>
            }
          >
            <img
                src={jobConfigIcon}
                width="30"
                height="30"
                onClick={()=> this.addJobConfigModal()}
                style={{
                  cursor: "pointer",
                  float: "right"
                }}
            />
          </OverlayTrigger>
          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={
              <Tooltip>
                Check <br/> the products on my site
              </Tooltip>
            }
          >
            <img
              src={productIcon}
              width="30"
              height="30"
              onClick={() => this.addPIModal()}
              style={{
                cursor: "pointer",
                float: "right",
                marginRight: '3%',
              }}
            />
          </OverlayTrigger>
          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={
              <Tooltip>
                Check <br/>the current progress of <br/>the scheduled job
              </Tooltip>
            }
          >
            <img
              src={jobVMIcon}
              width="30"
              height="30"
              onClick={() => this.addVMModal()}
              style={{
                cursor: "pointer",
                float: "right",
                marginRight: '4%',
                marginTop: '1.2%',
              }}
            />
          </OverlayTrigger>
        </div>
        <JobConfigModal
            show={this.state.addJobConfigModalShow}
            JobId = {this.props.id}
            userId={gUserId}
            country = {this.state.country}
            setModalShow={(s) => this.setState({addJobConfigModalShow: s})}
        />
        <VMModal
            show={this.state.addVMModalShow}
            JobId = {this.props.id}
            userId={gUserId}
            setModalShow={(s) => this.setState({addVMModalShow: s})}
        />
        <PIModal
            show={this.state.addPIModalShow}
            JobId = {this.props.id}
            userId={gUserId}
            setModalShow={(s) => this.setState({addPIModalShow: s})}
        />
        </>
      );
    } else {
      return null;
    }
  }
};

export default class Main extends React.Component {
  constructor(props) {
      super(props);
      gUserId = this.props.userId;
      this.myRef = React.createRef();
      let curUrl = window.location.href;
      this.state = {
        selectedGroupId: -1,
        groupJobList: [],
        url:'TESTTTTTTTT',
        newGroupModalShow: false,
        // configModalShow: false,
        deleteGroupModalShow: [],
        deleteJobModalShow: [],
        selectedTab: 'home',
        tabs: [
          (<DTab key={"home"} title={'Home'} unclosable={true} {...this.makeListeners("home")}>
            <HomeTab makeNewJob={this.makeNewJob.bind(this)} userId={this.props.userId} />
          </DTab>)
        ],
        temp: 0
      };
      // this.setSelectedProjectId = this.setSelectedProjectId.bind(this);
      this.addJobTab = this.addJobTab.bind(this);
      this.addConfigTab = this.addConfigTab.bind(this);
      this.addWorkerTab = this.addWorkerTab.bind(this);
      this.addScheduleTab = this.addScheduleTab.bind(this);
      this.makeNewProject = this.makeNewProject.bind(this);
      this.makeNewGroup = this.makeNewGroup.bind(this);
      this.deleteGroup = this.deleteGroup.bind(this);
      this.deleteJob = this.deleteJob.bind(this);
      this.setDeleteGroupModalShow = this.setDeleteGroupModalShow.bind(this);
      this.setDeleteJobModalShow = this.setDeleteJobModalShow.bind(this);
      //this.createNotification = this.createNotification.bind(this);    
      this.jobSelected = this.jobSelected.bind(this);
      this.handleClick = this.handleClick.bind(this);

  }
  // setSelectedProjectId(projectId){
  //   this.setState({
  //     selectedProjectId: projectId
  //   });
  //   console.log(this.state.selectedProjectId);
  // }
  jobSelected(param){
    if (param.isGroupSelected) {
      let newTabs = this.state.tabs;
      const index = newTabs.findIndex((element) => element.key === "home");
      newTabs[index] = 
        (<DTab key={"home"} title={'Home'} unclosable={true} {...this.makeListeners("home")}>
          <HomeTab
            makeNewJob={this.makeNewJob.bind(this)}
            userId={this.props.userId}
            parentId={param.selectedGroupId}
          />
        </DTab>);
      this.setState({
        selectedGroupId: param.selectedGroupId,
        tabs: newTabs
      });
    }
    else if (param.isDeleteJobSelected) {
      const jobList = this.state.groupJobList.filter(function(item){
        return item.parentId !== undefined;
      });
      const numJobs = jobList.length;
      const index = jobList.findIndex(function(item){
        return item.id == param.deleteJobId;
      });
      let deleteJobModalShowTemp = Array(numJobs).fill(false);
      deleteJobModalShowTemp[index] = true;
      this.setState({deleteJobModalShow: deleteJobModalShowTemp});
      //this.deleteJob(param.deleteJobId);
    }
    else if (param.isDeleteGroupSelected) {
      const groupList = this.state.groupJobList.filter(function(item){
        return item.parentId === undefined;
      });
      const numGroups = groupList.length;
      const index = groupList.findIndex(function(item){
        return item.id == param.deleteGroupId;
      });
      let deleteGroupModalShowTemp = Array(numGroups).fill(false);
      deleteGroupModalShowTemp[index] = true;
      this.setState({deleteGroupModalShow: deleteGroupModalShowTemp});
    }
    else {
      this.addJobTab(param.item);
    }
  }

  makeNewJob(userId, parentId, url, jobLabel, country) {
    const obj = this;
    axios.post(setting_server.DB_SERVER+'/api/db/job', {
      req_type: "make_new_job",
      user_id: userId,
      parent_id: parentId,
      url: url,
      job_label: jobLabel,
      job_country: country
    })
    .then(function (response) {
      console.log(response)
      if (response['data']['success'] == true) {
        const jobId = String(response['data']['result'][0]);
        const jobLabel = response['data']['result'][1];
        const jobCountry = response['data']['result'][2];
        const today = new Date();
        const newJob = {
          id: Number(jobId),
          parentId: parentId,
          label: 'New! '+jobLabel,
          url:url,
          country: jobCountry,
          lastUpdate: today.getFullYear()+'-'+String(parseInt(today.getMonth()+1)).padStart(2, "0")+'-' +today.getDate()
        };
        
        console.log(today.getFullYear()+'-'+String(parseInt(today.getMonth()+1)).padStart(2, "0")+'-' +today.getDate())
        // a part of addJobTab
        const currentTabs = obj.state.tabs;
        const currentKeys = currentTabs.map((tab) => {
          return tab.key;
        });
        const newTab = (
          <DTab key={jobId} title={jobLabel} {...obj.makeListeners(jobId)}>
            <JobTab jobId={jobId} url={url}/>
          </DTab>
        );
        let newTabs = currentTabs.concat([newTab]);
        obj.setState({
          groupJobList: obj.state.groupJobList.concat(newJob),
          tabs: newTabs,
          selectedTab: jobId
        });
      } else {
        console.log('makeNewProject failed');
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleTabSelect(e, key, currentTabs) {
    console.log('handleTabSelect key:', key);
    this.setState({selectedTab: key});
  }

  handleTabClose(e, key, currentTabs) {
      console.log('tabClosed key:', key);
      console.log('currentTabs: ', currentTabs);
      this.setState({tabs: currentTabs});
  }

  handleTabPositionChange(e, key, currentTabs) {
    console.log('tabPositionChanged key:', key);
    console.log('currentTabs: ', currentTabs);
    this.setState({tabs: currentTabs});
  }
  makeListeners(key){
    return {
      onClick: (e) => {this.handleTabSelect(e, key)}, // never called
      // onContextMenu: (e) => { console.log('onContextMenu', key, e); this.handleTabContextMenu(key, e)},
      // onDoubleClick: (e) => { console.log('onDoubleClick', key, e); this.handleTabDoubleClick(key, e)},
    }
  }

  loadGroupList() {
    const obj = this;
    let group;
    let job;
    let group_job;
    //$.ajax({ 
    //    type: 'POST',
    //    async: false,
    //    data: {
    //      req_type: 'get_group_list',
    //      user_id: obj.props.userId
    //    },
    //    url: setting_server.DB_SERVER+'/api/db/group',
    //    success: function (response) {
    //      console.log(response)
    //      if (response['data']['success'] == true) {
    //        group = response['data']['result'][0][0];
    //        $.ajax({ 
    //            type: 'POST',
    //            async: false,
    //            data: {
    //              req_type: 'get_job_list',
    //              user_id: obj.props.userId
    //            },
    //            url: setting_server.DB_SERVER+'/api/db/job',
    //            success: function (response) {
    //              if(response['data']['success'] == true) {
    //                job = response['data']['result'][0][0];
    //                if (group == null){
    //                   group_job = []
    //                }
    //                else{
    //                   group_job = group.concat(job);
    //                }
    //                obj.setState({
    //                  groupJobList: group_job,
    //                  // deleteProjectModalShow: Array(len).fill(false)
    //                });
    //                console.log(group_job)
    //              } else{
    //                console.log(response)
    //                console.log('loadJobList Failed');
    //              }
    //           },
    //           error:function(err) {
    //             console.log(err)
    //           }
    //        })
    //      }
    //    },
    //    error:function(err) {
    //      console.log(err)
    //    }
    //});

    axios.post(setting_server.DB_SERVER+'/api/db/group', {
      req_type: "get_group_list",
      user_id: obj.props.userId
    })
    .then(function (response) {
      if (response['data']['success'] == true) {
        group = response['data']['result'][0][0];
        axios.post(setting_server.DB_SERVER+'/api/db/job', {
          req_type: 'get_job_list',
          user_id: obj.props.userId
        })
        .then(function(response) {
          if(response['data']['success'] == true) {
            job = response['data']['result'][0][0];
            if (group == null){
               group_job = []
            }
            else{
               group_job = group.concat(job);
            }
            obj.setState({
              groupJobList: group_job,
            });
          } else{
            console.log(response)
            console.log('loadJobList Failed');
          }
        })
        .catch(function(error){
          console.log(response)
          console.log(error);
        });
      } else {
        console.log('loadGroupList Failed');
      }
      obj.forceUpdate()
    })
    .catch(function (error) {
        console.log(error);
    });
  }

  addJobTab(item){
    const jobId = String(item[0]);
    const jobLabel = item[1];
    const url = item[2];
    const currentTabs = this.state.tabs;
    const currentKeys = currentTabs.map((tab) => {
      return tab.key;
    });
    if (!currentKeys.includes(jobId)) {
      const newTab = (
        <DTab key={jobId} title={jobLabel} {...this.makeListeners(jobId)}>
          <JobTab jobId={jobId} url={url} is_dev = {this.props.is_dev} />
        </DTab>
      );
      let newTabs = currentTabs.concat([newTab]);
      this.setState({
          tabs: newTabs,
          selectedTab: jobId
      });
    } else {
      this.setState({
        selectedTab: jobId
      });
    }
  }

  addScheduleTab() { 
    const scheduleTabId = "Schedule"; 
    const scheduleTabLabel = "Schedule"; 
    const currentTabs = this.state.tabs;
    const currentKeys = currentTabs.map((tab) => {
      return tab.key;
    });
    if (!currentKeys.includes(scheduleTabId)) {
      const newTab = (
        <DTab key={scheduleTabId} title={scheduleTabLabel} {...this.makeListeners(scheduleTabId)}>
          <ScheduleTab userId={this.props.userId}></ScheduleTab>
        </DTab>
      );
      let newTabs = currentTabs.concat([newTab]);
      this.setState({
        tabs: newTabs,
        selectedTab: scheduleTabId
      });
    } else {
      this.setState({
        selectedTab: scheduleTabId
      })
    }
  }



  addConfigTab() { // This function is similar to addJobTab function. You could integrate this function with addJobTab function.
    const configTabId = "Configuration"; // This code assumes that there is no tab which id is configuration.
    const configTabLabel = "Configuration"; // In that case, you need modify jobId of this function.
    const currentTabs = this.state.tabs;
    const currentKeys = currentTabs.map((tab) => {
      return tab.key;
    });
    if (!currentKeys.includes(configTabId)) {
      const newTab = (
        <DTab key={configTabId} title={configTabLabel} {...this.makeListeners(configTabId)}>
          <ConfigTab userId={this.props.userId}></ConfigTab>
        </DTab>
      );
      let newTabs = currentTabs.concat([newTab]);
      this.setState({
        tabs: newTabs,
        selectedTab: configTabId
      });
    } else {
      this.setState({
        selectedTab: configTabId
      })
    }
  }



  addWorkerTab() { // This function is similar to addJobTab function. You could integrate this function with addJobTab function.
    const workerTabId = "Worker"; // This code assumes that there is no tab which id is configuration.
    const workerTabLabel = "Worker"; // In that case, you need modify jobId of this function.
    const currentTabs = this.state.tabs;
    const currentKeys = currentTabs.map((tab) => {
      return tab.key;
    });
    if (!currentKeys.includes(workerTabId)) {
      const newTab = (
        <DTab key={workerTabId} title={workerTabLabel} {...this.makeListeners(workerTabId)}>
          <WorkerTab userId={this.props.userId}></WorkerTab>
        </DTab>
      );
      let newTabs = currentTabs.concat([newTab]);
      this.setState({
        tabs: newTabs,
        selectedTab: workerTabId
      });
    } else {
      this.setState({
        selectedTab: workerTabId
      })
    }
  }

  makeNewProject(projectName, userId){
    const obj = this;
    console.log(this.props.userId, '3234');
    axios.post(setting_server.DB_SERVER+'/api/db/project', {
      req_type: "make_new_project",
      project_name: projectName,
      user_id: userId
    })
    .then(function (response) {
      if (response['data']['success'] == true) {
        console.log(response['data']['success'], '123');
        obj.loadProjectList();
      } else {
        console.log('makeNewProject failed');
      }
    })
    .catch(function (error) {
      console.log(error, '23');
    });
  }

  makeNewGroup(groupName, userId){
    const obj = this;
    console.log(groupName, userId)
    axios.post(setting_server.DB_SERVER+'/api/db/group', {
      req_type: "make_new_group",
      group_name: groupName,
      user_id: userId
    })
    .then(function (response) {
      if (response['data']['success'] == true) {
        const groupId = response['data']['group_id'];
        axios.post(setting_server.DB_SERVER+'/api/db/job', {
          req_type: "make_new_job",
          user_id: userId,
          parent_id: groupId,
          url: '',
          job_label: '',
          job_country: ''
        })
        .then(function(response){
          console.log(response)
          if(response['data']['success'] == true) {
            obj.loadGroupList();
          } else {
            console.log('makeNewEmptyJob failed');
          }
        })
        .catch(function(error) {
          console.log(error);
        });
      } else {
        console.log('makeNewProject failed');
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  deleteJob(jobId){
    const obj = this;
    axios.post(setting_server.DB_SERVER+'/api/db/job', {
      req_type: "remove_job",
      job_id: jobId
    })
    .then(function (response) {
      if (response['data']['success'] == true) {
        const currentTabs = obj.state.tabs;
        let currentSelectedTab = obj.state.selectedTab;
        const idx = currentTabs.findIndex((item) => {
          return item.key === String(jobId);
        });
        if(idx > -1) {
          currentTabs.splice(idx, 1);
          console.log('currentSelectedTab: ', currentSelectedTab);
          console.log('jobId: ', jobId);
          if (currentSelectedTab === String(jobId)) {
            currentSelectedTab =
                currentTabs[idx] ? currentTabs[idx].key :
                    currentTabs[currentTabs.length - 1].key;
          }
        }
        obj.setState({
          tabs: currentTabs,
          selectedTab: currentSelectedTab
        });
        console.log('deleteJob success');
        obj.loadGroupList();
      } else {
        console.log('deleteJob Failed');
      }
    })
    .catch(function (error){
      console.log(error);
    });
  }

  deleteGroup(groupId){
    const obj = this;
    axios.post(setting_server.DB_SERVER+'/api/db/group', {
      req_type: "remove_group",
      group_id: groupId
    })
    .then(function (response) {
      if (response['data']['success'] == true) {
        const currentTabs = obj.state.tabs;
        const currentGroupJobList = obj.state.groupJobList;
        const jobsInDeletedGroup = currentGroupJobList.filter((item) => {
          return item.parentId === groupId;
        });
        const jobIdsInDeletedGroup = jobsInDeletedGroup.map((item) => {
          return item.id;
        });
        const newTabs = currentTabs.filter((item) => {
          return !jobIdsInDeletedGroup.includes(parseInt(item.key))
        });
        console.log(newTabs);
        if (newTabs.map((item) => item.key).includes(obj.state.selectedTab)) {
          obj.setState({tabs: newTabs});
        } else {
          obj.setState({tabs: newTabs, selectedTab: 'home'});
        }
        obj.loadGroupList();

      } else {
        console.log('deleteProject Failed');
      }
    })
    .catch(function (error){
      console.log(error);
    });
  }

  setDeleteGroupModalShow(state, index) {
    let deleteGroupModalShowTemp = this.state.deleteGroupModalShow;
    deleteGroupModalShowTemp[index] = state;
    this.setState({
      deleteGroupModalShow: deleteGroupModalShowTemp
    });
  }

  setDeleteJobModalShow(state, index) {
    let deleteJobModalShowTemp = this.state.deleteJobModalShow;
    deleteJobModalShowTemp[index] = state;
    this.setState({
      deleteJobModalShow: deleteJobModalShowTemp
    });
  }

  componentWillMount(){
    this.loadGroupList();
  }

  handleClick(e){
    e.preventDefault();
    alert(this.state.selectedGroupId);
    this.temp += 1;
    // this.setState({
    //   temp: this.state.temp+1,
    //   tabs: [
    //     (<DTab key={"home"} title={'Home'} unclosable={true} {...this.makeListeners("home")}>
    //       <HomeTab makeNewJob={this.makeNewJob.bind(this)} userId={this.props.userId} parentId={selectedGroupId}/>
    //     </DTab>)
    //   ],
    // });
  }

  render() {
    const tabsStyles = {
      tabWrapper: { marginTop: '5px', tabColor: '#00ACFF'},
      tabBar: {},
      tab:{},
      tabTitle: {},
      tabCloseIcon: {},
      tabBefore: {},
      tabAfter: {}
    };
    const obj = this;
   

    if (obj.props.is_dev == true){
      return (
      <>
        <div className="sidebar">
          <div className="accountInfo" style={{color:'#00ACFF'}}> Dev User ID:<label style={{color:'black', marginLeft:'2%'}}> {this.props.userId}</label></div>
          <div className="myJobs">
            <label style = {{marginLeft:'2%', color:'#5F6162'}}>
            All Groups
            </label>
            {/* <button onClick={this.handleClick}>
              alertA
            </button> */}

            
            <span style={{float: "right", marginRight:'4px'}}>
              <OverlayTrigger
                placement="left"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip >
                    Set common information <br/>(e.g. Exchange Rate)
                  </Tooltip>
                }
              >
                <img
                  src={configIcon}
                  width="22"
                  height="22"
                  onClick={() =>
                    this.addConfigTab()
                  }
                  style={{
                    cursor: "pointer",
                    marginBottom: "50%"
                  }}
                />
              </OverlayTrigger> 
            </span>

            <span style={{float: "right", marginRight:'4px'}}>
              <OverlayTrigger
                placement="left"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip >
                    Manage worker
                  </Tooltip>
                }
              >
                <img
                  src={workerIcon}
                  width="22"
                  height="22"
                  onClick={() =>
                    this.addWorkerTab()
                  }
                  style={{
                    cursor: "pointer",
                    marginBottom: "50%"
                  }}
                />
              </OverlayTrigger> 
            </span>
            <span style={{float: "right", marginRight:"4px"}}>
              <OverlayTrigger
                placement="left"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip >
                    Manage registered schedules
                  </Tooltip>
                }
              >
                <img
                  src={scheduleIcon}
                  width="26"
                  height="26"
                  onClick={() =>
                    this.addScheduleTab()
                  }
                  style={{
                    cursor: "pointer",
                    marginBottom: "50%"
                  }}
                />
              </OverlayTrigger> 
            </span>
            <span style={{float: "right", marginRight: "4px"}}>
              <OverlayTrigger
                placement="left"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip>
                    Create new group
                  </Tooltip>
                }
              >
                <img
                  src={newGroupIcon}
                  width="25"
                  height="25"
                  onClick={() =>
                    this.setState({
                      newGroupModalShow: true
                    })
                  }
                  style={{
                    cursor: "pointer"
                  }}
                />
              </OverlayTrigger> 
            </span>
          </div>
          <MetisMenu
            className="menu"
            content={this.state.groupJobList}
            LinkComponent={CustomLink}
            onSelected={this.jobSelected}
            activeLinkFromLocation
            activeLinkId={this.state.activeLinkId}
          />
        </div>
        <div style={{height: "100vh", overflow: "auto"}}>
          <Container fluid>
            <Row>
              <Col style={{marginLeft:"-1%", marginRight:'-5%'}}>
                <DTabs
                  tabsStyles={tabsStyles}
                  selectedTab={this.state.selectedTab}
                  onTabSelect={this.handleTabSelect.bind(this)}
                  onTabClose={this.handleTabClose.bind(this)}
                  tabAddButton = {false}
                  onTabPositionChange={this.handleTabPositionChange.bind(this)}
                  tabs={this.state.tabs}
                />
              </Col>
            </Row>
          </Container>
        </div>
        <NewGroupModal
          show={this.state.newGroupModalShow}
          makeNewGroup={this.makeNewGroup}
          setModalShow={(s) => this.setState({newGroupModalShow: s})}
          userId={this.props.userId}
          groupNameList={this.state.groupJobList.filter(function(item){
            return item.parentId === undefined;
          }).map((item) => {return item.label;})}
        />
        {
          obj.state.groupJobList.filter(function(item){
            return item.parentId !== undefined;
          })
          .map(function(item, index){
            return (
              <DeleteJobModal
                show={obj.state.deleteJobModalShow[index]}
                jobId={item.id}
                jobLabel={item.label}
                jobUrl={item.url}
                index={index}
                setModalShow={obj.setDeleteJobModalShow}
                deleteJob={obj.deleteJob}
              />
            );
          })
        }
        {
          obj.state.groupJobList.filter(function(item){
            return item.parentId === undefined;
          })
          .map(function(item, index){
            return (
              <DeleteGroupModal
                show={obj.state.deleteGroupModalShow[index]}
                groupId={item.id}
                groupLabel={item.label}
                index={index}
                setModalShow={obj.setDeleteGroupModalShow}
                deleteGroup={obj.deleteGroup}
              />
            );
          })
        }
      </>
    );
    }
    else{
      return (
      <>
        <div className="sidebar">
          <div className="accountInfo" style={{color:'#00ACFF'}}>User ID:<label style={{color:'black', marginLeft:'2%'}}> {this.props.userId}</label></div>
          <div className="myJobs">
            <label style = {{marginLeft:'2%', color:'#5F6162'}}>
            All Groups
            </label>

            <span style={{float: "right", marginRight:'4px'}}>
              <OverlayTrigger
                placement="left"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip >
                    Manage worker
                  </Tooltip>
                }
              >
                <img
                  src={workerIcon}
                  width="22"
                  height="22"
                  onClick={() =>
                    this.addWorkerTab()
                  }
                  style={{
                    cursor: "pointer",
                    marginBottom: "50%"
                  }}
                />
              </OverlayTrigger> 
            </span>
            <span style={{float: "right", marginRight:"4px"}}>
              <OverlayTrigger
                placement="left"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip >
                    Manage registered schedules
                  </Tooltip>
                }
              >
                <img
                  src={scheduleIcon}
                  width="26"
                  height="26"
                  onClick={() =>
                    this.addScheduleTab()
                  }
                  style={{
                    cursor: "pointer",
                    marginBottom: "50%"
                  }}
                />
              </OverlayTrigger> 
            </span>
            <span style={{float: "right", marginRight: "4px"}}>
              <OverlayTrigger
                placement="left"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip>
                    Create new group
                  </Tooltip>
                }
              >
                <img
                  src={newGroupIcon}
                  width="25"
                  height="25"
                  onClick={() =>
                    this.setState({
                      newGroupModalShow: true
                    })
                  }
                  style={{
                    cursor: "pointer"
                  }}
                />
              </OverlayTrigger> 
            </span>
          </div>
          <MetisMenu
            className="menu"
            content={this.state.groupJobList}
            LinkComponent={CustomLink}
            onSelected={this.jobSelected}
            activeLinkFromLocation
            activeLinkId={this.state.activeLinkId}
          />
        </div>
        <div style={{height: "100vh", overflow: "auto"}}>
          <Container fluid>
            <Row>
              <Col style={{marginLeft:"-1%", marginRight:'-5%'}}>
                <DTabs
                  tabsStyles={tabsStyles}
                  selectedTab={this.state.selectedTab}
                  onTabSelect={this.handleTabSelect.bind(this)}
                  onTabClose={this.handleTabClose.bind(this)}
                  tabAddButton = {false}
                  onTabPositionChange={this.handleTabPositionChange.bind(this)}
                  tabs={this.state.tabs}
                />
              </Col>
            </Row>
          </Container>
        </div>
        <NewGroupModal
          show={this.state.newGroupModalShow}
          makeNewGroup={this.makeNewGroup}
          setModalShow={(s) => this.setState({newGroupModalShow: s})}
          userId={this.props.userId}
          groupNameList={this.state.groupJobList.filter(function(item){
            return item.parentId === undefined;
          }).map((item) => {return item.label;})}
        />
        {
          obj.state.groupJobList.filter(function(item){
            return item.parentId !== undefined;
          })
          .map(function(item, index){
            return (
              <DeleteJobModal
                show={obj.state.deleteJobModalShow[index]}
                jobId={item.id}
                jobLabel={item.label}
                jobUrl={item.url}
                index={index}
                setModalShow={obj.setDeleteJobModalShow}
                deleteJob={obj.deleteJob}
              />
            );
          })
        }
        {
          obj.state.groupJobList.filter(function(item){
            return item.parentId === undefined;
          })
          .map(function(item, index){
            return (
              <DeleteGroupModal
                show={obj.state.deleteGroupModalShow[index]}
                groupId={item.id}
                groupLabel={item.label}
                index={index}
                setModalShow={obj.setDeleteGroupModalShow}
                deleteGroup={obj.deleteGroup}
              />
            );
          })
        }
      </>
    );


    }
    
  }
}
