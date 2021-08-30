// @flow

import ReactTable from "react-table"
import * as React from "react";

import Collapsible from 'react-collapsible';
import ReteGraph from "../rete/ReteGraph.react";
import {NotificationContainer, NotificationManager} from 'react-notifications';
//import rete from "../rete/ClickOperatorNode";
import rete from "../rete/rete"
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
import C3Chart from "react-c3js";
import $ from "min-jquery";

import EditableTree from '../TreeView/components/tree';
import LoadProgramModal from "./LoadProgramModal.react";
import ErrorModal from "./ErrorModal.react";
import DataModal from "./DataModal.react";
import CrawledHistoryModal from "./CrawledHistoryModal.react";
import CrawledModal from "./CrawledModal.react";
import JobSubTabPage from "./JobSubTabPage.react";
import ErrorMysiteModal from "./ErrorMysiteModal.react";
import ErrorTargetsiteModal from "./ErrorTargetsiteModal.react";
import SaveProgramModal from "./SaveProgramModal.react";
import UploadModal from "./OneTimeUploadModal.react";
import UpdateUserProgramModal from "./UpdateUserProgramModal"
import axios from 'axios'
import setting_server from '../setting_server';
import refreshIcon from './refresh.png';
import schedule from 'node-schedule'
import Image from 'react-bootstrap/Image'
window.React = React;


let g_user_program = {};
let g_label = 1;
let g_document = document;
let g_call_otips = false;
let g_tab_id = -1;
let g_window_id = -1;
chrome.tabs.onUpdated.addListener(function(tabid, info, tab) {
  if (info.status == "complete") {
    if (g_call_otips == false && g_tab_id == tabid){
      chrome.windows.update(g_window_id, {'focused': true}, function (window) {  chrome.tabs.update(tabid, { 'active': true }, (tab) => { g_document.getElementById("otips").click()}) })
      g_call_otips = true;
    }
    return;
  }
  else{
    g_call_otips = false;
  }
});
class JobTab extends React.Component {

    constructor(props) {
        super(props);
        let curUrl = window.location.href;
        //this.myRef = React.createRef();
        
        this.state = {
          program: JSON.parse("{}"),
          program_txt: "{}",
          dataDB: "{}",
          modalShow: false,
          loadmodalShow: false,
          errmodalShow: false,
          dataShow: false,
          savemodalShow: false,
          GraphData: {},
          upid_title: '',
          url:this.props.url,
          active: "Program",
          refresh: 1,
          workflow:{},
          editor:{},
          category:[{
                  "title":"title1",
                  "children":[{
                      "title":"Sub category"   
                  }]
              }],
          nodes:[],
          selectedProjectId: -1,
          addOneTimeUploadModalShow: false,
        }
        
        this.addOneTimeUploadModal = this.addOneTimeUploadModal.bind(this);
        this.saveProgram = this.saveProgram.bind(this)
        this.saveGraphData = this.saveGraphData.bind(this)
        this.getTreeNodes = this.getTreeNodes.bind(this)
        this.getSelectedCategory = this.getSelectedCategory.bind(this)
        this.drawWorkflow = this.drawWorkflow.bind(this)
        this.updateProgram = this.updateProgram.bind(this)
        
    }

    addOneTimeUploadModal(){
      this.setState({addOneTimeUploadModalShow: true})
    }

    workflowToUserProgram(){
        var nodes =  this.state.GraphData.nodes
        var workflow =  this.state.GraphData
        if(typeof nodes == 'undefined'){
            return {}
        }
        var open_url = ""
        var zipcode_url = ""
        var open_url_id = ""
        var nodeIds = []
        var operator = ["dummy_node"]
        var options = {}
        var edges = {}
        var node_of_workflow = {}
        var BFSIteratorNodeIds = []
        var i = 1;
        var node_mapping = {}
        for(var nid_idx in nodes){
            node_mapping[nid_idx] = i
            i++
        }

        var nid = 1;
        for(var idx in nodes){
            nodeIds.push(nid)
            node_of_workflow[nid] = nodes[idx]
            operator.push(nodes[idx]['name'])
            if(nodes[idx]['name'] == "OpenURL"){
                open_url = nodes[idx]['data']['url']
                console.log(nodes[idx]['data'])
                zipcode_url = nodes[idx]['data']['zipcode_url']
                console.log(zipcode_url)
                open_url_id = nid
            }
            else if(nodes[idx]['name'] == "BFSIterator"){
                BFSIteratorNodeIds.push(nid)
            }

            options[nid] = nodes[idx]['data']
            for(var idxx in nodes[idx]['outputs']){
                if(nodes[idx]['outputs'][idxx]['connections'].length != 0){
                    if ( !(nid in edges)) {
                        edges[nid] = []
                    }
                    for(var idxxx in nodes[idx]['outputs'][idxx]['connections']){
                        edges[nid].push(node_mapping[nodes[idx]['outputs'][idxx]['connections'][idxxx]['node']])
                    }
                }
            }
            nid++
        }
        return this.createUserProgram(open_url, zipcode_url, open_url_id, nodeIds, operator, edges, options, node_of_workflow, BFSIteratorNodeIds, workflow)
    }


    updateChromeTab(url) {
      document.getElementById("unbind-otips").click();
      if (!url.match(/^https?:\/\//i)) {
        chrome.tabs.update({url: 'http://'+ url, 'active': true}, function(tab) {
          g_tab_id = tab.id
          g_window_id = tab.windowId
        });
      }
      else{
        chrome.tabs.update({url: url, 'active': true}, function(tab) {
          g_tab_id = tab.id
          g_window_id = tab.windowId
        });
      }
    }

    updateUrl(url){
        var obj = this;
        axios.post(setting_server.DB_SERVER+'/api/db/job', {
            req_type: "set_url",
            job_id: obj.props.jobId,
            url: url
        })
        .then(function (response) {
        })
        .catch(function (error) {
            console.log(error);
        });

    }


    runDriver(){
      const obj = this;
      if (obj.state.upid_template <= 0){
        NotificationManager.error('Save as before crawling','', 10000);
        return
      }
      console.log(obj.state.upid)
      console.log(obj.state.upid_title)
    
      axios.post(setting_server.DRIVER_UTIL_SERVER+'/api/driver/', {
        req_type: "run_driver",
        wf: obj.state.upid,
        job_id: obj.props.jobId,
      })
      .then(function (response) {
        console.log(response['data'])
        if (response['data']['success'] == true) {
         
        } else {
          console.log('Failed to update run driver');
        }
      })
      .catch(function (error){
        console.log('Failed to update run driver');
        console.log(error);
      });
    }


    rerunDriver(){
      const obj = this;
      if (obj.state.upid_template <= 0){
        NotificationManager.error('Save as before crawling','', 10000);
        return
      }
      console.log(obj.state.upid)
      console.log(obj.state.upid_title)
    
      axios.post(setting_server.DRIVER_UTIL_SERVER+'/api/driver/', {
        req_type: "rerun_driver",
        wf: obj.state.upid,
        job_id: obj.props.jobId,
      })
      .then(function (response) {
        console.log(response['data'])
        if (response['data']['success'] == true) {
         
        } else {
          console.log('Failed to update run driver');
        }
      })
      .catch(function (error){
        console.log('Failed to update run driver');
        console.log(error);
      });
    }





    updateMysite(){
      const obj = this;
      axios.post(setting_server.DRIVER_UTIL_SERVER+'/api/driver/', {
        req_type: "update_mysite",
        job_id: obj.props.jobId,
      })
      .then(function (response) {
        //console.log(response['data'])
        if (response['data']['success'] == true) {
         
        } else {
          console.log('Failed to update mysite');
        }
      })
      .catch(function (error){
        console.log('Failed to update mysite');
        console.log(error);
      });
    }




    loadRecentProgram() { 
        var obj = this;
        //console.log("Load latest program")
        //console.log(obj.props)
        axios.post(setting_server.DB_SERVER+'/api/db/userprogram', {
            req_type: "get_last_user_program",
            job_id: obj.props.jobId
        })
        .then(function (response) {
            console.log(response)
            if (response['data']['success'] == true) {
               if( !response['data']['result']){
                 g_user_program = {}
                 let tmp = obj.state.refresh
                 
                 obj.setState({
                   refresh:++tmp, 
                   dataDB: "{}",
                   program: JSON.parse("{}"),
                   upid: -1,
                   nodes:[]
                 })
               }
               else{
                 let result = response['data']['result'][1];
                 let upid = response['data']['result'][0];
                 let upid_title = response['data']['result'][2];
                 let upid_template = response['data']['result'][3];
                 let user_program = result
                 let tmp = obj.state.refresh
                 let url_node_id 
                 if(response['data']['is_template'] == "True" || response['data']['is_template'] == true ){
                   for(let node in user_program['workflow']['nodes']){
                     if(user_program['workflow']['nodes'][node]['name'] == "OpenURL"){
                       user_program['workflow']['nodes'][node]['data']['url'] = obj.props.url 
                       break;
                     }
                   }
                 }
                 else{
                   obj.updateUrl(user_program['ops'][0]['url'])
                 }
                 g_user_program = user_program
                 //console.log(g_user_program) 
                 let url = user_program['ops'][0]['url']
                 if (url != null){
                   // only for chrome extension
                   obj.updateChromeTab(url)
                 }
                 else{
                   obj.updateChromeTab(obj.props.url)
                 }

                 obj.setState({
                   refresh:++tmp, 
                   dataDB: JSON.stringify(user_program['dataDb'], null, 2), 
                   program:user_program,
                   upid: upid,
                   upid_title: upid_title,
                   upid_template: upid_template,
                   nodes: user_program['object_tree'],
                   showSubTab: true
                 })
                 //setTimeout(() =>{ console.log("after"), obj.handleClick()} , 10000)
                 //document.getElementById("otips").click();
               }
            }
        })
        .catch(function (error) {
            console.log('fail to load recent program')
            console.log(error);
        });

    }


    removeEmpty(obj) {
        for (var key in obj) {
          if(key == 'self' && obj[key] == "0"){
              delete obj[key];
          }
          if(key == "ops")
              continue
          if (obj[key] === null || obj[key] === undefined || obj[key] == "") {
              delete obj[key];
          }
        }
    }

    createUserProgram(open_url, zipcode_url, open_url_id, nodeIds, operator, edges, options, node_of_workflow, BFSIteratorNodeIds, workflow){
        var program_name = "crawling script"
        var queue_name = setting_server.CRAWLING_QUEUE
        var id = 0

        // Create Props
        let user_program = {
          'id': id,
          'name': program_name,
          'dataDb': 'host='+setting_server.HOST_SERVER+' port=54320 user=pse password=pse dbname=pse',
          'logDb' : 'host='+setting_server.HOST_SERVER+' port=54320 user=pse password=pse dbname=pse',
          'queue': queue_name,
          'ops' : [],
          'workflow': workflow
        }

        // Create Operators
        var cur_nodeId = open_url_id
        let is_next_level_exist = true;

        user_program['root_data'] = node_of_workflow[cur_nodeId]
        id++
        var operators = []
        var ops = {}
        
        if(operator[cur_nodeId] == "OpenURL"){
            ops = {
              'id': open_url_id,
              'name': "OpenURL",
              'label': g_label,
              'query': options[cur_nodeId]['query'],
              'url': open_url,
              'zipcode_url': zipcode_url,
              'ops': [],
              'workflow_data': node_of_workflow[cur_nodeId]
            }
            g_label += 1
            this.removeEmpty(ops)
            //console.log(edges[cur_nodeId])
            //console.log(typeof edges[cur_nodeId] == 'undefined')
            if( typeof edges[cur_nodeId] != 'undefined'){
               cur_nodeId = edges[cur_nodeId][0]
            }
            else{
               user_program['ops'].push(ops)
               g_user_program = user_program
               return;
            }
        }
     
        let is_right_exist = true;
        do{
            var op
            op = this.getOperatorAndProps(operator[cur_nodeId], cur_nodeId, options[cur_nodeId], edges, open_url)
            op['workflow_data'] = node_of_workflow[cur_nodeId]
            ops['ops'].push(op)
            is_right_exist = (typeof edges[cur_nodeId] != 'undefined')
            if(operator[edges[cur_nodeId]] == "BFSIterator")
                is_right_exist = false;
            if(is_right_exist)
                cur_nodeId = edges[cur_nodeId][0]
        } while(is_right_exist)

        user_program['ops'].push(ops)
        let BFSIteratorsDict = {}
        // second or deeper level
        let prev_query = null
        let prev_attr = null
        let prev_pre = null
        let prev_suf = null
        let prev_attr_del = null
        let prev_attr_idx = null
        for(let idx in BFSIteratorNodeIds){
          cur_nodeId = BFSIteratorNodeIds[idx];
          var operators = []
          var ops = {}
          var cur_level_bfsiterator_nodeId = cur_nodeId
          let is_right_exist = true;
          let sameLevelOps = []
          let is_prev_has_sub = false;
          let depth = 0;
          do{

              if(operator[cur_nodeId] != "CloseNode"){
                var op = this.getOperatorAndProps(operator[cur_nodeId], cur_nodeId, options[cur_nodeId], edges, open_url)
                if(operator[cur_nodeId] == "BFSIterator"){
                  //console.log(node_of_workflow[cur_nodeId]['data'])
                  //console.log(node_of_workflow[cur_nodeId]['data']['rows'].length == 0)
                  if (node_of_workflow[cur_nodeId]['data']['rows'] != null){
                    if (node_of_workflow[cur_nodeId]['data']['rows'].length != 0){
                      let init = node_of_workflow[cur_nodeId]['data']['rows'][0]['initial']
                      let url_query = node_of_workflow[cur_nodeId]['data']['rows'][0]['query']
                      //console.log(init)
                      //console.log(url_query)
                      open_url = open_url + url_query.replace(url_query.split('=')[1], init)
                    }
                  }
                  //console.log('@@@@@@@@@@11111111@@@@@@')
                  //console.log(prev_query)
                  if (prev_query != null){
                    node_of_workflow[cur_nodeId]['data']['prev_query'] = prev_query
                    node_of_workflow[cur_nodeId]['data']['prev_attr'] = prev_attr
                    node_of_workflow[cur_nodeId]['data']['prev_pre'] = prev_pre
                    node_of_workflow[cur_nodeId]['data']['prev_suf'] = prev_suf
                    node_of_workflow[cur_nodeId]['data']['prev_attr_del'] = prev_attr_del
                    node_of_workflow[cur_nodeId]['data']['prev_attr_idx'] = prev_attr_idx
                    prev_query = null
                    prev_attr = null
                    prev_pre = null
                    prev_suf = null
                    prev_attr_del = null
                    prev_attr_idx = null
                  }
                  node_of_workflow[cur_nodeId]['data']['open_url'] = open_url
                  op['workflow_data'] = node_of_workflow[cur_nodeId]
                }
                else if (operator[cur_nodeId] == "Expander"){
                  //console.log(node_of_workflow[cur_nodeId]['data'])
                  //console.log(node_of_workflow[cur_nodeId]['data']['query'])
                  if (node_of_workflow[cur_nodeId]['data']['query'] != null){
                    //console.log(node_of_workflow[cur_nodeId]['data']['query'])
                    prev_query = node_of_workflow[cur_nodeId]['data']['query']
                    prev_attr = node_of_workflow[cur_nodeId]['data']['attribute']
                    prev_pre = node_of_workflow[cur_nodeId]['data']['prefix']
                    prev_suf = node_of_workflow[cur_nodeId]['data']['suffix']
                    prev_attr_del = node_of_workflow[cur_nodeId]['data']['attr_delimiter']
                    prev_attr_idx = node_of_workflow[cur_nodeId]['data']['attr_idx']
                  }
                  //console.log(prev_query)
                  op['workflow_data'] = node_of_workflow[cur_nodeId]
                }
                else{
                  op['workflow_data'] = node_of_workflow[cur_nodeId]
                }
                if(depth == 0){
                  sameLevelOps.push(op)
                }
                else{
                  //console.log(sameLevelOps)
                  let tmp = sameLevelOps[sameLevelOps.length-1]['ops'];
                  for(let i = 0 ; i < depth-1 ; i++){
                    tmp = tmp[tmp.length-1]['ops']
                  }
                  tmp.push(op)
                  //console.log(tmp)
                  //console.log(sameLevelOps)
                }
              }
              if(operator[cur_nodeId] == "BFSIterator" || operator[cur_nodeId] == "OpenNode"){
                  is_prev_has_sub = true;
                  depth++;
              }
              else if(operator[cur_nodeId] == "CloseNode"){
                  depth--;
              }
              is_right_exist = (typeof edges[cur_nodeId] != 'undefined')
              if(operator[edges[cur_nodeId]] == "BFSIterator")
                  is_right_exist = false;
              if(is_right_exist)
                  cur_nodeId = edges[cur_nodeId][0]
          } while(is_right_exist)
          BFSIteratorsDict[sameLevelOps[0]['id']] = sameLevelOps[0]
        }

        const orderedBFSIteratorsDict = {};
        Object.keys(BFSIteratorsDict).sort().forEach(function(key) {
            orderedBFSIteratorsDict[key] = BFSIteratorsDict[key];
        });

        for(let idx in orderedBFSIteratorsDict){
            user_program['ops'].push(orderedBFSIteratorsDict[idx])
        }

        g_user_program = user_program
    }


    drawWorkflow(user_program, upid, upid_title, upid_template){
        var tmp = this.state.refresh
        g_user_program = user_program
        console.log('draw work flow')
        console.log(upid)
        if(upid_template){
          for(let node in user_program['workflow']['nodes']){
            if(user_program['workflow']['nodes'][node]['name'] == "OpenURL"){
              user_program['workflow']['nodes'][node]['data']['url'] = this.props.url 
              break;
            }
          }
        }

        this.setState({
          refresh:++tmp, 
          dataDB: JSON.stringify(user_program['dataDb'], null, 2), 
          program:user_program,
          upid: upid,
          upid_title: upid_title,
          upid_template: upid_template,
          nodes: user_program['object_tree']
       })
    }


    getSelectedCategory(selected_category){
      this.setState({selected_category: selected_category})
    }
    getTreeNodes(nodes){
      this.setState({nodes:nodes})
    }
    saveGraphData(data){
      this.setState({ GraphData : data})
    }


    //drawOperator(editor){
    //  editor.addNode(this.state.)
    //}
    saveProgram(site, category, projectId){

        var obj = this;
        this.workflowToUserProgram();
        g_user_program['object_tree'] = this.state.nodes;
        axios.post(setting_server.DB_SERVER+'/api/db/userprogram', {
                req_type: "save_user_program",
                site: site,
                category: category,
                program: JSON.stringify(g_user_program),
                job_id: obj.props.jobId
            })
            .then(function (response) {
                console.log(response['data']);
                obj.setState({
                  upid : response['data']['id'],
                  upid_title: response['data']['title'],
                  upid_template: response['data']['id']
                })
            })
            .catch(function (error) {
                console.log(error);
            });

    }


    updateProgram(){
      var obj = this;
      obj.workflowToUserProgram();
      axios.post(setting_server.DB_SERVER+'/api/db/userprogram', {
        req_type: "update_user_program",
        program: JSON.stringify(g_user_program),
        wid: obj.state.upid
      })
      .then(function (response) {
          console.log(response);
      })
      .catch(function (error) {
          console.log(error);
      });

    }



    showUpdateProgramModal(){
      var obj = this;
      if(obj.state.upid_template <= 0){
        obj.setState({updateUserProgramModalShow: true})  
      }
      else{
        this.workflowToUserProgram();
        axios.post(setting_server.DB_SERVER+'/api/db/userprogram', {
          req_type: "update_user_program",
          program: JSON.stringify(g_user_program),
          wid: obj.state.upid
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
      }
    }

    runTransformationMysite() {
        var obj = this;
        console.log(obj.props)
        axios.post(setting_server.DRIVER_UTIL_SERVER+'/api/driver/', {
            req_type: "run_transformation_to_mysite",
            job_id: obj.props.jobId
        })
        .then(function (resultData) {

        })
        .catch(function (error) {
            console.log(error);
        });
    }


    initState() {
      
    }

    refreshList() {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/executions', {
        req_type: "get_executions",
        job_id: obj.props.jobId
      })
      .then(function (resultData) {
        if(resultData['data']['success'] == true) {
          let executions = resultData['data']['executions'];
          obj.setState({
              items: executions,
          });
        } else {
        }
      })
      .catch(function (error) {
          console.log(error);
      });
      //obj.createNotification('History');
    }


    refreshMsiteList() {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/mysite', {
        req_type: "get_history",
        job_id: obj.props.jobId
      })
      .then(function (resultData) {
        if(resultData['data']['success'] == true) {
          let history = resultData['data']['result'];
          // id, execution_id, TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS'), TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS')
          obj.setState({
              mysite_items: history
          });
        } else {
        }
      })
      .catch(function (error) {
          console.log(error);
      });
      //obj.createNotification('History');
    }



    refreshTsiteList() {
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/targetsite', {
        req_type: "get_history",
        job_id: obj.props.jobId
      })
      .then(function (resultData) {
        if(resultData['data']['success'] == true) {
          let history = resultData['data']['result'];
          // id, execution_id, TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS'), TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS')
          obj.setState({
              targetsite_items: history
          });
        } else {
        }
      })
      .catch(function (error) {
          console.log(error);
      });
      //obj.createNotification('History');
    }
    componentWillReceiveProps(nextProps) {
      //this.refreshList();
      //this.getUrl();
      
    }
    componentWillMount() {
      //this.refreshList();
      //this.refreshMsiteList();
      //this.refreshTsiteList()
      //console.log(g_user_program)
      
    }

    componentDidMount(){
      this.loadRecentProgram()
    }

    getSelectedCategory(selected_category){
      this.setState({selected_category: selected_category})
    }

    getOperatorAndProps(operator, id, options, edges, open_url){
        var op
        switch(operator) {
            case "OptionMatrixScrapper":
                console.log(options)
                op = {
                  "id": id,
                  "name": "OptionMatrixScrapper",
                  "option_name_query": options['option_name_query'],
                  "option_x_value_query": options['option_x_value_query'],
                  "option_y_value_query": options['option_y_value_query'],
                  "option_matrix_row_wise_value_query": options['option_matrix_row_wise_value_query'],
                }
                this.removeEmpty(op)
                break;
            case "OptionListScrapper":
                console.log(options)
                op = {
                  "id": id,
                  "name": "OptionListScrapper",
                  "option_name_query": options['option_name_query'],
                  "option_dropdown_query": options['option_dropdown_query'],
                  "option_value_query": options['option_value_query'],
                  "option_attr": options['option_attr'],
                  "option_essential": options['option_essential'],
                }
                this.removeEmpty(op)
                break;
            case "Wait":
                op = {
                  "id": id,
                  "name": "Wait",
                  "wait": options['wait'],
                }
                this.removeEmpty(op)
                break;
            case "Hover":
                op = {
                  "id": id,
                  "name": "Hover",
                  "query": options['hover'],
                }
                this.removeEmpty(op)
                break;
            case "Scroll":
                op = {
                  "id": id,
                  "name": "Scroll",
                }
                this.removeEmpty(op)
                break;
            case "Input":
                var rowsValuesSp = []
                for(var idxValuesSp in options['rows']){
                  var rowValuesSp = {
                      "query": options['rows'][idxValuesSp]['col_query'],
                      "value": options['rows'][idxValuesSp]['col_value'],
                  }
                  rowsValuesSp.push(rowValuesSp)
                }
                op =  {
                  "id": id,
                  "name": "Input",
                  "queries": rowsValuesSp
                }
                break;

            case "Expander":
                op = {
                  "id": id,
                  "name": "Expander",
                  "query": options['query'],
                  "indices": options['indices'],
                  "attr": options['attribute'],
                  "prefix": options['prefix'],
                  "suffix": options['suffix'],
                  "attr_delimiter": options['attr_delimiter'],
                  "attr_idx": options['attr_idx'],
                  "matchSelf": options['matchSelf'],
                  "noMatchSelf": options['noMatchSelf']
                }
                this.removeEmpty(op)
                break;
            case "BFSIterator":
                var query = ""
                var initial_values = []
                var increments = []
                for(var idx in options['rows']){
                    query += options['rows'][idx]['query']
                    initial_values.push(options['rows'][idx]['initial'])
                    increments.push(options['rows'][idx]['increase'])
                }
                let inputId = -1;
                let find = false;
                for(let idx1 in edges){
                  for(let idx2 in edges[idx1]){
                    //console.log(edges[idx1])
                    //console.log(edges[idx1][idx2])
                    if(edges[idx1][idx2] == id){
                      inputId = idx1;
                      find = true;
                      break;
                    }
                  }
                  if(find) break;
                }
                op = {
                   'id': id,
                   'name': "BFSIterator",
                   'label': g_label, 
                   'input': parseInt(inputId),
                   'url_query': query,
                   'initial_values': initial_values,
                   'increments': increments,
                   'max_num_tasks': options['max_num_tasks'],
                   'query': options['query'],
                   'selected_btn_query': options['selected_button_query'],
                   'ops':[]
                }
                g_label += 1
                console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
                this.removeEmpty(op)
                break;
            case "ClickOperator":
                var rowsClickOp = []
                for(var idxClickOp in options['rows']){
                  var rowClickOp = {
                      "query": options['rows'][idxClickOp]['col_query'],
                      "check_query": options['rows'][idxClickOp]['col_check_query'],
                      "delay": options['rows'][idxClickOp]['col_delay'],
                      "repeat": options['rows'][idxClickOp]['col_repeat'],
                  }
                  rowsClickOp.push(rowClickOp)
                }
                op =  {
                  "id": id,
                  "name": "ClickOperator",
                  "queries": rowsClickOp
                }
                break;
            case "ValuesScrapper":
                var rowsValuesSp = []
                for(var idxValuesSp in options['rows']){
                  var rowValuesSp = {
                      "key": options['rows'][idxValuesSp]['col_key'],
                      "query": options['rows'][idxValuesSp]['col_query'],
                      "indices": options['rows'][idxValuesSp]['col_indices'],
                      "attr": options['rows'][idxValuesSp]['col_attr'],
                      "essential": options['rows'][idxValuesSp]['col_essential']
                  }
                  rowsValuesSp.push(rowValuesSp)
                }
                op =  {
                  "id": id,
                  "name": "ValuesScrapper",
                  "queries": rowsValuesSp
                }
                break;
            case "OpenNode":
                op = {
                  "id": id,
                  "name": "OpenNode",
                  "query": options['query'],
                  "indices": options['indices'],
                  "self": options['self'],
                  'ops': []
                }
                this.removeEmpty(op)
                break;
            case "ListsScrapper":
                var rowsListsSp = []
                for(var idxListsSp in options['rows']){
                  var rowListsSp = {
                      "key": options['rows'][idxListsSp]['col_key'],
                      "query": options['rows'][idxListsSp]['col_query'],
                      "indices": options['rows'][idxListsSp]['col_indices'],
                      "attr": options['rows'][idxListsSp]['col_attr'],
                      "essential": options['rows'][idxListsSp]['col_essential']
                  }
                  rowsListsSp.push(rowListsSp)
                }
                op =  {
                  "id": id,
                  "name": "ListsScrapper",
                  "queries": rowsListsSp
                }
                break;
            case "DictionariesScrapper":
                var rowsDictsSp = []
                for(var idxDictsSp in options['rows']){
                  var rowDictsSp = {
                      "key": options['rows'][idxDictsSp]['col_key'],
                      "title_query": options['rows'][idxDictsSp]['col_title'],
                      "rows_query": options['rows'][idxDictsSp]['col_rows_query'],
                      "rows_indices": options['rows'][idxDictsSp]['col_rows_indices'],
                      "key_query": options['rows'][idxDictsSp]['col_key_query'],
                      "key_indices": options['rows'][idxDictsSp]['col_key_indices'],
                      "key_attr": options['rows'][idxDictsSp]['col_key_attribute'],
                      "value_query": options['rows'][idxDictsSp]['col_value_query'],
                      "value_indices": options['rows'][idxDictsSp]['col_value_indices'],
                      "value_attr": options['rows'][idxDictsSp]['col_value_attribute'],
                  }
                  rowsDictsSp.push(rowDictsSp)
                }
                op =  {
                  "id": id,
                  "name": "DictsScrapper",
                  "queries": rowsDictsSp
                }
                break;
            default:
                console.log("Not defined opeartor")
        }
        return op
    }

  getUrl() {
    const obj = this;
    axios.post(setting_server.DB_SERVER+'/api/db/job', {
      req_type: "get_url",
      job_id: this.props.jobId
    })
    .then(function (response) {
      if (response['data']['success'] == true) {
        obj.setState({url: response['data']['result']});
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }



   convertToWorkflow(user_program){
       if(Object.keys(user_program).length == 0){
           return {}
       }
       return user_program['workflow']

   }


   convertToWorkflowUsingStage(user_program, stage){

       if(typeof user_program['root_data'] != "undefined"){
           var workflow = {}
           var nodes = {}
           workflow['id'] = "partial-work-flow@1.0.0"

           var openurl_data = user_program['root_data']
           nodes[user_program['root_data']['id']] = openurl_data
           var idx = stage
           if(typeof user_program['operators'][idx] == 'undefined'){
               console.log("there is no that stage in the workflow")
               return;
           }
           for(var idxx in user_program['operators'][idx]['operators']){
               if(user_program['operators'][idx]['operators'][idxx]['workflow_data']['name'] == "BFSIterator"){
                   // remove in-edge
                   user_program['operators'][idx]['operators'][idxx]['workflow_data']['inputs'] = {}
                   // remove out-edge (to down)
                   user_program['operators'][idx]['operators'][idxx]['workflow_data']['outputs']['toDown']['connections'] = []
                   nodes[ user_program['operators'][idx]['operators'][idxx]['workflow_data']['id']] = user_program['operators'][idx]['operators'][idxx]['workflow_data']
               }
               else{
                   nodes[ user_program['operators'][idx]['operators'][idxx]['workflow_data']['id']] = user_program['operators'][idx]['operators'][idxx]['workflow_data']
               }
           }

           workflow['nodes'] = nodes
       }
   }

    

    render() {
        const err_msg = this.state.err_msg

        if(this.props.is_dev == true){
          return (
          <>
            <Grid.Row>
              <Grid.Col sm={12} lg={12}>
                <Card
                    style={{
                        marginLeft:'1px',
                        borderTop:'2px solid black'
                    }}
                    title="Your workflow"
                >
                <div id="edit-selector" style={{float:"left", width:'100%'}}>
		            	  <Button id="otips" color="secondary" action='otips' type="button"  style={{width:'10%'}}>
                      Show Opeartion tips
                    </Button>
		            </div>
                <div id="edit-selector" style={{float:"left", width:'100%'}}>
		            	  <Button  id="unbind-otips" color="secondary" action='unbind-otips' type="button"  style={{width:'10%'}}>
                      Hide Opeartion tips
                    </Button>
		            </div>
                <ReteGraph saveGraphData={this.saveGraphData} editor = {this.convertToWorkflow(g_user_program)} refresh={this.state.refresh} style={{marginBottom:'10%'}} job_id = {this.props.jobId} />

                </Card>
              </Grid.Col> 
            </Grid.Row>
            <Grid.Row>
              <Grid.Col sm={12} lg={12}>
                <Card
                    style={{
                        marginTop:"-30px",
                        marginLeft:'1px',
                        borderTop:'0px solid',
                        height:'80px'
                    }}
                >
                  <div class = 'row' style = {{marginLeft:'35%'}}>
                    <label style={{width:'23%', marginTop:'7px'}}>
                     Current Workflow Name: 
                    </label>
                    <input
                      class='form-control'
                      readonly='readonly'
                      style={{width:'40%', marginRight:'5%'}}
                      value = {this.state.upid_title}
                      type="text"
                    />
                    <Button 
                      color="secondary"
                      style = {{float:'right', marginRight:'1%', textTransform: 'capitalize'}}
                      onClick={() => {
                            this.showUpdateProgramModal()
                          }
                      }
                    >
                    Save
                    </Button>
                    <Button 
                      color="secondary"
                      style = {{float:'right',marginRight:"1%", textTransform: 'capitalize'}}
                      onClick={() => {
                            this.setState({savemodalShow: true})
                          }
                      }
                    >
                    Save as
                    </Button>

                    <Button 
                      color="secondary"
                      style = {{float:'right', textTransform: 'capitalize'}}
                      onClick={() => {
                            this.setState({loadmodalShow: true})
                            //console.log('Start add node')
                            //console.log(rete)
                            //console.log(rete[6])
                            //console.log(rete.ClickOperatorComponent())//is not a func
                            //console.log(new rete.ClickOperatorComponent())//is not a constructor
                            //const tmp = new rete[6]()
                            //console.log(this.convertToWorkflow(g_user_program))
                            //console.log(this.state.editor) 
                            //this.convertToWorkflow(g_user_program).view.update();
                            //console.log(this.convertToWorkflow(g_user_program))
                            //console.log('End add node')
                          }
                      }
                    >
                    Load
		            </Button>
		          </div>

                  <div class = 'row' style = {{width:'100%', height:'5px'}}>
                  </div>
                  <div class = 'row' style = {{marginLeft:'78%'}}>
                  <Button 
                    color="secondary"
                    style = {{float:'right',marginRight:"5%", textTransform: 'capitalize'}}
                    onClick={() => {
                          this.runDriver()
                        }
                    }
                  >
                  Crawling
                  </Button>
                  <Button 
                    color="secondary"
                    style = {{float:'right',marginRight:"5%", textTransform: 'capitalize'}}
                    onClick={() => {
                          this.rerunDriver()
                        }
                    }
                  >
                  Re-Crawling
                  </Button>
                  <Button 
                    color="secondary"
                    style = {{float:'right',marginRight:"5%", textTransform: 'capitalize'}}
                    onClick={() => {
                          this.addOneTimeUploadModal()
                          //this.updateMysite()
                        }
                    }
                  >
                  Upload / Update
                  </Button>
                  </div>

                </Card>
              </Grid.Col> 
            </Grid.Row>
            <Grid.Row>
              <Grid.Col sm={12} lg={12}>
                <Card
                    style={{
                        marginTop:"-25px",
                        marginLeft:'1px',
                        borderTop:'2px solid black'
                    }}
                    title=""
                >
       
                  <JobSubTabPage
                    JobId = {this.props.jobId}
                  />
                  
                  <LoadProgramModal
                      show={this.state.loadmodalShow}
                      drawWorkflow= {this.drawWorkflow}
                      jobId= {this.props.jobId}
                      upid={this.state.upid}
                      setModalShow={(s) => this.setState({loadmodalShow: s})}
                      selectedProjectId={this.state.selectedProjectId}
                  />
                  <SaveProgramModal
                      show={this.state.savemodalShow}
                      saveProgram={this.saveProgram}
                      setModalShow={(s) => this.setState({savemodalShow: s})}
                      selectedProjectId={this.state.selectedProjectId}
                  />
                  <UploadModal
                      show={this.state.addOneTimeUploadModalShow}
                      JobId = {this.props.jobId}
                      userId = {this.props.userId}
                      setModalShow={(s) => this.setState({addOneTimeUploadModalShow: s})}
                  />
                  <ErrorModal
                      show={this.state.errmodalShow}
                      execId= {this.state.execId}
                      setModalShow={(s) => this.setState({errmodalShow: s})}
                  />
                  <DataModal
                      show={this.state.dataShow}
                      execId= {this.state.execId}
                      JobId = {this.props.jobId}
                      setModalShow={(s) => this.setState({dataShow: s})}
                  />
                  <ErrorMysiteModal
                      show={this.state.errmysitemodalShow}
                      smhistoryId= {this.state.smhistoryId}
                      setModalShow={(s) => this.setState({errmysitemodalShow: s})}
                  />
                  <ErrorTargetsiteModal
                      show={this.state.errtargetsitemodalShow}
                      mthistoryId= {this.state.mthistoryId}
                      setModalShow={(s) => this.setState({errtargetsitemodalShow: s})}
                  />
                  <UpdateUserProgramModal
                      show={this.state.updateUserProgramModalShow}
                      updateProgram= {this.updateProgram}
                      setModalShow={(s) => this.setState({updateUserProgramModalShow: s})}
                  />
                  <CrawledHistoryModal
                      show={this.state.crawledHistoryModalShow}
                      JobId = {this.props.jobId}
                      setModalShow={(s) => this.setState({crawledHistoryModalShow: s})}
                  />
                  <CrawledModal
                      show={this.state.crawledModalShow}
                      JobId = {this.props.jobId}
                      execId= {this.state.execId}
                      setModalShow={(s) => this.setState({crawledModalShow: s})}
                  />
                  </Card>
                </Grid.Col> 
              </Grid.Row>
            </>
          );
        }
        else{
          return (
          <>
            <Grid.Row>
              <Grid.Col sm={12} lg={12}>
                <Card
                    style={{
                        marginLeft:'1px',
                        borderTop:'2px solid black'
                    }}
                    title=""
                >

                  <JobSubTabPage
                    JobId = {this.props.jobId}
                    showSubTab = {this.state.showSubTab}
                  />


                  <LoadProgramModal
                      show={this.state.loadmodalShow}
                      drawWorkflow= {this.drawWorkflow}
                      upid = {this.state.upid}
                      jobId= {this.props.jobId}
                      setModalShow={(s) => this.setState({loadmodalShow: s})}
                      selectedProjectId={this.state.selectedProjectId}
                  />
                  <SaveProgramModal
                      show={this.state.savemodalShow}
                      saveProgram={this.saveProgram}
                      setModalShow={(s) => this.setState({savemodalShow: s})}
                      selectedProjectId={this.state.selectedProjectId}
                  />
                  <UploadModal
                      show={this.state.addOneTimeUploadModalShow}
                      JobId = {this.props.jobId}
                      userId = {this.props.userId}
                      setModalShow={(s) => this.setState({addOneTimeUploadModalShow: s})}
                  />
                  <ErrorModal
                      show={this.state.errmodalShow}
                      execId= {this.state.execId}
                      setModalShow={(s) => this.setState({errmodalShow: s})}
                  />
                  <DataModal
                      show={this.state.dataShow}
                      execId= {this.state.execId}
                      JobId = {this.props.jobId}
                      setModalShow={(s) => this.setState({dataShow: s})}
                  />
                  <ErrorMysiteModal
                      show={this.state.errmysitemodalShow}
                      smhistoryId= {this.state.smhistoryId}
                      setModalShow={(s) => this.setState({errmysitemodalShow: s})}
                  />
                  <ErrorTargetsiteModal
                      show={this.state.errtargetsitemodalShow}
                      mthistoryId= {this.state.mthistoryId}
                      setModalShow={(s) => this.setState({errtargetsitemodalShow: s})}
                  />
                  <UpdateUserProgramModal
                      show={this.state.updateUserProgramModalShow}
                      updateProgram= {this.updateProgram}
                      setModalShow={(s) => this.setState({updateUserProgramModalShow: s})}
                  />
                  <CrawledHistoryModal
                      show={this.state.crawledHistoryModalShow}
                      JobId = {this.props.jobId}
                      setModalShow={(s) => this.setState({crawledHistoryModalShow: s})}
                  />
                  <CrawledModal
                      show={this.state.crawledModalShow}
                      JobId = {this.props.jobId}
                      execId= {this.state.execId}
                      setModalShow={(s) => this.setState({crawledModalShow: s})}
                  />
                  </Card>
                </Grid.Col> 
              </Grid.Row>

            </>
          );
        }
    }
}
export default JobTab;
