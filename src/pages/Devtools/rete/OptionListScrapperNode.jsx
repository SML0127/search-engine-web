import React from "react";
import { Node, Socket} from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import PreviewListOptionModal from "./PreviewListOptionModal.react";
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'


let g_rows_data = ''
let g_html = ''
let g_document = ''
let g_preview_result = []

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request['type'] == 'html_list_option'){
      g_html = request['html']['inner_html']
      g_document = (new DOMParser).parseFromString(g_html, 'text/html');

      var elements_option_names = g_document.evaluate(g_rows_data['option_name_query'], g_document, null, XPathResult.ANY_TYPE, null)
      var elements_dropdown = g_document.evaluate(g_rows_data['option_dropdown_query'], g_document, null, XPathResult.ANY_TYPE, null)

      var node_option_name = null
      var option_names = []
      while(node_option_name = elements_option_names.iterateNext()) {
         var option_name = node_option_name.innerText.trim()
         option_names.push(option_name)
      }

      var node_dropdown = null
      var option_dropdown_values = [] 
      while(node_dropdown = elements_dropdown.iterateNext()) {
         var option_dropdown_html = (new DOMParser).parseFromString(node_dropdown.innerHTML, 'text/html');
         if (g_rows_data['option_attr'] == 'alltext' || g_rows_data['option_attr'].trim() == ''){
            var elements_dropdown_value = option_dropdown_html.evaluate('/'+g_rows_data['option_value_query'].substring(1), option_dropdown_html, null, XPathResult.ANY_TYPE, null)
            var node_dropdown_value = null
            var option_values = [] 
            while(node_dropdown_value = elements_dropdown_value.iterateNext()) {
               var option_dropdown_value = node_dropdown_value.innerText.trim()
               option_values.push(option_dropdown_value)
            }
            option_dropdown_values.push(option_values)
         }
         else if (g_rows_data['option_attr'] == "innerHTML" || g_rows_data['option_attr'] == "outerHTML"){
            var elements_dropdown_value = option_dropdown_html.evaluate(g_rows_data['option_value_query'], g_document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
            var node_dropdown_value = null
            var option_values = [] 
            while(node_dropdown_value = elements_dropdown_value.iterateNext()) {
               var option_dropdown_value = node_dropdown_value.innerHTML.trim()
               option_values.push(option_dropdown_value)
               console.log(option_dropdown_value)
            }
            option_dropdown_values.push(option_values)
         }
         else{
            var elements_dropdown_value = option_dropdown_html.evaluate(g_rows_data['option_value_query'] + '/@'+g_rows_data['option_attr'], g_document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
            var node_dropdown_value = null
            var option_values = [] 
            while(node_dropdown_value = elements_dropdown_value.iterateNext()) {
               var option_dropdown_value = node_dropdown_value.value
               option_values.push(option_dropdown_value)
               console.log(option_dropdown_value)
            }
            option_dropdown_values.push(option_values)
         }
      }
      var results = {}
      for (var idx in option_names){
         results[option_names[idx]] = option_dropdown_values[idx] 
      }
      chrome.runtime.sendMessage({node: 'option_list', preview_result: JSON.stringify(results,undefined, 4)}, function (response) {
      })
  }
  else if(request['type'] == 'listoptionscrapper_xpath'){
      g_rows_data = request['rows_data']
  }
});

export class OptionListScrapperNode extends Node {
    constructor(props){
        super(props)
        this.state = {
            modalShow:false,
            option_name_query:"",
            option_dropdown_query:"",
            option_value_query:"",
            option_attr:"alltext",
            previewmodalShow: false,
            essential:'False'
        }
        this.updateState()
    }


    updateState(){
        if(Object.keys(this.props.node.data).length >= 1){
            //console.log(this.props.node.data)
            this.state.option_name_query = this.props.node.data['option_name_query']
            this.state.option_dropdown_query = this.props.node.data['option_dropdown_query']
            this.state.option_value_query = this.props.node.data['option_value_query']
            this.state.option_attr = this.props.node.data['option_attr']
            this.state.option_essential = this.props.node.data['option_essential']
        }
    }

    handleChangeDropdown(value) {
      this.setState({ essential: value })
    };                                                                
 

  render() {
    const { node, bindSocket} = this.props;
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
          Option Scrapper (type: list)
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
        <Modal
            {...this.props}
            show={this.state.modalShow}
            backdrop="static"
            dialogClassName="modal-80w"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={ () => {
                this.setState({modalShow:false})
            }}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Option Scrapper (type - list)
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class = 'row' style={{width:'100%'}}>
                <label style={{width:'25%', marginTop:'5px', paddingLeft:'2%'}}>
                  List XPath for option names
                </label>
                <Form.Textarea
                    row={2}
                    style={{width:'72%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                    defaultValue={this.state.option_name_query}
                    wrap="off"
                />
              </div>
              <div class = 'row' style={{width:'100%'}}>
                <label style={{width:'25%', marginTop:'5px', paddingLeft:'2%'}}>
                  List XPath for option dropdowns
                </label>
                <Form.Textarea
                    row={2}
                    style={{width:'72%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                    defaultValue={this.state.option_dropdown_query}
                />
              </div>
              <div class = 'row' style={{width:'100%'}}>
                <label style={{width:'25%', marginTop:'5px', paddingLeft:'2%'}}>
                  List XPath for option values in dropdown
                </label>
                <Form.Textarea
                    row={2}
                    style={{width:'72%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                    defaultValue={this.state.option_value_query}
                />
              </div>
              <div class = 'row' style={{width:'100%'}}>
                <label style={{width:'25%', marginTop:'5px', paddingLeft:'2%'}}>
                  Attribute
                </label>
                <Form.Textarea
                    row={2}
                    style={{width:'72%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                    defaultValue={this.state.option_attr}
                />
              </div>
              <div class = 'row' style={{width:'100%'}}>
                <label style={{width:'25%', marginTop:'5px', paddingLeft:'2%'}}>
                  Essential
                </label>
                <input
                    type="text"
                    name="essential"
                    style={{width:"68%", display:"inline", height:'33px', paddingTop:'1px', marginLeft:'3%'}}
                    value={this.state.essential}
                    className="form-control"
                    readonly="readonly"
                />

                <DropdownButton id="dropdown-basic-secondary" title="T/F" style={{paddingLeft: "5px", paddingTop:"1px", width:"3%", display:"inline"}} >
                  <Dropdown.Item onSelect={()=>{this.handleChangeDropdown("True")}}>True</Dropdown.Item>
                  <Dropdown.Item onSelect={()=>{this.handleChangeDropdown("False")}}>False</Dropdown.Item>
                </DropdownButton>


              </div>
              <p/>
              <div id="edit-selector" style={{float:"right", width:'100%'}}>

		        <Button color="secondary" action='select-selector' type="button"  style={{marginLeft:'90%', width:'10%'}}>
                  Get XPath
                </Button>
		      </div>

            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" action='get_document_by_option_list' type="button"  
                    onClick={(obj) => {
                            var input_option_name_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1]['value']
                            var input_option_dropdown_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1]['value']
                            var input_option_value_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[2].childNodes[1]['value']
                            var input_option_attr = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[3].childNodes[1]['value']
                            var input_option_essential = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[4].childNodes[1]['value']
                            
                            this.props.node.data['option_name_query'] = input_option_name_query
                            this.props.node.data['option_dropdown_query'] = input_option_dropdown_query
                            this.props.node.data['option_value_query'] = input_option_value_query
                            this.props.node.data['option_attr'] = input_option_attr
                            this.props.node.data['option_essential'] = input_option_essential
                            var rows_data = {'option_name_query': input_option_name_query, 'option_dropdown_query': input_option_dropdown_query, 'option_value_query':input_option_value_query, 'option_attr':input_option_attr, 'option_essential': input_option_essential }
                            g_rows_data = rows_data
                            chrome.runtime.sendMessage({type:'listoptionscrapper_xpath', rows_data:rows_data}, function (response) {
                            });
                            this.setState({
                                option_name_query: input_option_name_query, 
                                option_dropdown_query: input_option_dropdown_query, 
                                option_value_query: input_option_value_query,
                                option_attr: input_option_attr,
                                option_essential: input_option_essential,
                                previewmodalShow: true
                            })
                        }
                    }
                >
                Preview
                </Button>

                <Button color="primary" 
                    onClick={(obj) => {
                            var input_option_name_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1]['value']
                            var input_option_dropdown_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1]['value']
                            var input_option_value_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[2].childNodes[1]['value']
                            var input_option_attr = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[3].childNodes[1]['value']
                            this.setState({'option_name_query': input_option_name_query, 'option_dropdown_query': input_option_dropdown_query, 'option_value_query': input_option_value_query, 'option_attr': input_option_attr, modalShow:false})
                            this.props.node.data['option_name_query'] = input_option_name_query
                            this.props.node.data['option_dropdown_query'] = input_option_dropdown_query
                            this.props.node.data['option_value_query'] = input_option_value_query
                            this.props.node.data['option_attr'] = input_option_attr
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
        <PreviewListOptionModal
            show={this.state.previewmodalShow}
            setModalShow={(s) => this.setState({previewmodalShow: s})}
        />
        </div>
        </div>
    );
  }
}

