// @flow

import * as React from "react";
import { Button, Form } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import TreeNode from "../config-category-tree-node";
import ControlPanel from "../control-panel";
import TextView from "../text-view";
import "./tree.css";
import axios from 'axios';
import setting_server from '../../../setting_server';
import SelectTPModal from "./SelectTransformationProgramModal";
import SelectGatewayConfigModal from "./SelectGatewayConfigModal";
import SelectRateModal from "./SelectRateModal";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { 
  ModalHeader,
  ModalBody,
}  from 'reactstrap';
import {Modal as SModal} from 'reactstrap';

class UpdateTargetSiteAndPricingInfoModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.initState();
        this.changeTitle = this.changeTitle.bind(this);
        this.selectCategoryNode = this.selectCategoryNode.bind(this);
        this.doubleClickCategoryNode = this.doubleClickCategoryNode.bind(this);
        this.addRootElement = this.addRootElement.bind(this);
        this.addChild = this.addChild.bind(this);
        this.checkRemove = this.checkRemove.bind(this);
        this.removeNode = this.removeNode.bind(this);
        this.saveState = this.saveState.bind(this);
        this.loadState = this.loadState.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.nodesToString = this.nodesToString.bind(this);
        this.changeDateFormat = this.changeDateFormat.bind(this);
        this.selectRate = this.selectRate.bind(this);
        this.saveTP = this.saveTP.bind(this);
        this.saveGatewayConfiguration = this.saveGatewayConfiguration.bind(this);
        this.updateDC = this.updateDC.bind(this)
    }
    closeCurrentModal(){
        console.log('Close')
        this.props.setModalShow(false)
    }


   createNotification = (type) => {
      switch (type) {
        case 'warning':
            NotificationManager.warning('Target site & category are already registered','WARNING',  3000);
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



   onChange = date => this.setState({ date_psql: this.changeDateFormat(date) })



   clickSelectTPModal(){
    this.setState({showSelectTPModal: true})
   }

   clickSelectGatewayConfigModal(){
    this.setState({showSelectGatewayConfigModal: true})
   }
   clickSelectRateModal(){
    this.setState({showSelectRateModal: true})
   }

   selectRate(val1, val2){
     this.setState({vatRate: val2, tariffRate: val1})
   }

   onTodoChange(key,value){
     this.setState({
       [key]: value
     });
   }


    saveGatewayConfiguration(c, cid){
      this.setState({        
        selected_configuration: c,
        selected_configuration_id: cid
      })
    }

    saveTP(p, pid){
      this.setState({        
        selected_transformation_program: p,
        selected_transformation_program_id: pid
      })
    }
    getDeliveryCompanies(){
      let userId = this.props.userId;
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/delivery', {
        req_type: "get_delivery_companies",
        user_id: userId
      })
      .then(function (response) {
        if (response['data']['success'] == true) {
          let deliveryCompanyOptions = response['data']['result']
              .map((code) => <option value={code['1']}>{code['1']}</option>);
          obj.setState({
            deliveryCompanyOptions: deliveryCompanyOptions,
            deliveryCompany: '-1',
          });
          console.log(deliveryCompanyOptions)
          console.log(response['data']['result'][0])
          console.log(response['data']['result'][0][1])
        } else {
          console.log('getDeliveryCompanies Failed');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }

   updateDC(event) {
     console.log(event.target.value)
     this.setState({deliveryCompany: event.target.value});
   }


   checkIsNull(value){
      if(value == 0 || value == '0'){
        return '0'
      }
      else if(value == null || !value || typeof value === undefined ){
        return ''
      }
      else{
        return value
      }
   }



   registerTargetSite(){
     const obj = this;
     console.log(obj.state)
     axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
       req_type: "register_target_site",
       job_id: obj.props.JobId,
       targetsite_id: this.checkIsNull(obj.state.selectedTargetSiteId),
       targetsite_label: this.checkIsNull(obj.state.selectedTargetSiteLabel),
       targetsite_url: this.checkIsNull(obj.state.selectedTargetSiteUrl),
       t_category: this.checkIsNull(obj.state.selected_category_title),
       transformation_program_id: this.checkIsNull(obj.state.selected_transformation_program_id),
       cid: this.checkIsNull(obj.state.selected_configuration_id) == '' ? -999 : this.checkIsNull(obj.state.selected_configuration_id),
       cnum: this.checkIsNull(obj.state.selected_category_num) == '' ? -999 : this.checkIsNull(obj.state.selected_category_num),
       exchange_rate: this.checkIsNull(obj.state.exchangeRate) == ''? -999 : this.checkIsNull(obj.state.exchangeRate),
       margin_rate: this.checkIsNull(obj.state.marginRate) == ''? -999 : this.checkIsNull(obj.state.marginRate),
       tariff_threshold: this.checkIsNull(obj.state.tariffThreshold) == ''? -999 : this.checkIsNull(obj.state.tariffThreshold),
       minimum_margin: this.checkIsNull(obj.state.minMargin) == ''? -999 : this.checkIsNull(obj.state.minMargin),
       tariff_rate: this.checkIsNull(obj.state.tariffRate) == ''? -999 : this.checkIsNull(obj.state.tariffRate),
       vat_rate: this.checkIsNull(obj.state.vatRate) == ''? -999 : this.checkIsNull(obj.state.vatRate),
       default_weight: this.checkIsNull(obj.state.defaultWeight) == ''? -999 : this.checkIsNull(obj.state.defaultWeight),
       max_items: this.checkIsNull(obj.state.maxItems) == ''? -999 : this.checkIsNull(obj.state.maxItems),
       delivery_company: this.checkIsNull(obj.state.deliveryCompany),
     })
     .then(function (response) {
       if (response['data']['success'] == true) {
         if (response['data']['result'] == false) {
           obj.createNotification('warning')
         }
         else{
           obj.props.getRegisteredTargetSites()
           obj.closeCurrentModal() 
         }
       } else {
         console.log('getRegisteredTargetSites Failed');
       }
     })
     .catch(function (error){
       console.log(error);
     });
   }

   initPricingInformation(){
     this.setState({tariffRate: '', vatRate: '', tariffThreshold: '', marginRate: '', minMargin: '', defaultWeight: ''})
     this.setState({
       t_category: '',
       transformation_program_id: '',
       cid: '', 
       cnum: '',
       exchange_rate:  '',
       margin_rate: '', 
       tariff_threshold: '',
       minimum_margin: '', 
       tariff_rate: '',
       vat_rate: '',
       default_weight: '',
       delivery_company: '',
       maxItems: ''
     })
   }

   getTargetSites(userId){
      console.log('?????????')
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/targetsite', {
        req_type: "get_target_sites",
        user_id: userId
      })
      .then(function (response) {
        console.log(response)
        if (response['data']['success'] == true) {
          let targetSites = response['data']['result'];
          targetSites = targetSites.map(function(row, index){
            const id = row[0];
            const label = row[1];
            const url = row[2];
            return {num: index+1, id: id, label: label, url: url};
          });
          console.log(targetSites)
          for(var idx in targetSites){
             console.log(targetSites[idx]['id'])
             console.log(obj.props.selectedRegisteredTargetSiteId)
             if(targetSites[idx]['id'] == obj.props.selectedRegisteredTargetSiteId){
                obj.setState({
                  selectedTargetSiteId: targetSites[idx]['id'],
                  selectedTargetSiteLabel: targetSites[idx]['label'],
                  selectedTargetSiteUrl: targetSites[idx]['url'],
                },() => {obj.getCategoryTreeWithSelection()})
             }
          }
          obj.setState({targetSites: targetSites});
          
          
        } else {
          console.log('getTargetSites Failed');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }


   changeDateFormat(date){
   
    var year = date.getFullYear();            
    var month = (1 + date.getMonth());        
    month = month >= 10 ? month : '0' + month;
    var day = date.getDate();                 
    day = day >= 10 ? day : '0' + day;        
    var hour = date.getHours().toString().padStart(2,'0');
    var minute = date.getMinutes().toString().padStart(2,'0');
    var sec = date.getSeconds().toString().padStart(2,'0');
    return  year + '-' + month + '-' + day;
    //return  year + '-' + month + '-' + day +' ' + hour + ':' + minute + ':' +sec;
   }

    initState(){
      let curUrl = window.location.href;
      return {
        nodes:[],
        savedNodes: [],
        selected_category_id: "",
        selected_category_title: "",
        check_modal: false,
        id: "",
        selectedTargetSiteIndex: null,
        selectedTargetSiteId: -1,
        selectedTargetSiteLabel: null,
        selectedTargetSiteUrl: null,
        showSelectDeliveryCompanyModal: false,
        selectedDeliveryCompany: '',
        exchangeRate: '',
        deliveryCompany: '',
        deliveryCompanyOptions: '',
        maxItems: -1
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
          //obj.setState({exchangeRate :response['data']['result'][0][0]});
          obj.setState({exchangeRate :response['data']['result'][0][0][obj.props.country[0]]});
          
        } else {
          console.log('Failed to update exchange rate');
        }

      })
      .catch(function (error){
        console.log(error);
      });


    }

    closeModal(modal) {
      this.setState({
          [modal]: false
          });
    }
    showModal(modal, id) {
      this.setState({
          [modal]: true,
          id: id
          });
    }
   
    checkRemove(id) {
      console.log('Check')
      return () =>{
        this.showModal('confirm_modal',id)
      }
    }



    loadPricingInformation(){
      const obj = this;

      axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
        req_type: "load_pricing_information",
        job_id: obj.props.JobId,
        targetsite_id: obj.props.selectedRegisteredTargetSiteId,
        t_category: obj.props.tCategory, 
      })
      .then(function (response) {
        console.log(response)
        if (response['data']['success'] == true) {
//exchange_rate float, tariff_rate float, vat_rate float, tariff_threshold float, margin_rate float, min_margin float, delivery_company varchar(2048), default_weight float
          let exchange_rate = response['data']['result'][0][0] == -999 ? '' : response['data']['result'][0][0]
          let tariff_rate  = response['data']['result'][0][1] == -999 ? '' : response['data']['result'][0][1]
          let vat_rate = response['data']['result'][0][2] == -999 ? '' : response['data']['result'][0][2]
          let tariff_threshold = response['data']['result'][0][3] == -999 ? '' : response['data']['result'][0][3]
          let margin_rate = response['data']['result'][0][4] == -999 ? '' : response['data']['result'][0][4]
          let min_margin = response['data']['result'][0][5] == -999 ? '' : response['data']['result'][0][5]
          let delivery_company = response['data']['result'][0][6]
          let default_weight  = response['data']['result'][0][7] == -999 ? '' : response['data']['result'][0][7]
          let max_items  = response['data']['result'][0][11] == -999 ? '' : response['data']['result'][0][11]
          obj.setState({exchangeRate: exchange_rate, tariffRate: tariff_rate, vatRate: vat_rate, tariffThreshold: tariff_threshold, marginRate: margin_rate, minMargin: min_margin, deliveryCompany: delivery_company, defaultWeight: default_weight, maxItems: max_items})
        }
        else{
          obj.initPricingInformation()
        }
      })
      .catch(function (error){
        console.log(error);
      });

    }

    selectPricingInformation(){
      const obj = this;
      console.log(obj)
      axios.post(setting_server.DB_SERVER+'/api/db/jobproperties', {
        req_type: "load_pricing_information",
        job_id: obj.props.JobId,
        targetsite_id: obj.state.selectedTargetSiteId,
        t_category: obj.state.selected_category_title, 
      })
      .then(function (response) {
        console.log(response)
        if (response['data']['success'] == true) {
//exchange_rate float, tariff_rate float, vat_rate float, tariff_threshold float, margin_rate float, min_margin float, delivery_company varchar(2048), default_weight float
          if (response['data']['result'].length == 0){
            obj.setState({exchangeRate: '', tariffRate: '', vatRate: '', tariffThreshold: '', marginRate: '', minMargin: '', defaultWeight: '', selected_category_num: '', selected_transformation_program_id: '', selected_configuration_id: ''})
            obj.getExchangeRate()
          }
          else{
            let exchange_rate = response['data']['result'][0][0] == -999 ? '' : response['data']['result'][0][0]
            let tariff_rate  = response['data']['result'][0][1] == -999 ? '' : response['data']['result'][0][1]
            let vat_rate = response['data']['result'][0][2] == -999 ? '' : response['data']['result'][0][2]
            let tariff_threshold = response['data']['result'][0][3] == -999 ? '' : response['data']['result'][0][3]
            let margin_rate = response['data']['result'][0][4] == -999 ? '' : response['data']['result'][0][4]
            let min_margin = response['data']['result'][0][5] == -999 ? '' : response['data']['result'][0][5]
            let delivery_company = response['data']['result'][0][6]
            let default_weight  = response['data']['result'][0][7] == -999 ? '' : response['data']['result'][0][7]
            let cnum  = response['data']['result'][0][8] == -999 ? '' : response['data']['result'][0][8]
            let transformation_program_id  = response['data']['result'][0][9] == -999 ? '' : response['data']['result'][0][9]
            let cid  = response['data']['result'][0][10] == -999 ? '' : response['data']['result'][0][10]
            let max_items  = response['data']['result'][0][11] == -999 ? '' : response['data']['result'][0][11]
            obj.setState({exchangeRate: exchange_rate, tariffRate: tariff_rate, vatRate: vat_rate, tariffThreshold: tariff_threshold, marginRate: margin_rate, minMargin: min_margin, deliveryCompany: delivery_company, defaultWeight: default_weight, selected_category_num: cnum,selected_transformation_program_id: transformation_program_id, selected_configuration_id: cid, maxItems: max_items})
          }
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }



    getCategoryTreeWithSelection(){
        this.initPricingInformation()
        if (this.state.selectedTargetSiteId == null){
          return;
        }
        let tid = this.state.selectedTargetSiteId
        let userId = this.props.userId
        console.log(this.props)
        const obj = this;
        axios.post(setting_server.DB_SERVER+'/api/db/categorytree', {
            req_type: "get_category_tree",
            user_id: userId,
            targetsite_id: tid
        })
        .then(function (resultData) {
            let output = resultData['data']['output']
            if(output){
              let category_tree = JSON.parse(output[0])
              obj.setState({
                  nodes: obj.initializedСopy(category_tree),
              })
            }
            else{
              obj.setState({
                  nodes: []
              })
            }
            obj.loadPricingInformation()
        })
        .catch(function (error) {
            console.log(error);
        });

    }

    getCategoryTree() {
        this.initPricingInformation()
        if (this.state.selectedTargetSiteId == null){
          return;
        }
        console.log(this.props)
        let tid = this.state.selectedTargetSiteId
        let userId = this.props.userId
        const obj = this;
        axios.post(setting_server.DB_SERVER+'/api/db/categorytree', {
            req_type: "get_category_tree",
            user_id: userId,
            targetsite_id: tid
        })
        .then(function (resultData) {
            let output = resultData['data']['output']
            if(output){
              let category_tree = JSON.parse(output[0])
              obj.setState({
                  nodes: obj.initializedСopy(category_tree),
                  selected_category_title: ''
              })
            }
            else{
              obj.setState({
                  nodes: []
              })
            }
        })
        .catch(function (error) {
            console.log(error);
        });

    }

    updateCategoryTree() {
        let tid = this.state.selectedTargetSiteId
        const obj = this;
        axios.post(setting_server.DB_SERVER+'/api/db/categorytree', {
            req_type: "update_category_tree",
            category_tree: JSON.stringify(this.simplify(this.state.nodes)),
            targetsite_id: tid
        })
        .then(function (resultData) {
        })
        .catch(function (error) {
            console.log(error);
        });

    }


    initializedСopy(nodes, location) {
        const nodesCopy = [];
        for (let i = 0; i < nodes.length; i++) {
            const { children, title } = nodes[i];
            const hasChildren = children !== undefined;
            const id = location ? `${location}.${i + 1}` : `${i + 1}`;
            nodesCopy[i] = { 
                    children: hasChildren ? this.initializedСopy(children, id) : undefined,
                    changeTitle: this.changeTitle(id),
                    selectCategoryNode: this.selectCategoryNode(id),
                    doubleClickCategoryNode: this.doubleClickCategoryNode(id),
                    checkRemove: this.checkRemove(id),
                    removeNode: this.removeNode(id),
                    addChild: this.addChild(id),
                    id,
                    title,
            };
        }
        return nodesCopy;
    }

    changeTitle(id) {
        return (newTitle) => {
            id = id.split(".").map((str) => parseInt(str));
            const nodes = this.initializedСopy(this.state.nodes);
            let changingNode = nodes[id[0] - 1];

            if (id.length > 1) {
                for (let i = 1; i < id.length; i++) {
                    changingNode = changingNode.children[id[i] - 1];
                }
            }

            changingNode.title = newTitle;
            this.setState({ nodes });
        };
    }




    getRateUsingCategory() {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/tvrate', {
        req_type: "get_rate_using_category",
        user_id: obj.props.userId,
        category: obj.state.selected_category_title
      })
      .then(function (response) {
        console.log(response)
        if (response['data']['success'] === true) {
          let result = response['data']['result'];
          obj.setState({
            tariffRate: result[0][1],
            vatRate: result[0][2],
          });
        } else {
          console.log('Failed getRate');
        }
      })
      .catch(function (error){
        console.log(error);
      });
    }


    doubleClickCategoryNode(id) {
        var obj = this;
        return (title) => {
            obj.setState({
                selected_category_id: id,   
                selected_category_title: title
            }, () => {this.clickSelectRateModal()});
        };
    }


    selectCategoryNode(id) {
        var obj = this;
        return (title) => {
            obj.setState({
                selected_category_id: id,   
                selected_category_title: title
            }, () => {this.selectPricingInformation(); });
        };
    }
    addRootElement() {
        var obj = this;
        const id = obj.state.nodes.length ? `${obj.state.nodes.length + 1}` : "1";
        const newNode = { 
            children: undefined,
            changeTitle: obj.changeTitle(id),
            selectCategoryNode: obj.selectCategoryNode(id),
            doubleClickCategoryNode: obj.doubleClickCategoryNode(id),
            checkRemove: obj.checkRemove(id),
            removeNode: obj.removeNode(id),
            addChild: obj.addChild(id),
            id,
            title: "",
        };
        
        const nodes = [...obj.state.nodes, newNode];
        obj.setState({ nodes });
    }

    addChild(id) {
        return () => {
            id = id.split(".").map((str) => parseInt(str));
            const nodes = this.initializedСopy(this.state.nodes);
            let changingNode = nodes[id[0] - 1];

            if (id.length > 1) {
                for (let i = 1; i < id.length; i++) {
                    changingNode = changingNode.children[id[i] - 1];
                }
            }

            if (changingNode.children === undefined) {
                changingNode.children = [];
            }
            
            id = `${id.join(".")}.${changingNode.children.length + 1}`;

            changingNode.children = [
                ...changingNode.children,
                { 
                    children: undefined,
                    changeTitle: this.changeTitle(id),
                    selectCategoryNode: this.selectCategoryNode(id),
                    doubleClickCategoryNode: this.doubleClickCategoryNode(id),
                    checkRemove: this.checkRemove(id),
                    removeNode: this.removeNode(id),
                    addChild: this.addChild(id),
                    id,
                    title: "",
                }];

            this.setState({ nodes });
        }
    }

    
    removeNode(id) {
        return () => {
            id = id.split(".").map((str) => parseInt(str));
            const nodes = this.initializedСopy(this.state.nodes);
            if (id.length === 1) {
                const newNodes = [
                    ...nodes.slice(0, [id[0] - 1]),
                    ...nodes.slice(id[0])
                ];

                this.setState( { nodes: this.initializedСopy(newNodes) } );
            } else {
                let changingNode = nodes[id[0] - 1];
                for (let i = 2; i < id.length; i++) {
                    changingNode = changingNode.children[id[i - 1] - 1];
                }

                const index = id[id.length - 1] - 1;

                const newChildren = [
                    ...changingNode.children.slice(0, index),
                    ...changingNode.children.slice(index + 1),
                ];
                changingNode.children = newChildren;

                this.setState({ nodes: this.initializedСopy(nodes) });
            }
            this.closeModal('confirm_modal')
        }
    }

    saveState() {
        this.setState({ savedNodes: this.initializedСopy(this.state.nodes) });
    }

    loadState() {
        this.setState({ nodes: this.initializedСopy(this.state.savedNodes) });
    }

    onTextChange(e) { 
        this.setState({ nodes: this.initializedСopy(JSON.parse(e.target.value)) });
    }

    nodesToString() {
        return JSON.stringify(this.simplify(this.state.nodes), undefined, 2);
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
    
    componentWillReceiveProps(nextProps) {
      console.log(this.props.selectedRegisteredTargetSiteId)
      console.log('11111??????')
      this.getTargetSites(this.props.userId);
    }

  
    componentDidMount(){
      console.log(this.props)
      this.getExchangeRate()
      //this.getTargetSites(this.props.userId);
      this.getDeliveryCompanies();
    }

    render() {
        const { nodes, savedNodes } = this.state;
        const { addRootElement, saveState, 
                loadState, onTextChange, nodesToString} = this;
        const hasSaved = savedNodes.length !== 0;
        return (
            <Modal
                {...this.props}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={ () => {
                    this.props.setModalShow(false);
                }}
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Register Target site and Pricing Information
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="VMTree">
                  <div className="VMTree-LeftSide">
                    <label for="name"  style={{display: "flex",justifyContent: "center",alignItems: "center", fontWeight: "bold", fontSize:'20px'}}> Target Site </label>
                    <ReactTable
                      data = {this.state.targetSites}
                      getTdProps={(state, rowInfo, column, instance) => {
                        if(rowInfo){
                          if(this.state.selectedTargetSiteIndex !== null){ 
                            return {
                              onClick: (e) => {
                                this.setState({
                                  selectedTargetSiteIndex: rowInfo.index,
                                  selectedTargetSiteId: rowInfo.original['id'],
                                  selectedTargetSiteLabel: rowInfo.original['label'],
                                  selectedTargetSiteUrl: rowInfo.original['url']
                                }, () => {console.log(this.state.selectedTargetSiteId); this.getCategoryTreeWithSelection()});
                              },
                              style: {
                                background: rowInfo.original['id'] == this.state.selectedTargetSiteId ? '#00ACFF' : null
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
                                }, () => {console.log(this.state.selectedTargetSiteId); this.getCategoryTreeWithSelection()});
                              },
                              style: {
                                background: rowInfo.original['id'] == this.state.selectedTargetSiteId ? '#00ACFF' : null
                              }
                            }
                          }
                        }
                        else{
                          if(this.state.selectedTargetSiteIndex !== null){ // When you click a row not at first.
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
                      ]}
                      minRows={6}
                      defaultPageSize={1000}
                      showPagination ={false}
                      bordered = {false} 
                      style={{
                        height: "280px"
                      }}
                      className="-striped -highlight"
                    />
                  </div>
                  <div className="VMTree-RightSide">
                    <label for="name"  style={{display: "flex",justifyContent: "center",alignItems: "center", fontWeight: "bold", fontSize:'20px'}}> Target Site Category</label>
                    <div>
                      <Button 
                          class="btn btn-outline-dark"
                          type="button"
                          onClick={addRootElement}
                          style={{marginLeft:"30px", width:"100px"}}
                      >
                          Add Root
                      </Button>
                      <Button 
                          class="btn btn-outline-dark"
                          type="button"
                          onClick={() => {this.updateCategoryTree()}}
                          style={{marginLeft:"30px", width:"100px"}}
                      >
                          Update
                      </Button>
                    </div>
                    <ul className="Nodes" style={{marginTop:"5px",overflow:'auto',width:'100%',height:'150px'}}>
                      { nodes.map((nodeProps) => {
                        const { id, ...others } = nodeProps;
                        return (
                          <TreeNode 
                            key={id}
                            {...others}
                          />
                        );}) }
                    </ul>
                    <label style={{marginLeft:'10%', marginTop:'2%', width:"90%", fontWeight:'600'}} >
                      <div class = 'row' style = {{width:'100%'}}>
                        <label style={{marginTop:'1.4%'}}>
                        Category:
                        </label>
                        <input readonly='readonly' name="selected_Category" class="form-control"style={{width:"50%", marginLeft:'20%'}} value= {this.state.selected_category_title } />
                      </div>
                    </label>
                    <label style={{marginLeft:'10%', marginTop:'2%', width:"90%", fontWeight:'600'}} >
                      <div class = 'row' style = {{width:'100%'}}>
                        <label style={{marginTop:'1.4%'}}>
                        Category number: 
                        </label>
                        <input type='integer'class="form-control"style={{width:"50%", marginLeft:'3.3%', float:'right'}} value= {this.state.selected_category_num }  onChange={e => this.onTodoChange('selected_category_num',e.target.value)}/>
                      </div>
                    </label>
                  </div>

                </div>
                <div style={{borderBottom: '1px solid rgba(0, 0, 0, 0.09)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)', marginRight:'-20px', marginLeft:'-20px', marginTop:'30px'}}>
                </div>
                <div style={{marginTop:'20px'}}>
                  <label for="name"  style={{display: "flex",justifyContent: "center",alignItems: "center", fontWeight: "bold", fontSize:'20px'}}> Pricing information </label>
                  <div class='row' style = {{marginTop:'2%'}}>
                    <div class='col-sm-6'>
                      <div class='row'>
                        <div class='row' style={{width:'49%', marginLeft:'1%'}}>
                          <label style={{marginTop:'8px', marginLeft: '3%', width:'50%'}}> Exchange rate :</label>
                          <input name="name" class="form-control" style={{marginLeft:'3%', width:"30%", float: 'right'}} value= {this.state.exchangeRate} onChange={e => this.onTodoChange('exchangeRate',e.target.value)}/>
                        </div>
                        <div class='row' style={{width:'49%'}}>
                          <label style={{marginTop:'8px', marginLeft: '2%', width:'50%'}}> Margin rate :</label>
                          <input name="name" class="form-control" style={{marginLeft:'3%', width:"30%", float: 'right'}} value= {this.state.marginRate} onChange={e => this.onTodoChange('marginRate',e.target.value)}/>
                        </div>
                      </div>

                      <div class='row'>
                        <div class='row' style={{width:'49%', marginLeft:'1%'}}>
                          <label style={{marginTop:'8px', marginLeft: '3%', width:'50%'}}> Tariff rate :</label>
                          <input  name="name" class="form-control" style={{marginLeft:'3%', width:"30%", float: 'right'}} value= {this.state.tariffRate} onChange={e => this.onTodoChange('tariffRate',e.target.value)}/>
                        </div>
                        <div class='row' style={{width:'49%'}}>
                          <label style={{marginTop:'8px', marginLeft: '2%', width:'50%'}}> VAT rate :</label>
                          <input  name="name" class="form-control" style={{marginLeft:'3%', width:"30%", float: 'right'}}value= {this.state.vatRate} onChange={e => this.onTodoChange('vatRate',e.target.value)}/>
                        </div>                     
                      </div>


                    </div>
                    <div class='col-sm-6'>

                      <div class='row'>
                        <div class='row' style={{width:'52%'}}>
                          <label style={{marginTop:'8px', marginLeft: '0%', width:'52%'}}> Tariff threshold ($) :</label>
                          <input name="name" class="form-control" style={{width:"45%", float: 'right'}}  value= {this.state.tariffThreshold} onChange={e => this.onTodoChange('tariffThreshold',e.target.value)}/>
                        </div>
                        <div class='row' style={{marginLeft: '3%', width:'46%'}}>
                          <label style={{marginTop:'8px', marginLeft: '2%', width:'54%'}}> Minimum margin :</label>
                          <input name="name" class="form-control"  style={{width:"40%", float: 'right'}} value= {this.state.minMargin} onChange={e => this.onTodoChange('minMargin',e.target.value)}/>
                        </div>
                      </div>

                      <div class='row'>
                        <div class='row' style={{width:'52%'}}>
                          <label style={{marginTop:'8px', marginLeft: '0px', width:'52%'}}> Delivery company :</label>
                          <select
                            class="form-control"
                            style={{width:"45%", float: 'right'}}
                            value={this.state.deliveryCompany}
                            onChange={this.updateDC}
                            ref={ref => this.deliveryCompany = ref}
                          >
                            <option value="-1" disabled selected>Select delivery company</option>
                            {this.state.deliveryCompanyOptions}
                          </select>

                        </div>
                        <div class='row' style={{marginLeft: '3%', width:'46%'}}>
                          <label style={{marginTop:'8px', marginLeft: '2%', width:'54%'}}> Default weight :</label>
                          <input class="form-control"  style={{width:"40%", float: 'right'}} value= {this.state.defaultWeight} onChange={e => this.onTodoChange('defaultWeight',e.target.value)}/>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
                <div style={{borderBottom: '1px solid rgba(0, 0, 0, 0.09)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)', marginRight:'-20px', marginLeft:'-20px', marginTop:'30px'}}>
                </div>
                <div class='row' style={{marginTop:'20px'}}>
                  <Button 
                    class="btn btn-outline-dark"
                    type="button"
                    style={{marginRight:'10px',float:'right'}}
                    onClick = {()=> this.clickSelectGatewayConfigModal()}
                  >
                    Select Gateway Configuration 
                  </Button>

                  <Button 
                    class="btn btn-outline-dark"
                    type="button"
                    style={{marginRight:'10px'}}
                    onClick = {()=> this.clickSelectTPModal()}
                  >
                  Select Trasformation program
                  </Button>
                  <label style={{marginLeft:'1%',width:'20%',marginTop:'0.9%', float: 'right'}}> Max # of upload items :</label>
                  <input type="number" min="-1" class="form-control" style={{width:"12%", float: 'right'}}  value= {this.state.maxItems} onChange={e => this.onTodoChange('maxItems',e.target.value)}/>
                </div>

              </Modal.Body>
            <Modal.Footer>
              <Button 
                class="btn btn-outline-dark"
                type="button"
                style={{marginRight:'10px'}}
                onClick = {()=> this.registerTargetSite() }
              >
              Register
              </Button>
              <Button color="secondary" 
                onClick={(obj) => {
                  this.closeCurrentModal()
                }}
              >
                Close
              </Button>
            </Modal.Footer>
              <SModal isOpen={this.state.confirm_modal} toggle={this.closeModal.bind(this, 'confirm_modal')}>
                <ModalHeader toggle={this.closeModal.bind(this, 'confirm_modal')}>
                Confirm to remove
                </ModalHeader>
                <ModalBody>
                  Are you sure you want to delete?
                  <p></p>
                  <Button style={{float:'right'}}onClick={this.closeModal.bind(this, 'confirm_modal')}>
                  No
                  </Button>
                  <Button style={{float:'right'}}onClick={this.removeNode(this.state.id)}>
                  Yes
                  </Button>
                  
                </ModalBody>
              </SModal>
              <SelectGatewayConfigModal
                  show={this.state.showSelectGatewayConfigModal}
                  JobId = {this.props.id}
                  userId={this.props.userId}
                  selectedCid={this.state.selected_configuration_id}
                  saveGatewayConfiguration = {this.saveGatewayConfiguration}
                  setModalShow = {(s) => this.setState({showSelectGatewayConfigModal: s})}
              />
              
              <SelectTPModal
                  show={this.state.showSelectTPModal}
                  JobId = {this.props.id}
                  userId={this.props.userId}
                  selectedPid={this.state.selected_transformation_program_id}
                  saveTP = {this.saveTP}
                  setModalShow = {(s) => this.setState({showSelectTPModal: s})}
              />
              <SelectRateModal
                  show={this.state.showSelectRateModal}
                  JobId = {this.props.id}
                  userId={this.props.userId}
                  selectRate = {this.selectRate}
                  setModalShow = {(s) => this.setState({showSelectRateModal: s})}
              />
            </Modal>

        );
    }
}
export default UpdateTargetSiteAndPricingInfoModal;
