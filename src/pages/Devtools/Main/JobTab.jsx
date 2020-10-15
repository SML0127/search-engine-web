// @flow

import ReactTable from "react-table"
import * as React from "react";

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
import C3Chart from "react-c3js";
import $ from "min-jquery";

import EditableTree from '../TreeView/components/tree';
import LoadProgramModal from "./LoadProgramModal.react";
import SaveProgramModal from "./SaveProgramModal.react";
import axios from 'axios'
import setting_server from '../setting_server';
window.React = React;


let g_user_program = {};
let g_label = 1;
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
          selectedProjectId: -1
        }
        
        this.saveProgram = this.saveProgram.bind(this)
        this.saveGraphData = this.saveGraphData.bind(this)
        this.getTreeNodes = this.getTreeNodes.bind(this)
        this.getSelectedCategory = this.getSelectedCategory.bind(this)
        this.drawWorkflow = this.drawWorkflow.bind(this)
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

/*
{
  "id":0,
  "name":"Test 1",
  "dataDb":"host=141.223.197.33 port=54320 user=pse password=pse dbname=pse",
  "logDb":"host=141.223.197.33 port=54320 user=pse password=pse dbname=pse",
  "queue":"real_queue","ops":[{"id":1,"name":"OpenURL","label":16,"url":"https://search.rakuten.co.jp/search/mall/-/565751/tg1012290/?min=5000&review=4.5",
*/
    loadRecentProgram() { 
        var obj = this;
        axios.post(setting_server.DB_SERVER+'/api/db/userprogram', {
            req_type: "get_last_user_program",
            job_id: obj.props.jobId
        })
        .then(function (response) {
            if (response['data']['success'] == true) {
               let result = response['data']['result'][1];
               let upid = response['data']['result'][0];
               let user_program = result
               let tmp = obj.state.refresh

               g_user_program = user_program
               
               obj.setState({
                 refresh:++tmp, 
                 dataDB: JSON.stringify(user_program['dataDb'], null, 2), 
                 program:user_program,
                 upid: upid,
                 nodes: user_program['object_tree']
               })
            }
        })
        .catch(function (error) {
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
        console.log(zipcode_url)
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
            cur_nodeId = edges[cur_nodeId][0]
        }
        //console.log(cur_nodeId)
        //console.log(operator[cur_nodeId])
        //console.log(ops)
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

    // loadCategory() {
    //   const obj = this;
    //   axios.post('https://dblabpse.postech.ac.kr:5000/api/db/category', {
    //     req_type: "get_category",
    //   })
    //   .then(function (resultData) {
    //     if (resultData['data']['success'] == true) {
    //       const output = resultData['data']['output'];
    //       const category = JSON.parse(output[0]);
    //       obj.setState({
    //           category: category,
    //       });
    //     } else {
    //       console.log('loadCategory Failed');
    //     }
    //   })
    //   .catch(function (error) {
    //       console.log(error);
    //   });
    // }

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
    componentDidMount() {
      this.refreshList();
      this.loadRecentProgram()
      //this.getUrl();
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
                  "stateSelf": options['stateSelf'],
                  "stateMatchSelf": options['stateMatchSelf']
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
                      "query": options['rows'][idxClickOp]['col_name'],
                      "indices": options['rows'][idxClickOp]['col_query'],
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






    //getOperatorAndProps(operator, id, options){
    //    var op, props
    //    switch(operator) {
    //        case "BFSIterator":
    //            op =  {
    //                'props':{
    //                    'id': id,
    //                    'name': operator,
    //                    'timeout': 10   
    //                },
    //                'operators': []
    //            }
    //            if(Object.keys(options).length != 3 || typeof options['rows'][0] == "undefined"){
    //                props = {
    //                   'id': (id - 1),
    //                   'name': "Stage",
    //                   'type': 0,
    //                   'input': (id - 2),
    //                   'max_num_tasks': options['max_num_tasks'],
    //                   'max_num_local_tasks': options['max_num_local_tasks'],
    //                   'urls': []     
    //                }
    //            }
    //            else{
    //                var query = ""
    //                var initial_values = []
    //                var increments = []
    //                for(var idx in options['rows']){
    //                    query += options['rows'][idx]['query']
    //                    initial_values.push(options['rows'][idx]['initial'])
    //                    increments.push(options['rows'][idx]['increase'])
    //                }
    //                props = {
    //                   'id': (id - 1),
    //                   'name': "Stage",
    //                   'type': 1,
    //                   'input': (id - 2),
    //                   "query": query,
    //                   "initial_values": initial_values,
    //                   "increments": increments,
    //                   'max_num_tasks': options['max_num_tasks'],
    //                   'max_num_local_tasks': options['max_num_local_tasks'],
    //                   'urls': []     
    //                }
    //            }
    //            return [op, props]              
    //        case "ExtractPageURL":
    //            if(Object.keys(options).length == 3 ){
    //                if(options['base_query'] != "" && options['value_query'] != "" && options['value_attr']!= ""){
    //                    op =  {
    //                        "props":{
    //                           "id": id,
    //                           "name": "Expander",
    //                           "type": 1,
    //                           "base_query": options['base_query'],
    //                           "value_query": options['value_query'],
    //                           "value_attr": options['value_attr']
    //                        },
    //                        "operators":[]
    //                    }
    //                }
    //                else{
    //                    op =  {
    //                        "props":{
    //                           "id": id,
    //                           "name": "Expander",
    //                           "type": 0
    //                        },
    //                        "operators":[]
    //                    }
    //                }
    //            }
    //            else{
    //                op =  {
    //                    "props":{
    //                       "id": id,
    //                       "name": "Expander",
    //                       "type": 0
    //                    },
    //                    "operators":[]
    //                }
    //            }
    //            break;
    //        case "ExtractItemDetail":
    //            var columns_itemdetail = []
    //            for(var idx1 in options['rows']){
    //                if(options['rows'][idx1]['col_name'] != "" && options['rows'][idx1]['col_query'] && options['rows'][idx1]['col_attr'] && options['rows'][idx1]['col_essential']){
    //                    var col = {
    //                        "name":options['rows'][idx1]['col_name'],
    //                        "query":options['rows'][idx1]['col_query'],
    //                        "attr":options['rows'][idx1]['col_attr'],
    //                        "essential":options['rows'][idx1]['col_essential']
    //                    }
    //                    columns_itemdetail.push(col)
    //                }
    //            }
    //            op =  {
    //                "props": {
    //                    "id": id,
    //                    "name": "RowScrapper",
    //                    "table": options['table_name'],
    //                    "columns": columns_itemdetail
    //                },
    //                "operators": []
    //            }             
    //            break;
    //        case "ExtractItemList":
    //            var columns_itemlist = []
    //            for(var idx2 in options['rows']){
    //                if(options['rows'][idx2]['col_name'] != "" && options['rows'][idx2]['col_query'] && options['rows'][idx2]['col_attr'] && options['rows'][idx2]['col_essential']){
    //                    var col2 = {
    //                        "name":options['rows'][idx2]['col_name'],
    //                        "query":options['rows'][idx2]['col_query'],
    //                        "attr":options['rows'][idx2]['col_attr'],
    //                        "essential":options['rows'][idx2]['col_essential']
    //                    }
    //                    columns_itemlist.push(col2)
    //                }
    //            }
    //            op =  {
    //                "props": {
    //                    "id": id,
    //                    "name": "RowsScrapper",
    //                    "table": options['table_name'],
    //                    "base_query": options['base_query'],
    //                    "columns": columns_itemlist
    //                },
    //                "operators": []
    //            }             
    //            break;
    //        case "ClickOption":
    //            var columns_options = []
    //            for(var idx3 in options['rows']){
    //                if(options['rows'][idx3]['col_query'] &&  options['rows'][idx3]['col_essential']){
    //                    var col = {
    //                        "query":options['rows'][idx3]['col_query'],
    //                        "essential":options['rows'][idx3]['col_essential']
    //                    }
    //                    columns_options.push(col)
    //                }
    //            }
    //            op =  {
    //                "props": {
    //                    "id": id,
    //                    "name": "ClickOperator",
    //                    "columns": columns_options
    //                },
    //                "operators": []
    //            }             
    //            break;
    //        case "ValuesScrapper":
    //            var columns_itemlist = []
    //            for(var idx4 in options['rows']){
    //                if(options['rows'][idx4]['col_key'] != "" && options['rows'][idx4]['col_query'] && options['rows'][idx4]['col_attr'] && options['rows'][idx4]['col_essential']){
    //                    var col2 = {
    //                        "key":options['rows'][idx4]['col_key'],
    //                        "query":options['rows'][idx4]['col_query'],
    //                        "attr":options['rows'][idx4]['col_attr'],
    //                        "essential":options['rows'][idx4]['col_essential']
    //                    }
    //                    columns_itemlist.push(col2)
    //                }
    //            }
    //            op =  {
    //                "props": {
    //                    "id": id,
    //                    "name": "ValuesScrapper",
    //                    "object_id": options['objectId'],
    //                    "pairs": columns_itemlist
    //                },
    //                "operators": []
    //            }             
    //            break;
    //        case "DictionaryScrapper":
    //            op =  {
    //                "props":{
    //                   "id": id,
    //                   "name": "DictionaryScrapper",
    //                   "object_id": options['objectId'],
    //                   "rows_query": options['rowsQuery'],
    //                   "key_query": options['keyQuery'],
    //                   "key_attr": options['keyAttr'],
    //                   "value_query": options['valueQuery'],
    //                   "value_attr": options['valueAttr']
    //                },
    //                "operators":[]
    //            }
    //            break;
    //        case "ListScrapper":
    //            op =  {
    //                "props":{
    //                   "id": id,
    //                   "name": "ListScrapper",
    //                   "object_id": options['objectId'],
    //                   "rows_query": options['rowsQuery'],
    //                   "attr": options['attr'],
    //                },
    //                "operators":[]
    //            }

    //            break;
    //        default:
    //            console.log("Not defined opeartor")
    //    }
    //    return op
    //}


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


//   getR(){
//     console.log("--------------------")
//     var deferredSelector = this.getContentScript.selectSelector({
//       allowedElements: "*"
//     });
//     //console.log(selector.getItemCSSSelector())
//     deferredSelector.done(function(result) {
//       console.log("Controller.js result")
//       console.log(result)
//     }.bind(this));
//
//   }
//
//   getContentScript(location) {
//   
//     var contentScript;
//     console.log(location)
//   
//     // Handle calls from different places
//     if(location === "ContentScript") {
//       contentScript = ContentScript;
//       contentScript.backgroundScript = getBackgroundScript("ContentScript");
//       return contentScript;
//     }
//     else if(location === "BackgroundScript" || location === "DevTools") {
//       var backgroundScript = getBackgroundScript(location);
//   
//       // if called within background script proxy calls to content script
//       contentScript = {};
//         Object.keys(ContentScript).forEach(function(attr) {
//         if(typeof ContentScript[attr] === 'function') {
//           contentScript[attr] = function(request) {
//   
//             var reqToContentScript = {
//               contentScriptCall: true,
//               fn: attr,
//               request: request
//             };
//   
//             return backgroundScript.executeContentScript(reqToContentScript);
//           };
//         }
//         else {
//           contentScript[attr] = ContentScript[attr];
//         }
//       });
//       contentScript.backgroundScript = backgroundScript;
//       return contentScript;
//     }
//     else {
//       throw "Invalid ContentScript initialization - " + location;
//     }
//   };


  //convertToWorkflow(user_program){
  //    if(Object.keys(user_program).length == 0){
  //        return {}
  //    }
  //   
  //    if(typeof user_program['root_data'] != "undefined"){
  //        var workflow = {}
  //        var nodes = {}
  //        workflow['id'] = "work-flow@1.0.0"

  //        var openurl_data = user_program['root_data']
  //        nodes[user_program['root_data']['id']] = openurl_data
  //        for(var idx in user_program['operators']){
  //            for(var idxx in user_program['operators'][idx]['operators']){
  //                nodes[ user_program['operators'][idx]['operators'][idxx]['workflow_data']['id']] = user_program['operators'][idx]['operators'][idxx]['workflow_data']
  //            }
  //        }
  //        
  //        workflow['nodes'] = nodes
  //    }
  //    return workflow
  //}

    render() {
        const {items} = this.state;
        return (
        <>
          <Grid.Row>
            <Grid.Col sm={12} lg={12}>
              <Card
                  style={{
                      marginTop:"-7px",
                      marginLeft:'1px',
                      borderTop:'2px solid black'
                  }}
                  title="Your workflow"
              >
              <ReteGraph saveGraphData={this.saveGraphData} editor = {this.convertToWorkflow(g_user_program)} refresh={this.state.refresh} style={{marginBottom:'10%'}} job_id = {this.props.jobId}/>

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
                      height:'40px'
                  }}
              >
                <div class = 'row' style = {{marginLeft:'75%'}}>
                <Button 
                  type="button" 
                  color="primary"
                  style = {{float:'right',marginRight:"0.5%"}}
                  className="ml-auto" 
                  onClick={() => {
                        this.updateProgram()
                      }
                  }
                >
                UPDATE
                </Button>
                <Button 
                  type="button" 
                  color="primary"
                  style = {{float:'right',marginRight:"0.5%"}}
                  className="ml-auto" 
                  onClick={() => {
                        this.setState({savemodalShow: true})
                      }
                  }
                >
                SAVE
                </Button>

                <Button 
                  type="button" 
                  color="primary"
                  className="ml-auto" 
                  style = {{float:'right',marginRight:"5%"}}
                  onClick={() => {
                        this.setState({loadmodalShow: true})
                      }
                  }
                >
                LOAD
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
                                        > Running... </div>
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
                                        > Running... </div>
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
                </Card>
              </Grid.Col> 
            </Grid.Row>
          </>
        );
    }
}
export default JobTab;
