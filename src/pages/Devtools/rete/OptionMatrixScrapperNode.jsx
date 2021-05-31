import React from "react";
import { Node, Socket} from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import PreviewMatrixOptionModal from "./PreviewMatrixOptionModal.react";


let g_rows_data = ''
let g_html = ''
let g_document = ''
let g_preview_result = []

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request['type'] == 'html_matrix_option'){
      g_html = request['html']['inner_html']
      g_document = (new DOMParser).parseFromString(g_html, 'text/html');
      

      //g_rows_data['option_name_query'] // //td[position() mod 2 = 1]/span[@class='inventory_title']
      //g_rows_data['option_x_value_query'] // //tr[1]/td[@class='inventory_choice_name']//span
      //g_rows_data['option_y_value_query'] // //tr[position()>1]/td[@class='inventory_choice_name']//span
      //g_rows_data['option_matrix_row_wise_value_query'] // //td[@class='inventory']/span[@class='inventory_soldout'] | //input[@name='inventory_id']
      var elements_option_names = g_document.evaluate(g_rows_data['option_name_query'], g_document, null, XPathResult.ANY_TYPE, null)
      var option_col_values = g_document.evaluate(g_rows_data['option_x_value_query'], g_document, null, XPathResult.ANY_TYPE, null)
      var option_row_values = g_document.evaluate(g_rows_data['option_y_value_query'], g_document, null, XPathResult.ANY_TYPE, null)
      var option_matrix_values = g_document.evaluate(g_rows_data['option_matrix_row_wise_value_query'], g_document, null, XPathResult.ANY_TYPE, null)

      var node_option_name = null
      var option_names = []
      while(node_option_name = elements_option_names.iterateNext()) {
         var option_name = node_option_name.innerText.trim()
         option_names.push(option_name)
      }
      var node_option_col_value = null
      var option_col_values_array = []
      while(node_option_col_value = option_col_values.iterateNext()) {
         var option_value = node_option_col_value.innerText.trim()
         option_col_values_array.push(option_value)
      }

      var node_option_row_value = null
      var option_row_values_array = []
      while(node_option_row_value = option_row_values.iterateNext()) {
         var option_value = node_option_row_value.innerText.trim()
         option_row_values_array.push(option_value)
      }

      var node_option_matrix_value = null
      var option_matrix_values_array = []
      while(node_option_matrix_value = option_matrix_values.iterateNext()) {
         var option_value = node_option_matrix_value.innerText.trim()
         option_matrix_values_array.push(option_value)
      }

      //console.log(option_names)
      //console.log(option_col_values_array)
      //console.log(option_row_values_array)
      //console.log(option_matrix_values_array)

      var results = {}
      if (option_names.length > 0){
         results['option_names'] = option_names
      }
      if (option_row_values_array.length > 0){
         results['option_row_values_array'] = option_row_values_array
      }
      if (option_col_values_array.length > 0){
         results['option_col_values_array'] = option_col_values_array
      }
      if (option_matrix_values_array.length > 0){
         results['option_matrix_values'] = option_matrix_values_array
      }

      //console.log(results)
      chrome.runtime.sendMessage({node: 'option_matrix', preview_result: JSON.stringify(results, undefined, 4)}, function (response) {
      })
  }
  else if(request['type'] == 'matrixoptionscrapper_xpath'){
      g_rows_data = request['rows_data']
  }
});




export class OptionMatrixScrapperNode extends Node {
    constructor(props){
        super(props)
        this.state = {
            modalShow:false,
            option_name_query:"",
            option_x_value_query:"",
            option_y_value_query:"",
            option_matrix_row_wise_value_query: "",
            previewmodalShow: false,
        }
        this.updateState()
    }


    updateState(){
        if(Object.keys(this.props.node.data).length >= 1){
            //console.log(this.props.node.data)
            this.state.option_name_query = this.props.node.data['option_name_query']
            this.state.option_x_value_query = this.props.node.data['option_x_value_query']
            this.state.option_y_value_query = this.props.node.data['option_y_value_query']
            this.state.option_matrix_row_wise_value_query = this.props.node.data['option_matrix_row_wise_value_query']
        }
    }


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
          Option Scrapper (type: matrix)
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
                    Option Scrapper (type - matrix)
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class = 'row' style={{width:'100%'}}>
                <label style={{width:'32%', marginTop:'5px', paddingLeft:'2%'}}>
                  List XPath for option names
                </label>
                <Form.Textarea
                    row={2}
                    style={{width:'65%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                    defaultValue={this.state.option_name_query}
                    wrap="off"
                />
              </div>
              <div class = 'row' style={{width:'100%'}}>
                <label style={{width:'32%', marginTop:'5px', paddingLeft:'2%'}}>
                  List XPath for option row value in matrix
                </label>
                <Form.Textarea
                    row={2}
                    style={{width:'65%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                    defaultValue={this.state.option_x_value_query}
                />
              </div>
              <div class = 'row' style={{width:'100%'}}>
                <label style={{width:'32%', marginTop:'5px', paddingLeft:'2%'}}>
                  List XPath for option col values in matrix
                </label>
                <Form.Textarea
                    row={2}
                    style={{width:'65%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                    defaultValue={this.state.option_y_value_query}
                />
              </div>
              <div class = 'row' style={{width:'100%'}}>
                <label style={{width:'32%', marginTop:'5px', paddingLeft:'2%'}}>
                  List XPath for option values in matrix (row-wise)
                </label>
                <Form.Textarea
                    row={2}
                    style={{width:'65%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                    defaultValue={this.state.option_matrix_row_wise_value_query}
                />
              </div>
              <p/>
              <div id="edit-selector" style={{float:"right", width:'100%'}}>
		            	 <Button color="secondary" action='select-selector' type="button"  style={{marginLeft:'90%', width:'10%'}}>
                    Get XPath
                  </Button>
		          </div>

            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" action='get_document_by_option_matrix' type="button"  
                    onClick={(obj) => {
                            var input_option_name_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1]['value']
                            var input_option_x_value_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1]['value']
                            var input_option_y_value_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[2].childNodes[1]['value']
                            var input_option_matrix_row_wise_value_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[3].childNodes[1]['value']
                            this.props.node.data['option_name_query'] = input_option_name_query
                            this.props.node.data['option_x_value_query'] = input_option_x_value_query
                            this.props.node.data['option_y_value_query'] = input_option_y_value_query
                            this.props.node.data['option_matrix_row_wise_value_query'] = input_option_matrix_row_wise_value_query
                            var rows_data = {'option_name_query': input_option_name_query, 'option_x_value_query': input_option_x_value_query, 'option_y_value_query':input_option_y_value_query, "option_matrix_row_wise_value_query": input_option_matrix_row_wise_value_query }
                            g_rows_data = rows_data
                            chrome.runtime.sendMessage({type:'matrixoptionscrapper_xpath', rows_data:rows_data}, function (response) {
                            });
                            this.setState({
                                option_name_query: input_option_name_query, 
                                option_x_value_query: input_option_x_value_query, 
                                option_y_value_query: input_option_y_value_query,
                                option_matrix_row_wise_value_query: input_option_matrix_row_wise_value_query, 
                                previewmodalShow:true
                            })
                        }
                    }
                >
                Preview
                </Button>
                <Button color="primary" 
                    onClick={(obj) => {
                            var input_option_name_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1]['value']
                            var input_option_x_value_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1]['value']
                            var input_option_y_value_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[2].childNodes[1]['value']
                            var input_option_matrix_row_wise_value_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[3].childNodes[1]['value']
                            this.setState({option_name_query: input_option_name_query, option_x_value_query: input_option_x_value_query, option_y_value_query: input_option_y_value_query,option_matrix_row_wise_value_query: input_option_matrix_row_wise_value_query, modalShow:false})
                            this.props.node.data['option_name_query'] = input_option_name_query
                            this.props.node.data['option_x_value_query'] = input_option_x_value_query
                            this.props.node.data['option_y_value_query'] = input_option_y_value_query
                            this.props.node.data['option_matrix_row_wise_value_query'] = input_option_matrix_row_wise_value_query
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
        <PreviewMatrixOptionModal
            show={this.state.previewmodalShow}
            setModalShow={(s) => this.setState({previewmodalShow: s})}
        />
        </div>
        </div>
    );
  }
}

