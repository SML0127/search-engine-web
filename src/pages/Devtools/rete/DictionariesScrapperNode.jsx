import React from "react";
import { Node, Socket } from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import PreviewDictionariesModal from "./PreviewDictionariesModal.react";

let g_rows_data = ''
let g_html = ''
let g_document = ''
let g_preview_result = []

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request['type'] == 'html_dictionaries'){
      g_html = request['html']['inner_html']
      g_document = (new DOMParser).parseFromString(g_html, 'text/html');
      g_preview_result = []
      console.log(g_rows_data)
      for (var idx in g_rows_data){
         if(g_rows_data[idx]['col_title'].trim() != "" && g_rows_data[idx]['col_rows_query'].trim != ""  && g_rows_data[idx]['col_value_query'].trim != "" && g_rows_data[idx]['col_value_attribute'].trim != ""){
            var title = g_document.evaluate(g_rows_data[idx]['col_title'], g_document, null, XPathResult.ANY_TYPE, null).iterateNext()
            if (title == null){
                break;
            }
            else{
               title = title.innerText
            }
            var elements = g_document.evaluate(g_rows_data[idx]['col_rows_query'], g_document, null, XPathResult.ANY_TYPE, null)
            var elements_key = g_document.evaluate(g_rows_data[idx]['col_rows_query'] + g_rows_data[idx]['col_key_query'].substring(1), g_document, null, XPathResult.ANY_TYPE, null)
            var elements_value = g_document.evaluate(g_rows_data[idx]['col_rows_query'] + g_rows_data[idx]['col_value_query'].substring(1), g_document, null, XPathResult.ANY_TYPE, null)
            var results = {}
            results['dictionary_title0'] = title
            if(elements != null){
               var result = ""
               var result_key = ""
               var result_value = ""
               var results_key = []
               var results_value = []
               var node_key = null
               var node_value = null
               while(node_key = elements_key.iterateNext()) {
                  if (g_rows_data[idx]['col_value_attribute'] == "alltext"){
                    result_key = node_key.innerText.trim()
                  }
                  else if (g_rows_data[idx]['col_value_attribute'] == "innerHTML"){
                    result_key = node_key.innerHTML
                  }
                  else if (g_rows_data[idx]['col_value_attribute'] == "outerHTML"){
                    result_key = node_key.innerHTML
                  }
                  else{
                    result_key = node_key.value
                  }
                  results_key.push(result_key)
               }
               while(node_value = elements_value.iterateNext()) {
                  if (g_rows_data[idx]['col_value_attribute'] == "alltext"){
                    result_value = node_value.innerText.trim()
                  }
                  else if (g_rows_data[idx]['col_value_attribute'] == "innerHTML"){
                    result_value = node_value.innerHTML
                  }
                  else if (g_rows_data[idx]['col_value_attribute'] == "outerHTML"){
                    result_value = node_value.innerHTML
                  }
                  else{
                    result_value = node_value.value
                  }
                  results_value.push(result_value)
               }
               for (var idx in results_key){
                  results[results_key[idx]] = results_value[idx] 
               }
            }
            g_preview_result.push({'dictionary': JSON.stringify(results)})
         }
      }
      //console.log( g_preview_result)
      chrome.runtime.sendMessage({node: 'dictionary', preview_result:g_preview_result}, function (response) {
      })
  }
  else if(request['type'] == 'dictionariesscrapper_xpath'){
      g_rows_data = request['rows_data']
  }
});



export class DictionariesScrapperNode extends Node {
    constructor(props){
        super(props)
        this.state = {
            modalShow:false,
            rows:[{}],
            previewmodalShow: false
        }
        this.updateState() 
    }
   
    updateState(){
        if(Object.keys(this.props.node.data).length >=1 ){
            var rows = this.props.node.data['rows']
            if(rows.length !== 0){
                for(var idx in rows){
                    var row_data = {}
                    for(var idxx in rows[idx]){
                        row_data[idxx] = rows[idx][idxx]
                    }
                    this.state.rows.push(row_data)
                }
            }
            this.state.rows.splice(0,1) 
        }
    }

    handleChangeKey(idx, value) {
      const rows = [...this.state.rows];
      rows[idx]['col_key'] =  value
      this.setState({ rows: rows })
    };    


    handleChangeValueAttr(idx, value) {
      const rows = [...this.state.rows];
      rows[idx]['col_value_attribute'] =  value
      this.setState({ rows: rows })
    };    


    handleChangeKeyAttr(idx, value) {
      const rows = [...this.state.rows];
      rows[idx]['col_key_attribute'] =  value
      this.setState({ rows: rows })
    };    



    handleChange = idx => e => {
        const { name, value } = e.target;
        const rows = [...this.state.rows];
        rows[idx][name] = value
        this.setState({ rows: rows })
    };
  
    handleAddRow = () => {
        const item = {'col_key':'', 'col_title':'', 'col_rows_query':'', 'col_key_query':'','col_key_attribute':'', 'col_value_query':'','col_value_attribute':''};
        this.setState({
            rows: [...this.state.rows, item]
        });
    };

    handleRemoveSpecificRow = (idx) => () => {
        const rows = [...this.state.rows]
        console.log(rows)
        rows.splice(idx, 1)
        console.log(rows)
        this.setState({ rows })
    }

    render() {
        const { node, bindSocket } = this.props;
        const { outputs, inputs, selected } = this.state;
        return (
          <div className={`node ${selected}`} >
            <div 
                onDoubleClick={() => {
                    this.setState({modalShow: true})
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
                    show={this.state.modalShow}
                    dialogClassName="modal-80w"
                    backdrop="static"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={ () => {
                        this.setState({modalShow:false})
                    }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Dictionaries Scrapper
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <table
                          className="table table-bordered table-hover"
                          id="tab_logic"
                        >
                        <thead>
                            <tr>
                                <th className="text-center"> XPATH </th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.rows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                    <td>
                                      <label style={{width:"13%"}}> 
                                        Dictionary name : 
                                      </label>
                                      <input
                                          type="text"
                                          name="col_key"
                                          readonly='readonly'
                                          style={{width:"73%", display:"inline", height:'33px', paddingTop:'1px'}}
                                          value={this.state.rows[idx]['col_key']}
                                          onChange={this.handleChange(idx)}
                                          className="form-control"
                                      />
                                      <DropdownButton id="dropdown-basic-secondary" title="Attr" style={{paddingLeft: "5px", paddingTop:"1px", width:"15%", display:"inline"}} >
                                        <Dropdown.Item onSelect={()=>{this.handleChangeKey(idx,"description_dictionary1")}}>Description Dictionary1</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeKey(idx,"description_dictionary2")}}>Description Dictionary2</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeKey(idx,"description_dictionary3")}}>Description Dictionary3</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeKey(idx,"description_dictionary4")}}>Description Dictionary4</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeKey(idx,"description_dictionary5")}}>Description Dictionary5</Dropdown.Item>
                                      </DropdownButton>
                                      <p/>
                                      <label style={{width:"13%"}}> 
                                        Title XPath : 
                                      </label>
                                      <input
                                          type="text"
                                          name="col_title"
                                          style={{width:"80%", display:"inline"}}
                                          value={this.state.rows[idx]['col_title']}
                                          onChange={this.handleChange(idx)}
                                          className="form-control"
                                      />
                                      <p/>
                                      <label style={{width:"13%"}}> 
                                        ROWS XPath :
                                      </label>
                                      <input
                                          type="text"
                                          name="col_rows_query"
                                          style={{width:"80%", display:"inline"}}
                                          value={this.state.rows[idx]['col_rows_query']}
                                          onChange={this.handleChange(idx)}
                                          className="form-control"
                                      />
                                      <p/>
                                      <label style={{width:"13%"}}> 
                                        KEY XPath :
                                      </label>
                                      <input
                                          type="text"
                                          name="col_key_query"
                                          style={{width:"80%", display:"inline"}}
                                          value={this.state.rows[idx]['col_key_query']}
                                          onChange={this.handleChange(idx)}
                                          className="form-control"
                                      />
                                      <p/>
                                      <label style={{width:"13%"}}> 
                                        KEY ATTRIBUTE :
                                      </label>
                                      <input
                                          type="text"
                                          name="col_key_attribute"
                                          value={this.state.rows[idx]['col_key_attribute']}
                                          onChange={this.handleChange(idx)}
                                          style={{width:"73%", display:"inline", height:'33px', paddingTop:'1px'}}
                                          className="form-control"
                                      />

                                      <DropdownButton id="dropdown-basic-secondary" title="Attr" style={{paddingLeft: "5px", paddingTop:"1px", width:"15%", display:"inline"}} >
                                        <Dropdown.Item onSelect={()=>{this.handleChangeKeyAttr(idx,"alltext")}}>alltext</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeKeyAttr(idx,"src")}}>src</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeKeyAttr(idx,"href")}}>href</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeKeyAttr(idx,"innerHTML")}}>innerHTML</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeKeyAttr(idx,"data-price")}}>data-price</Dropdown.Item>
                                      </DropdownButton>


                                      <p/>
                                      <label style={{width:"13%"}}> 
                                        VALUE XPath :
                                      </label>
                                      <input
                                          type="text"
                                          name="col_value_query"
                                          style={{width:"80%", display:"inline"}}
                                          value={this.state.rows[idx]['col_value_query']}
                                          onChange={this.handleChange(idx)}
                                          className="form-control"
                                      />
                                      <p/>
                                      <label style={{width:"13%"}}> 
                                        VALUE ATTRIBUTE :
                                      </label>
                                      <input
                                          type="text"
                                          name="col_value_attribute"
                                          value={this.state.rows[idx]['col_value_attribute']}
                                          onChange={this.handleChange(idx)}
                                          style={{width:"73%", display:"inline", height:'33px', paddingTop:'1px'}}
                                          className="form-control"
                                      />

                                      <DropdownButton id="dropdown-basic-secondary" title="Attr" style={{paddingLeft: "5px", paddingTop:"1px", width:"15%", display:"inline"}} >
                                        <Dropdown.Item onSelect={()=>{this.handleChangeValueAttr(idx,"alltext")}}>alltext</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeValueAttr(idx,"src")}}>src</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeValueAttr(idx,"href")}}>href</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeValueAttr(idx,"innerHTML")}}>innerHTML</Dropdown.Item>
                                      </DropdownButton>

                                    </td>

                                    <td style={{width:"6%"}}>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            style={{height:"300px"}}
                                            onClick={this.handleRemoveSpecificRow(idx)}
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
                    <Button color="primary" action='get_document_by_dictionaries' type="button"  
                        onClick={(obj) => {
                                var table_rows = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1].childNodes
                                var rows_data = []
                                for(var idx in table_rows){
                                    var row_data = {}
                                    if(typeof table_rows[idx].childNodes != "undefined"){
                                      for(let idxx in table_rows[idx].childNodes){
                                        for(let idxxx in table_rows[idx].childNodes[idxx].childNodes){
                                          if(table_rows[idx].childNodes[idxx].childNodes[idxxx].nodeName==="INPUT"){
                                        
                                            row_data[table_rows[idx].childNodes[idxx].childNodes[idxxx].name] = table_rows[idx].childNodes[idxx].childNodes[idxxx].value 
                                          }

                                        }
                                      }
                                    }
                                    if(Object.keys(row_data).length !== 0){
                                        rows_data.push(row_data)
                                    }
                                }

                                this.props.node.data['rows'] = rows_data
                                g_rows_data = rows_data
                                chrome.runtime.sendMessage({type:'dictionariesscrapper_xpath', rows_data:rows_data}, function (response) {
                                });
                                this.setState({
                                    rows:rows_data,
                                    previewmodalShow: true
                                })
                            }
                        }
                    >
                    Preview
                    </Button>
                    <Button color="primary" 
                        onClick={(obj) => {
                                var table_rows = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1].childNodes
                                var rows_data = []
                                for(var idx in table_rows){
                                    var row_data = {}
                                    if(typeof table_rows[idx].childNodes != "undefined"){
                                      for(let idxx in table_rows[idx].childNodes){
                                        for(let idxxx in table_rows[idx].childNodes[idxx].childNodes){
                                          if(table_rows[idx].childNodes[idxx].childNodes[idxxx].nodeName==="INPUT"){
                                        
                                            row_data[table_rows[idx].childNodes[idxx].childNodes[idxxx].name] = table_rows[idx].childNodes[idxx].childNodes[idxxx].value 
                                          }

                                        }
                                      }
                                    }
                                    if(Object.keys(row_data).length !== 0){
                                        rows_data.push(row_data)
                                    }
                                }

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
                                this.setState({modalShow:false})
                            }
                        }
                    >
                    Close
                    </Button>
                </Modal.Footer>
              </Modal>
              <PreviewDictionariesModal
                  show={this.state.previewmodalShow}
                  setModalShow={(s) => this.setState({previewmodalShow: s})}
              />
            </div>
        );
    }
}

