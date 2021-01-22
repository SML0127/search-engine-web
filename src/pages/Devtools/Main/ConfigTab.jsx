// @flow

import ReactTable from "react-table";
import * as React from "react";
import $ from 'jquery';

import Collapsible from 'react-collapsible';
import ReteGraph from "../rete/ReteGraph.react";
import {
  Form,
  Page,
  Grid,
  Card,
  Button,
  colors,
  TabbedCard,
  Tab,
} from "tabler-react";
import axios from 'axios';
import NewTargetSiteModal from './NewTargetSiteModal';
import EditTargetSiteModal from './EditTargetSiteModal';
import UpdateExchangeRateModal from './UpdateExchangeRateModal';
import NewDeliveryCompanyModal from './NewDeliveryCompanyModal';
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import EditDeliveryCompanyModal from './EditDeliveryCompanyModal';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import setting_server from '../setting_server';

class ConfigTab extends React.Component {

    constructor(props) {
        super(props);
        let curUrl = window.location.href;
        this.state = {
          country: '',
          usage: '',
          path: '/var/lib/postgresql/12/main',
          countryOptions: '',
          allExchangeRate: '',
          targetSites: [],
          tvRates: [],
          selectedTargetSiteIndex: null,
          selectedTargetSiteId: null,
          selectedTargetSiteLabel: '',
          selectedTargetSiteUrl: '',
          newTargetSiteModalShow: false,
          editTargetSiteModalShow: false,
          deliveryCompanies: [],
          selectedDeliveryCompanyIndex: null,
          selectedDeliveryCompanyId: -1,
          selectedDeliveryCompanyLabel: null,
          rate: [],
          selectedRateIndex: null,
          selectedRateId: null,
          selectedCategory: null,
          selectedTRate: null,
          selectedVRate: null,
          newDeliveryCompanyModalShow: false,
          editDeliveryCompanyModalShow: false,
          time_condition: ''
        };
        this.makeNewTargetSite = this.makeNewTargetSite.bind(this);
        this.makeNewRate = this.makeNewRate.bind(this);
        this.getRate = this.getRate.bind(this);
        this.updateCountry = this.updateCountry.bind(this)
        this.setUpdateExchangeRateModalShow = this.setUpdateExchangeRateModalShow.bind(this)
        this.updateExchangeRate = this.updateExchangeRate.bind(this)
        this.getDiskUsage = this.getDiskUsage.bind(this)
        this.emptyDiskUsage = this.emptyDiskUsage.bind(this)
        this.updateTimeCondition = this.updateTimeCondition.bind(this)
    }

      
    updateTimeCondition(event) {
      console.log(event.target.value)
      this.setState({time_condition: event.target.value});
    }



    updateCountry(event) {
      let selected_country = event.target.value
      this.setState({country: selected_country},() => {this.setState({curExchangeRate: this.state.allExchangeRate[selected_country]})});
    }

    setUpdateExchangeRateModalShow(state) {
      this.setState({
        updateExchangeRateModalShow: state
      });
    }



   createNotification = (type) => {
      switch (type) {
        case 'warning':
            NotificationManager.warning('Select delivery company','WARNING',  3000);
            break;
        case 'exchange_rate':
            NotificationManager.error('Failed to update exchange rate','Error',  3000);
            break;
        case 'error':
            NotificationManager.error('Error message', 'Click me!', 5000, () => {
                alert('callback');
            });
            break;
        default:
            console.log("Not defined notification")
            break;
      }
    };




    onTodoChange(key,value){
      this.setState({
        [key]: value
      });
    }

    simplify(nodes) {
        const nodesCopy = [];
        for (let i = 0; i < nodes.length; i++) {
            const { children, title } = nodes[i];
            const hasChildren = children !== undefined && children.length > 0;
            nodesCopy[i] = { 
                title,
                children: hasChildren ? this.simplify(children) : undefined,
            };
        }
        return nodesCopy;
    }



    emptyDiskUsage(){
      const obj = this;
      if (obj.state.time_condition != ''){
        axios.post(setting_server.DB_SERVER+'/api/db/productlist', {
          req_type: "delete_product",
          user_id: this.props.userId,
          time: obj.state.time_condition
        })
        .then(function (response) {
          if (response['data']['success'] == true) {
            
          } else {
            console.log('Failed to empty disk ');
          }
          obj.getDiskUsage()
        })
        .catch(function (error){
          console.log(error);
        });
      }
    }



    getExchangeRate(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/exchangerate', {
        req_type: "get_exchange_rate",
        user_id: this.props.userId
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          let countryOptions = Object.keys(response['data']['result'][0][0])
              .map((code) => <option value={code}>{code}</option>);
          obj.setState({
            countryOptions: countryOptions,
            allExchangeRate: response['data']['result'][0][0], 
            country: Object.keys(response['data']['result'][0][0])[0],
            curExchangeRate: response['data']['result'][0][0][Object.keys(response['data']['result'][0][0])[0]],
            updateTime: response['data']['result'][0][1]
          });

          //obj.setState({ curExchangeRate:response['data']['result'][0][0], updateTime:response['data']['result'][0][1]});
          
        } else {
          console.log('Failed to update exchange rate');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }



    getDiskUsage(){
      const obj = this;
      axios.post(setting_server.DRIVER_UTIL_SERVER+'/api/driver/', {
        req_type: "get_disk_usage",
        path: obj.state.path
      })
      .then(function (response) {
        console.log('222222222222')
        console.log(response['data'])
        if (response['data']['success'] == true) {
          //{'Size': '3.6T', 'Used': '2.6T', 'Avail': '916G', 'Use%': '74%'}
          console.log(response['data']['result'])
          obj.setState({diskSize: response['data']['result']['Size'], diskUsed: response['data']['result']['Used'], diskAvail: response['data']['result']['Avail'], diskUsedPercentage: response['data']['result']['Use%']})
        } else {
          console.log('Failed to update disk usage');
        }
      })
      .catch(function (error){
        console.log('333333')
        console.log('Failed to update disk usage');
        console.log(error);
      });
    }




    updateExchangeRate(){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/exchangerate', {
        req_type: "update_exchange_rate",
        user_id: this.props.userId
      })
      .then(function (response) {
        console.log(response)
        if (response['data']['success'] == true) {
          obj.getExchangeRate()
        } else {
          console.log('Failed to update exchange rate');
          obj.createNotification('exchange_rate')
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

    getTargetSites(userId){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/targetsite', {
        req_type: "get_target_sites",
        user_id: userId
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          let targetSites = response['data']['result'];
          targetSites = targetSites.map(function(row, index){
            const id = row[0];
            const label = row[1];
            const url = row[2];
            const gateway = row[3];
            return {num: index+1, id: id, label: label, url: url, gateway: gateway};
          });
          obj.setState({targetSites: targetSites});
        } else {
          console.log('getTargetSites Failed');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

    getRate(userId) {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/tvrate', {
        req_type: "get_rate",
        user_id: userId
      })
      .then(function (response) {
        if (response['data']['success'] === true) {
          let tvRates = response['data']['result'];
          tvRates = tvRates.map(function(row, index){
            const id = row[0];
            const category = row[1];
            const trate = row[2];
            const vrate = row[3];
            return {num: index+1, id: id, category:category, tariff_rate: trate, vat_rate: vrate};
          });
          obj.setState({tvRates: tvRates});
        } else {
          console.log('Failed getRate');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }


    deleteRate() {
      let rateId = this.state.selectedRateId;
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/tvrate', {
        req_type: "delete_rate",
        id: rateId,
      })
      .then(function (response) {
        if (response['data']['success'] === true) {
          obj.getRate(obj.props.userId);
        } else {
          console.log('Faile to delet rate');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

    


    updateRate() {
      let rateId = this.state.selectedRateId
      let category = this.state.selectedCategory
      let trate = this.state.selectedTRate
      let vrate = this.state.selectedVRate
      const obj = this;
      if(String(category).trim() == '' || String(trate).trim()=='' || String(vrate).trim()==''){
        console.log('NNNNNNN')
        return;
      }
      axios.post(setting_server.DB_SERVER+'/api/db/tvrate', {
        req_type: "update_rate",
        id: rateId,
        category: category,
        tariff_rate: trate,
        vat_rate: vrate
      })
      .then(function (response) {
        if (response['data']['success'] === true) {
          obj.getRate(obj.props.userId);
        } else {
          console.log(response)
          console.log('Failed to update rate');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

    makeNewRate() {
      let userId = this.props.userId
      let category = this.state.selectedCategory
      let trate = this.state.selectedTRate
      let vrate = this.state.selectedVRate
      const obj = this;
      if(String(category).trim() == '' || String(trate).trim()=='' || String(vrate).trim()==''){
        console.log('NNNNNNN')
        return;
      }
      axios.post(setting_server.DB_SERVER+'/api/db/tvrate', {
        req_type: "add_rate",
        user_id: userId,
        category: category,
        tariff_rate: trate,
        vat_rate: vrate
      })
      .then(function (response) {
        if (response['data']['success'] === true) {
          obj.getRate(obj.props.userId);
        } else {
          console.log('Failed makeNewRate');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

    deleteTargetSite() {
      let tid = this.state.selectedTargetSiteId;
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/targetsite', {
        req_type: "delete_target_site",
        id: tid,
      })
      .then(function (response) {
        if (response['data']['success'] === true) {
          obj.getTargetSites(obj.props.userId);
        } else {
          console.log('Faile to delet rate');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

    addCategoryTree(tid){
      let userId = this.props.userId
      let nodes = []
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/categorytree', {
        req_type: "add_category_tree",
        user_id: userId,
        targetsite_id: tid,
        category_tree: JSON.stringify(obj.simplify(nodes)),
      })
      .then(function (response) {
        if (response['data']['success'] === true) {
        } else {
          console.log(response)
          console.log('Failed to add category tree');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

    makeNewTargetSite() {
      let userId = this.props.userId
      let label = this.state.selectedTargetSiteLabel
      let url = this.state.selectedTargetSiteUrl
      let gateway = this.state.selectedGateway
      const obj = this;
      if(String(label).trim() == '' || String(url).trim()=='' ||  String(gateway).trim()=='' ){
        console.log('NNNNNNN')
        return;
      }
      axios.post(setting_server.DB_SERVER+'/api/db/targetsite', {
        req_type: "make_new_target_site",
        user_id: userId,
        label: label,
        url: url,
        gateway: gateway
      })
      .then(function (response) {
        if (response['data']['success'] === true) {
          obj.getTargetSites(obj.props.userId);
          obj.addCategoryTree(response['data']['result'][0])
        } else {
          console.log(response)
          console.log('makeNewTargetSite Failed');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }


    updateTargetSite(){
      let tid = this.state.selectedTargetSiteId
      let label = this.state.selectedTargetSiteLabel
      let url = this.state.selectedTargetSiteUrl
      let gateway = this.state.selectedGateway
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/targetsite', {
        req_type: "edit_target_site",
        id: tid,
        label: label,
        url: url,
        gateway: gateway
      })
      .then(function (response) {
        if (response['data']['success'] === true) {
          obj.setState({
            selectedTargetSiteLabel: label,
            selectedTargetSiteUrl: url,
            selectedGateway: gateway
          }, obj.getTargetSites(obj.props.userId));
        } else {
          console.log('editTargetSite Failed');
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    }

    getDeliveryCompanies(userId){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/delivery', {
        req_type: "get_delivery_companies",
        user_id: userId
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          let deliveryCompanies = response['data']['result'];
          deliveryCompanies = deliveryCompanies.map(function(row, index){
            const id = row[0];
            const label = row[1];
            return {num: index+1, id: id, label: label};
          });
          obj.setState({deliveryCompanies: deliveryCompanies});
        } else {
          console.log('getDeliveryCompanies Failed');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

    makeNewDeliveryCompany() {
      let userId = this.props.userId;
      let label = this.state.selectedDeliveryCompanyLabel;
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/delivery', {
        req_type: "make_new_delivery_company",
        user_id: userId,
        label: label,
      })
      .then(function (response) {
        if (response['data']['success'] === true) {
          obj.getDeliveryCompanies(obj.props.userId);
        } else {
          console.log('makeNewDeliveryCompany Failed');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

    editDeliveryCompany(cid, label, url){
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/delivery', {
        req_type: "edit_delivery_company",
        id: cid,
        label: label,
      })
      .then(function (response) {
        if (response['data']['success'] === true) {
          obj.setState({
            selectedDeliveryCompanyLabel: label,
          }, obj.getDeliveryCompanies(obj.props.userId));
        } else {
          console.log('editDeliveryCompany Failed');
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    }

    componentDidMount(){
      this.getExchangeRate()
      this.getTargetSites(this.props.userId);
      this.getRate(this.props.userId);
      this.getDeliveryCompanies(this.props.userId);
      this.getDiskUsage()
    }

    render() {
        const obj = this;
        return (
          <Page.Card>
            <Page.Card 
              title={"Current Exchange Rate"}
              // RootComponent={Form}
            >
              <div class='row' style={{width:'100%'}}>

                <label style = {{marginLeft: '2%', marginTop:'0.5%', width:'50%'}}>
                 Exchange Rate: {this.state.curExchangeRate} 
                </label>
                <select
                  class="form-control"
                  style={{width:"8%", float: 'right', marginLeft:'40%'}}
                  value={this.state.country}
                  onChange={this.updateCountry}
                  ref={ref => this.country = ref}
                >
                  {this.state.countryOptions}
                </select>

              </div>
              <div class = 'row' style = {{width:'100%'}}>
                <label style = {{ marginLeft: '2%', width:'50%'}}>
                Update Time(in KB Financial Group): {this.state.updateTime}
                </label>
                <OverlayTrigger
                  placement="left"
                  delay={{ show: 250, hide: 400 }}
                  overlay={
                    <Tooltip>
                      Get exchange rate <br/> from KB financial group
                    </Tooltip>
                  }
                >
                  <Button color="secondary" style = {{marginLeft:'40%', width:'8%',float:'right'}}
                    onClick={() => {
                            this.setState({updateExchangeRateModalShow: true})
                     //this.updateExchangeRate()
                    }}
                  >
                  Update
                  </Button>
                </OverlayTrigger>

              </div>

          </Page.Card>


          <Page.Card 
            title={"Target Site Registration"}
            // RootComponent={Form}
          >
            <ReactTable
              data = {this.state.targetSites}
              getTdProps={(state, rowInfo, column, instance) => {
                if(rowInfo){
                  if(this.state.selectedTargetSiteIndex !== null){ // When you click a row not at first.
                    return {
                      onClick: (e) => {
                        this.setState({
                          selectedTargetSiteIndex: rowInfo.index,
                          selectedTargetSiteId: rowInfo.original['id'],
                          selectedTargetSiteLabel: rowInfo.original['label'],
                          selectedTargetSiteUrl: rowInfo.original['url']
                        });
                      },
                      style: {
                        background: rowInfo.index === this.state.selectedTargetSiteIndex ? '#00ACFF' : null
                      }
                    }
                  }
                  else { // When you click a row at first.
                    return {
                      onClick: (e) => {
                        this.setState({
                          selectedTargetSiteIndex: rowInfo.index,
                          selectedTargetSiteId: rowInfo.original['id'],
                          selectedTargetSiteLabel: rowInfo.original['label'],
                          selectedTargetSiteUrl: rowInfo.original['url']
                        }, () => {console.log('update!'); console.log(this.state.selectedTargetSiteId)});
                      }
                    }
                  }
                }
                else{
                  if(this.state.selectedTargetSiteIndex !== null){ // When you click a row not at first.
                    //console.log(rowInfo) 
                    return {
                      onClick: (e) => {
                        this.setState({
                          selectedTargetSiteIndex: rowInfo.index,
                          selectedTargetSiteId: rowInfo.original['id'],
                          selectedTargetSiteLabel: rowInfo.original['label'],
                          selectedTargetSiteUrl: rowInfo.original['url']
                        });
                      }
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
                  width: 150,
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
                  Header: "Gateway",
                  resizable: false,
                  accessor: "gateway",
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
                height: "250px"
              }}
              className="-striped -highlight"
            />
            <div class='row' style={{marginLeft:'35%',width:'65%', marginTop:'20px'}}>
              <label style={{marginTop:'8px', width:'11%'}}> Target site :</label>
              <input name="target_site" class="form-control" type='text' style={{width:"37%"}} value={this.state.selectedTargetSiteLabel} onChange={e => this.onTodoChange('selectedTargetSiteLabel',e.target.value)} />
              <label style={{marginTop:'8px', marginLeft: '5%', width:'10%', float:'right'}}> Gateway :</label>
              <input name="gateway" class="form-control" style={{width:"37%", float:'right'}} value={this.state.selectedGateway} onChange={e => this.onTodoChange('selectedGateway',e.target.value)} />
            </div>
            <div class='row' style={{marginLeft:'35%',width:'65%', marginTop:'20px'}}>
              <label style={{marginTop:'8px',width:'11%'}}> URL :</label>
              <input name="target_url" class="form-control" style={{width:"89%"}} value={this.state.selectedTargetSiteUrl} onChange={e => this.onTodoChange('selectedTargetSiteUrl',e.target.value)} />
            </div>
            <div class='row' style={{marginTop:'20px', float:'right'}}>
              <Button color="primary" style = {{marginLeft: '10px', width:'77px'}} 
                onClick={() => {
                 this.makeNewTargetSite()
                }}
              >
              Add
              </Button>
              <Button color="secondary" style = {{marginLeft:'10px', width:'77px'}}
                onClick={() => {
                 this.updateTargetSite()
                }}
              >
              Update
              </Button>
              <Button color="secondary" style = {{marginLeft:'10px', width:'77px'}}
                onClick={() => {
                 this.deleteTargetSite()
                }}
              >
              Delete
              </Button>
            </div>
          </Page.Card>
          <Page.Card 
            title={"Tariff / VAT rate Registration"}
            // RootComponent={Form}
          >
            <ReactTable
              data = {this.state.tvRates}
              getTdProps={(state, rowInfo, column, instance) => {
                if (rowInfo) {
                  if(this.state.selectedRateIndex !== null){ // When you click a row not at first.
                    return {
                      onClick: (e) => {
                        this.setState({
                          selectedRateIndex: rowInfo.index,
                          selectedRateId: rowInfo.original['id'],
                          selectedCategory: rowInfo.original['category'],
                          selectedTRate: rowInfo.original['tariff_rate'],
                          selectedVRate: rowInfo.original['vat_rate']
                        }, () => {console.log('update!'); console.log(this.state.selectedRateId)});
                      },
                      style: {
                        background: rowInfo.index === this.state.selectedRateIndex ? '#00ACFF' : null
                      }
                    }
                  }
                  else { // When you click a row at first.
                    return {
                      onClick: (e) => {
                        this.setState({
                          selectedRateIndex: rowInfo.index,
                          selectedRateId: rowInfo.original['id'],
                          selectedCategory: rowInfo.original['category'],
                          selectedTRate: rowInfo.original['tariff_rate'],
                          selectedVRate: rowInfo.original['vat_rate']
                        }, () => {console.log('update!'); console.log(this.state.selectedRateId)});
                      }
                    }
                  }
                }
                return{}
              }}
              columns={[
                {
                  Header: "No.",
                  width: 150,
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
                  Header: "Tariff rate",
                  resizable: false,
                  accessor: "tariff_rate",
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
                  Header: "VAT rate",
                  resizable: false,
                  accessor: "vat_rate",
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
                height: "250px"
              }}
              className="-striped -highlight"
            />
            <div class='row' style={{marginLeft:'20%',width:'80%', marginTop:'20px',float:'right'}}>
              <label style={{marginTop:'8px', marginLeft: '15px', width:'15%'}}> Category :</label>
              <input name="category" class="form-control" style={{width:"16.2%"}} value={this.state.selectedCategory} onChange={e => this.onTodoChange('selectedCategory',e.target.value)} />
              <label style={{marginTop:'8px', marginLeft: '15px', width:'15%'}}> Tariff rate :</label>
              <input name="tariff_rate" class="form-control" style={{width:"16.2%"}} value={this.state.selectedTRate} onChange={e => this.onTodoChange('selectedTRate',e.target.value)} />
              <label style={{marginTop:'8px', marginLeft: '15px', width:'15%'}}> VAT rate :</label>
              <input name="vat_rate" class="form-control" style={{width:"16%"}} value={this.state.selectedVRate} onChange={e => this.onTodoChange('selectedVRate',e.target.value)} />
            </div>
            <div class='row' style={{width:'100%', marginTop:'20px', float:'right'}}>
            <a style={{marginLeft:'83%',float:'right'}}href='https://search.naver.com/search.naver?sm=top_sug.pre&fbm=0&acr=1&acq=%EA%B4%80%EB%B6%80%EA%B0%80%EC%84%B8&qdt=0&ie=utf8&query=%EA%B4%80%EB%B6%80%EA%B0%80%EC%84%B8+%EA%B3%84%EC%82%B0%EA%B8%B0' target="_blank">Tariff / VAT Reference Site</a>
            </div>
            <div class='row' style={{marginTop:'20px', float:'right'}}>
              <Button color="primary" style = {{marginLeft: '10px', width:'77px'}} 
                onClick={() => {
                 this.makeNewRate()
                }}
              >
              Add
              </Button>
              <Button color="secondary" style = {{marginLeft:'10px', width:'77px'}}
                onClick={() => {
                 this.updateRate()
                }}
              >
              Update
              </Button>
              <Button color="secondary" style = {{marginLeft:'10px', width:'77px'}}
                 onClick={() => {
                   this.deleteRate()
                 }}
              >
              Delete
              </Button>
            </div>
          </Page.Card>


          <Page.Card 
            title={"Delivery Company Registration"}
            // RootComponent={Form}
          >
            <ReactTable
              data = {this.state.deliveryCompanies}
              getTdProps={(state, rowInfo, column, instance) => {
                if (rowInfo) {
                  if(this.state.selectedDeliveryCompanyIndex !== null){ // When you click a row not at first.
                    return {
                      onClick: (e) => {
                        this.setState({
                          selectedDeliveryCompanyIndex: rowInfo.index,
                          selectedDeliveryCompanyId: rowInfo.original['id'],
                          selectedDeliveryCompanyLabel: rowInfo.original['label'],
                        });
                      },
                      style: {
                        background: rowInfo.index === this.state.selectedDeliveryCompanyIndex ? '#00ACFF' : null
                      }
                    }
                  }
                  else { // When you click a row at first.
                    return {
                      onClick: (e) => {
                        this.setState({
                          selectedDeliveryCompanyIndex: rowInfo.index,
                          selectedDeliveryCompanyId: rowInfo.original['id'],
                          selectedDeliveryCompanyLabel: rowInfo.original['label'],
                        }, () => {console.log('update!'); console.log(this.state.selectedDeliveryCompanyId)});
                      }
                    }
                  }
                }
                return{}
              }}
              columns={[
                {
                  Header: "No.",
                  width: 150,
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
                  Header: "Delivery Company",
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
            <div class='row' style={{marginLeft:'60%',width:'40%', marginTop:'20px',float:'right'}}>
              <label style={{marginTop:'8px', marginLeft: '15px', width:'40%'}}> Delivery Company :</label>
              <input name="vat_rate" class="form-control" style={{width:"53%"}} value={this.state.selectedDeliveryCompanyLabel} onChange={e => this.onTodoChange('selectedDeliveryCompanyLabel',e.target.value)} />
            </div>
            <div class='row' style={{marginTop:'20px', float:'right'}}>
              <Button color="primary" style = {{marginLeft: '10px', width:'77px'}} 
                onClick={() => {
                 this.makeNewDeliveryCompany()
                }}
              >
                Add
              </Button>
              <Button
                color="secondary" 
                style = {{marginLeft: '10px', width:'77px'}}
                onClick={() => {
                  console.log(this.state.selectedDeliveryCompanyId)
                  if(this.state.selectedDeliveryCompanyId > -1){
                    this.setState({editDeliveryCompanyModalShow: true});
                  }
                  else{
                    this.createNotification('warning')
                  }
                }}
              >
                Edit
              </Button>
            </div>
          </Page.Card>

          <Page.Card 
            title={"Disk Usage (" +this.state.path+")" }
            // RootComponent={Form}
          >
            <label style = {{marginLeft: '2%', marginTop:'0.5%', width:'15%'}}>
             Total Size: {this.state.diskSize}
            </label>
            <label style = {{marginLeft: '2%', marginTop:'0.5%', width:'15%'}}>
             Used: {this.state.diskUsed}
            </label>
            <label style = {{marginLeft: '2%', marginTop:'0.5%', width:'15%'}}>
             Avail: {this.state.diskAvail}
            </label>
            <label style = {{marginLeft: '2%', marginTop:'0.5%', width:'15%'}}>
             Avail(%): {this.state.diskUsedPercentage} 
            </label>

            <Button color="secondary" style = {{marginLeft:'10%', width:'8%',float:'right'}}
              onClick={() => {
                      this.getDiskUsage()
               //this.updateExchangeRate()
              }}
            >
            Update
            </Button>

            <Button color="secondary" style = {{marginLeft:'10%', width:'8%',float:'right',  height:'36px'}}
              onClick={() => {
                      this.emptyDiskUsage()
              }}
            >
            Empty
            </Button>
            <select
              class="form-control"
              style={{marginRight:'-9%', width:"23%", float: 'right' }}
              value={this.state.time_condition}
              onChange={this.updateTimeCondition}
              ref={ref => this.time_condition = ref}
            >
              <option value="" disabled selected>Select period</option>
              <option value="1">Keep data for the last 7 days</option>
              <option value="2">Keep data for the last 30 days</option>
              <option value="3">Keep data for the last 90 days</option>
            </select>



          </Page.Card>


          <EditDeliveryCompanyModal
            show={this.state.editDeliveryCompanyModalShow}
            setModalShow={(s) => this.setState({editDeliveryCompanyModalShow: s})}
            userId={this.props.userId}
            selectedDeliveryCompanyId = {this.state.selectedDeliveryCompanyId}            
          />

          <UpdateExchangeRateModal
            show={this.state.updateExchangeRateModalShow}
            updateExchangeRate={this.updateExchangeRate}
            setModalShow={this.setUpdateExchangeRateModalShow}
          />
        </Page.Card>
        );
    }
}
export default ConfigTab;
