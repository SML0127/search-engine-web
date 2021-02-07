// @flow

import ReactTable from "react-table"
import * as React from "react";

import Collapsible from 'react-collapsible';
import ReteGraph from "../rete/ReteGraph.react";
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
import SaveProgramModal from "./SaveProgramModal.react";
import UploadModal from "./OneTimeUploadModal.react";
import axios from 'axios'
import setting_server from '../setting_server';
import refreshIcon from './refresh.png';
window.React = React;


let g_user_program = {};
let g_label = 1;
let g_document = document;
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
          savemodalShow: false,
          GraphData: {},
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
      if (!url.match(/^https?:\/\//i)) {
        //chrome.tabs.update({url: 'http://'+ url})
        chrome.tabs.update({url: 'http://'+ url}, function(tab1) {
          console.log('click-------')
          //g_document.getElementById("otips").click();
          //setTimeout(() =>{ console.log("after");  console.log(g_document);g_document.getElementById("otips").click();console.log("?????");g_document.getElementById("otips").click();} , 10000)
          console.log('--------click')
        });
      }
      else{
        //chrome.tabs.update({url: url});
        chrome.tabs.update({url: url}, function(tab1) {
          console.log('click-------')
          //setTimeout(() =>{ console.log("after");  console.log(g_document);g_document.getElementById("otips").click();console.log("?????");g_document.getElementById("otips").click();} , 10000)
          console.log('--------click')
        });
      }
    }

    runDriver(){
      const obj = this;
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




    updateMysite(){
      const obj = this;
      axios.post(setting_server.DRIVER_UTIL_SERVER+'/api/driver/', {
        req_type: "update_mysite",
        job_id: obj.props.jobId,
      })
      .then(function (response) {
        console.log(response['data'])
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
            //console.log(response)
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
                 let user_program = result
                 let tmp = obj.state.refresh
                 let url_node_id 
                 for(let node in user_program['workflow']['nodes']){
                   if(user_program['workflow']['nodes'][node]['name'] == "OpenURL"){
                     user_program['workflow']['nodes'][node]['data']['url'] = obj.props.url 
                   }
                 }

                 g_user_program = user_program
                 //console.log(g_user_program) 
                 let url = user_program['ops'][0]['url']
                 
                 if (url != null){
                   // only for chrome extension
                   //obj.updateChromeTab(url)
                 }
                 else{
                   //obj.updateChromeTab(obj.props.url)
                 }

                 obj.setState({
                   refresh:++tmp, 
                   dataDB: JSON.stringify(user_program['dataDb'], null, 2), 
                   program:user_program,
                   upid: upid,
                   nodes: user_program['object_tree']
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
              console.log(key)
              delete obj[key];
          }
        }
    }

    createUserProgram(open_url, zipcode_url, open_url_id, nodeIds, operator, edges, options, node_of_workflow, BFSIteratorNodeIds, workflow){
        var program_name = "Test 1"
        var queue_name = "real_queue"
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
              //'id': id,
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
            console.log(edges[cur_nodeId])
            console.log(typeof edges[cur_nodeId] == 'undefined')
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
            op = this.getOperatorAndProps(operator[cur_nodeId], cur_nodeId, options[cur_nodeId], edges)
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
                var op = this.getOperatorAndProps(operator[cur_nodeId], cur_nodeId, options[cur_nodeId], edges)
                op['workflow_data'] = node_of_workflow[cur_nodeId]
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


    drawWorkflow(user_program, upid){
        var tmp = this.state.refresh
        g_user_program = user_program
        this.setState({
          refresh:++tmp, 
          dataDB: JSON.stringify(user_program['dataDb'], null, 2), 
          program:user_program,
          upid: upid,
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
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

    }



    updateProgram(site, category, projectId){
      var obj = this;
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
      console.log('refresh list')
      const obj = this;
      axios.post(setting_server.DB_SERVER+'/api/db/executions', {
        req_type: "get_executions",
        job_id: obj.props.jobId
      })
      .then(function (resultData) {
        if(resultData['data']['success'] == true) {
          let executions = resultData['data']['executions'];
          obj.setState({
              items: executions
          });
        } else {
          console.log('getExecutions Failed');
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
      this.refreshList();
      //console.log(g_user_program)
      this.loadRecentProgram()
      
    }

    componentDidMount(){

    }

    handleTabSelect(e, key, currentTabs) {
        console.log('handleTabSelect key:', key);
        this.setState({selectedTab: key});
    }

    handleTabClose(e, key, currentTabs) {
        console.log('tabClosed key:', key);
        this.setState({tabs: currentTabs});
    }

    handleTabPositionChange(e, key, currentTabs) {
        console.log('tabPositionChanged key:', key);
        this.setState({tabs: currentTabs});
    }

    makeListeners(key){
        return {
onClick: (e) => { console.log('onClick', key, e);}, // never called
             onContextMenu: (e) => { console.log('onContextMenu', key, e); this.handleTabContextMenu(key, e)},
             onDoubleClick: (e) => { console.log('onDoubleClick', key, e); this.handleTabDoubleClick(key, e)},
        }
    }
    getSelectedCategory(selected_category){
      this.setState({selected_category: selected_category})
    }



    getOperatorAndProps(operator, id, options, edges){
        var op
        switch(operator) {
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
                this.removeEmpty(op)
                break;
            case "ClickOperator":
                var rowsClickOp = []
                for(var idxClickOp in options['rows']){
                  var rowClickOp = {
                      "query": options['rows'][idxClickOp]['col_query'],
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
        const {items} = this.state;

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
		            	  <Button color="secondary" action='unbind-otips' type="button"  style={{width:'10%'}}>
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
                  <div class = 'row' style = {{marginLeft:'75%'}}>
                    <Button 
                      color="secondary"
                      style = {{float:'right', marginRight:'5%', textTransform: 'capitalize'}}
                      onClick={() => {
                            this.updateProgram()
                          }
                      }
                    >
                    Save
                    </Button>
                    <Button 
                      color="secondary"
                      style = {{float:'right',marginRight:"5%", textTransform: 'capitalize'}}
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
                  <div class = 'row' style = {{marginLeft:'73%'}}>
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
                    title="Executions"
                >

                  <img
                    src={refreshIcon}
                    width="20"
                    height="20"
                    onClick={() =>
                      this.refreshList()
                    }
                    style = {{float:'right', cursor:'pointer', marginTop:'-3.35%', marginLeft:'9.5%', marginBottom:'1.5%' }}

                  />


                  <ReactTable
                      data = {items}
                      getTdProps={(state, rowInfo, column, instance) => {
                          return {
                              onDoubleClick: (e) => {
                                  if(typeof rowInfo != 'undefined'){
                                    // gSelectedExeuctionId = rowInfo['original'][0]
                                    this.setState({modalShow: true })
                                  }
                              }
                          }
                      }}
                      columns={[
                          {
                              Header: "Execution ID",
                              width: 150,
                              resizable: false,
                              accessor: "0",
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
                              Header: "Start Time",
                              resizable: false,
                              accessor: "3",
                              Cell: ( row ) => {
                                  if (row.value == null){
                                      return (
                                          <div
                                              style={{
                                                  textAlign:"center",
                                                  paddingTop:"4px",
                                                  paddingLeft:"15px"
                                              }}
                                          > - </div>
                                      )
                                  }
                                  else{
                                      return (
                                          <div
                                              style={{
                                                  textAlign:"center",
                                                  paddingTop:"4px",
                                                  paddingLeft:"12px"
                                              }}
                                          > {row.value} </div>
                                      )
                                  }
                              }
                          },
                          {
                              Header: "Finish Time",
                              resizable: false,
                              accessor: "4",
                              Cell: ( row ) => {
                                  if (row.value == null){
                                      return (
                                          <div
                                              style={{
                                                  textAlign:"center",
                                                  paddingTop:"4px",
                                                  paddingLeft:"15px"
                                              }}
                                          > - </div>
                                      )
                                  }
                                  else{
                                      return (
                                          <div
                                              style={{
                                                  textAlign:"center",
                                                  paddingTop:"4px",
                                                  paddingLeft:"12px"
                                              }}
                                          > {row.value} </div>
                                      )
                                  }
                              }
                          },
                          {
                              Header: "# of crawled product (# of total)",
                              resizable: false,
                              accessor: "6",
                              Cell: ( row ) => {
                                  if (row.value == null){
                                      return (
                                          <div
                                              style={{
                                                  textAlign:"center",
                                                  paddingTop:"4px",
                                                  paddingLeft:"15px"
                                              }}
                                          > - </div>
                                      )
                                  }
                                  else{
                                      return (
                                          <div
                                              style={{
                                                  textAlign:"center",
                                                  paddingTop:"4px",
                                                  paddingLeft:"12px"
                                              }}
                                          > {row.value} ({row.original[7]}) </div>
                                      )
                                  }
                              }
                          }
                      ]}
                      minRows={10}
                      defaultPageSize={1000}
                      showPagination ={false}
                      bordered = {false} 
                      style={{
                          height: "500px"
                      }}
                      className="-striped -highlight"
                  />
                  <LoadProgramModal
                      show={this.state.loadmodalShow}
                      drawWorkflow= {this.drawWorkflow}
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
                    title="Executions"
                >
                  <ReactTable
                      data = {items}
                      getTdProps={(state, rowInfo, column, instance) => {
                          return {
                              onDoubleClick: (e) => {
                                  if(typeof rowInfo != 'undefined'){
                                    // gSelectedExeuctionId = rowInfo['original'][0]
                                    this.setState({modalShow: true })
                                  }
                              }
                          }
                      }}
                      columns={[
                          {
                              Header: "Execution ID",
                              width: 150,
                              resizable: false,
                              accessor: "0",
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
                              Header: "Start Time",
                              resizable: false,
                              accessor: "3",
                              Cell: ( row ) => {
                                  if (row.value == null){
                                      return (
                                          <div
                                              style={{
                                                  textAlign:"center",
                                                  paddingTop:"4px",
                                                  paddingLeft:"15px"
                                              }}
                                          > - </div>
                                      )
                                  }
                                  else{
                                      return (
                                          <div
                                              style={{
                                                  textAlign:"center",
                                                  paddingTop:"4px",
                                                  paddingLeft:"12px"
                                              }}
                                          > {row.value} </div>
                                      )
                                  }
                              }
                          },
                          {
                              Header: "Finish Time",
                              resizable: false,
                              accessor: "4",
                              Cell: ( row ) => {
                                  if (row.value == null){
                                      return (
                                          <div
                                              style={{
                                                  textAlign:"center",
                                                  paddingTop:"4px",
                                                  paddingLeft:"15px"
                                              }}
                                          > - </div>
                                      )
                                  }
                                  else{
                                      return (
                                          <div
                                              style={{
                                                  textAlign:"center",
                                                  paddingTop:"4px",
                                                  paddingLeft:"12px"
                                              }}
                                          > {row.value} </div>
                                      )
                                  }
                              }
                          },
                          {
                              Header: "# of crawled product",
                              resizable: false,
                              accessor: "6",
                              Cell: ( row ) => {
                                  if (row.value == null){
                                      return (
                                          <div
                                              style={{
                                                  textAlign:"center",
                                                  paddingTop:"4px",
                                                  paddingLeft:"15px"
                                              }}
                                          > - </div>
                                      )
                                  }
                                  else{
                                      return (
                                          <div
                                              style={{
                                                  textAlign:"center",
                                                  paddingTop:"4px",
                                                  paddingLeft:"12px"
                                              }}
                                          > {row.value} </div>
                                      )
                                  }
                              }
                          }
                      ]}
                      minRows={10}
                      defaultPageSize={1000}
                      showPagination ={false}
                      bordered = {false} 
                      style={{
                          height: "500px"
                      }}
                      className="-striped -highlight"
                  />
                  <LoadProgramModal
                      show={this.state.loadmodalShow}
                      drawWorkflow= {this.drawWorkflow}
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
                  </Card>
                </Grid.Col> 
              </Grid.Row>

            </>
          );
        }
    }
}
export default JobTab;
