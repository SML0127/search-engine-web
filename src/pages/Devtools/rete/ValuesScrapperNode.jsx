import React from "react";
import { Node, Socket} from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import PreviewValuesModal from "./PreviewValuesModal.react";
import axios from 'axios'


let g_rows_data = ''
let g_html = ''
let g_document = ''
let g_preview_result = []

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request['type'] == 'html'){
      //console.log('Preview')
      //console.log(request['html'])
      g_html = request['html']['inner_html']
      g_document = (new DOMParser).parseFromString(g_html, 'text/html');
      var g_doc = (new DOMParser).parseFromString(g_html, 'text/xml');
      g_preview_result = []
      for (var idx in g_rows_data){
         //console.log(g_rows_data[idx]['col_key'])
         //console.log(g_rows_data[idx]['col_query'])
         var element = g_document.evaluate(g_rows_data[idx]['col_query'], g_document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext()
         var result = ""
         if(element != null){
            if (g_rows_data[idx]['col_attr'] == "alltext"){
              //result = g_document.evaluate(g_rows_data[idx]['col_query']+'/text()', g_document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext()
              result = g_document.evaluate(g_rows_data[idx]['col_query']+'/text()', g_document, null, XPathResult.STRING_TYPE, null).stringValue.trim()

            }
            else if (g_rows_data[idx]['col_attr'] == "innerHTML"){
              result = g_document.evaluate(g_rows_data[idx]['col_query'], g_document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext().innerHTML
            }
            else if (g_rows_data[idx]['col_attr'] == "outerHTML"){
              result = g_document.evaluate(g_rows_data[idx]['col_query'], g_document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext().innerHTML
            }
            else{
              result = g_document.evaluate(g_rows_data[idx]['col_query']+'/@'+g_rows_data[idx]['col_attr'], g_document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext().value

            }
         }
         //console.log(typeof(result))
         //console.log(result)
         g_preview_result.push({'key':g_rows_data[idx]['col_key'], 'value':result })
      }
      //console.log('------0000000-------------')
      //console.log(g_preview_result) 
      chrome.runtime.sendMessage({preview_result: g_preview_result}, function (response) {
      })
  }
  else if(request['type'] == 'valuesscrapper_xpath'){
      g_rows_data = request['rows_data']
  }
});




export class ValuesScrapperNode extends Node {
    constructor(props){
        super(props)

        this.state = {
            modalShow:false,
            rows:[{'col_key':'name'}, {'col_key':'price'}, {'col_key':'description'}],
            prev_rows:[],
            previewmodalShow: false,
        }
        this.updateState()
    }


    updateState(){
        if(Object.keys(this.props.node.data).length >= 1 ){
            this.state.rows = [{}]
            var rows = this.props.node.data['rows']
            for(var idx in rows){
                var row_data = {}
                for(var idxx in rows[idx]){
                    row_data[idxx] = rows[idx][idxx]
                }
                this.state.rows.push(row_data)
            }
            this.state.rows.splice(0,1) 
        }
    }
      
    handleChange = idx => e => {
        const { name, value } = e.target;
        const rows = [...this.state.rows];
        rows[idx][name] = value
        this.setState({ rows: rows })
    };
    
    
    handleChangeAttr(idx, value) {
      const rows = [...this.state.rows];
      rows[idx]['col_attr'] =  value
      this.setState({ rows: rows })
    };    

    handleChangeDropdown(idx, value) {
      const rows = [...this.state.rows];
      rows[idx]['col_essential'] =  value
      this.setState({ rows: rows })
    };                                                                
 
    handleAddRow = () => {
        const item = {'col_key':'', 'col_attr':'', 'col_query':'','col_essential':''};
        this.setState({
            rows: [...this.state.rows, item]
        });
    };

    handleRemoveSpecificRow = (idx) => () => {
        const rows = [...this.state.rows]
        rows.splice(idx, 1)
        //this.state.rows = rows
        this.setState({ rows: rows })
    }

  render() {
    const { node, bindSocket } = this.props;
    const { outputs, inputs, selected } = this.state;
    return (
      <div className={`node ${selected}`} >
        <div 
            onDoubleClick={() => {
                this.setState({modalShow: true})
                this.state.prev_rows = this.state.rows
                }
            }
        >
            <div className="title">
              {node.name}
            </div>
            
            <div>
            {/* Outputs */}
            {outputs.map(output => (
                <div className="output" key={output.key}>
                    <Socket
                        type="output"
                        socket={output.socket}
                        io={output}
                        innerRef={bindSocket}
                    />
                </div>
            ))}
            </div>
            <div>
            {/* Inputs */}
            {inputs.map(input => (
                <div class="inline"className="input" key={input.key}>
                    <Socket
                      type="input"
                      socket={input.socket}
                      io={input}
                      innerRef={bindSocket}
                    />
                </div>
            ))}
            </div>
            </div>

            <Modal
                {...this.props}
                dialogClassName="modal-80w"
                show={this.state.modalShow}
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={ () => {
                    this.setState({modalShow:false})
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Values Scrapper
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <table
                        className="table table-bordered table-hover"
                        id="tab_logic"
                    >
                        <thead>
                            <tr>
                                <th className="text-center"> KEY </th>
                                <th className="text-center"> XPATH</th>
                                <th className="text-center"> ATTRIBUTE </th>
                                <th className="text-center"> ESSENTIAL </th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.rows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                    <td style = {{width:'12%'}}>
                                        <input
                                            type="text"
                                            name="col_key"
                                            value={this.state.rows[idx]['col_key']}
                                            onChange={this.handleChange(idx)}
                                            className="form-control"
                                            style={{height:'33px'}}
                                        />
                                    </td>
                                    <td style = {{width:'40%'}}>
                                        <input
                                            type="text"
                                            name="col_query"
                                            value={this.state.rows[idx]['col_query']}
                                            onChange={this.handleChange(idx)}
                                            className="form-control"
                                            style={{width:'100%', display:'inline'}}
                                        />
                                    </td>

                                    <td style = {{width:'20%'}}>
                                        <input
                                            type="text"
                                            name="col_attr"
                                            value={this.state.rows[idx].col_attr}
                                            onChange={this.handleChange(idx)}
                                            style={{width:"60%", display:"inline", height:'33px', paddingTop:'1px'}}
                                            className="form-control"
                                        />

                                        <DropdownButton id="dropdown-basic-secondary" title="Attr" style={{paddingLeft: "5px", paddingTop:"1px", width:"15%", display:"inline"}} >
                                          <Dropdown.Item onSelect={()=>{this.handleChangeAttr(idx,"alltext")}}>alltext</Dropdown.Item>
                                          <Dropdown.Item onSelect={()=>{this.handleChangeAttr(idx,"src")}}>src</Dropdown.Item>
                                          <Dropdown.Item onSelect={()=>{this.handleChangeAttr(idx,"href")}}>href</Dropdown.Item>
                                          <Dropdown.Item onSelect={()=>{this.handleChangeAttr(idx,"innerHTML")}}>innerHTML</Dropdown.Item>
                                          <Dropdown.Item onSelect={()=>{this.handleChangeAttr(idx,"outerHTML")}}>outerHTML</Dropdown.Item>
                                        </DropdownButton>
                                    </td>
                                    <td style = {{width:'18%'}}>
                                      <input
                                          type="text"
                                          name="col_essential"
                                          style={{width:"60%", display:"inline", height:'33px', paddingTop:'1px'}}
                                          value={this.state.rows[idx]['col_essential']}
                                          className="form-control"
                                          readonly="readonly"
                                      />

                                      <DropdownButton id="dropdown-basic-secondary" title="T/F" style={{paddingLeft: "5px", paddingTop:"1px", width:"15%", display:"inline"}} >
                                        <Dropdown.Item onSelect={()=>{this.handleChangeDropdown(idx,"True")}}>True</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeDropdown(idx,"False")}}>False</Dropdown.Item>
                                      </DropdownButton>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={this.handleRemoveSpecificRow(idx)}
                                            style={{width:'100%'}}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div id="edit-selector" style={{float:"right", width:'100%'}}>
		            	  <Button color='secondary' onClick={this.handleAddRow}  style={{width:'90%'}}>
                      +
                    </Button>
		            	  <Button color="secondary" action='select-selector' type="button"  style={{width:'10%'}}>
                      Get XPath
                    </Button>
		            </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="primary" action='get_document' type="button"  
                        onClick={(obj) => {
                                var table_rows = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1].childNodes
                                //console.log(table_rows)
                                var rows_data = []
                                for(var idx in table_rows){
                                    var row_data = {}
                                    //console.log(table_rows[idx])
                                    for(var idxx in table_rows[idx].childNodes){
                                        if(typeof table_rows[idx].childNodes[idxx].childNodes != "undefined"){
                                            if(table_rows[idx].childNodes[idxx].childNodes[0].nodeName === "INPUT"){
                                                row_data[table_rows[idx].childNodes[idxx].childNodes[0].name] = table_rows[idx].childNodes[idxx].childNodes[0].value 
                                            }
                                        }
                                    }
                                    if(Object.keys(row_data).length !== 0){
                                        rows_data.push(row_data)
                                    }
                                }
                                this.props.node.data['rows'] = rows_data
                                g_rows_data = rows_data
                                chrome.runtime.sendMessage({type:'valuesscrapper_xpath', rows_data:rows_data}, function (response) {
                                });
                                this.setState({
                                    rows:rows_data,
                                    previewmodalShow:true
                                })
                            }
                        }
                    >
                    Preview
                    </Button>

                    <Button color="primary" 
                        onClick={(obj) => {
                                var table_rows = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1].childNodes
                                //console.log(table_rows)
                                var rows_data = []
                                for(var idx in table_rows){
                                    var row_data = {}
                                    //console.log(table_rows[idx])
                                    for(var idxx in table_rows[idx].childNodes){
                                        if(typeof table_rows[idx].childNodes[idxx].childNodes != "undefined"){
                                            if(table_rows[idx].childNodes[idxx].childNodes[0].nodeName === "INPUT"){
                                                row_data[table_rows[idx].childNodes[idxx].childNodes[0].name] = table_rows[idx].childNodes[idxx].childNodes[0].value 
                                            }
                                        }
                                    }
                                    if(Object.keys(row_data).length !== 0){
                                        rows_data.push(row_data)
                                    }
                                }
                                //console.log(rows_data)
                                this.setState({
                                    rows:rows_data,
                                    modalShow:false
                                })
                                this.props.node.data['rows'] = rows_data
                            }
                        }
                    >
                    Save
                    </Button>
                    <Button color="secondary" 
                        onClick={(obj) => {
                                this.setState({
                                    rows: this.state.prev_rows,
                                    modalShow:false
                                })
                            }
                        }
                    >
                    Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <PreviewValuesModal
                show={this.state.previewmodalShow}
                rows_data = {g_rows_data}
                preview = {g_preview_result}
                setModalShow={(s) => this.setState({previewmodalShow: s})}
            />

        </div>
    );
  }
}

