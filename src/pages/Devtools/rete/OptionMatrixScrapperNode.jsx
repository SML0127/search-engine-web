import React from "react";
import { Node, Socket} from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

export class OptionMatrixScrapperNode extends Node {
    constructor(props){
        super(props)
        this.state = {
            modalShow:false,
            option_name_query:"",
            option_dropdown_query:"",
            option_value_query:""
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
        </div>
        </div>
    );
  }
}

