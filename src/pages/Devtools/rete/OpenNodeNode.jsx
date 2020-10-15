import React from "react";
import { Node, Socket} from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

export class OpenNodeNode extends Node {
    constructor(props){
        super(props)
        this.state = {
            modalShow:false,
            query:"",
            indices:"",
            stateSelf:"0"
        }
        this.updateState()
    }
    
    updateState(){
        if(Object.keys(this.props.node.data).length >= 1){
            this.state.query = this.props.node.data['query']
            this.state.indices = this.props.node.data['indices']
            this.state.stateSelf = this.props.node.data['stateSelf']
        }
    }


  render() {
    const { node, bindSocket} = this.props;
    const { outputs, inputs, selected } = this.state;

    return (
      <div className={`node ${selected}`}>
        <div 
            onDoubleClick={() => {
                this.setState({modalShow: true})
                }
            }
        >
        <div className="title">
          {node.name}
        </div>

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
                    Open Node
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              QUERY
              <Form.Textarea
                  row={12}
                  defaultValue={this.state.query}
              />
              INDICES
              <Form.Textarea
                  row={12}
                  defaultValue={this.state.indices}
              />
              SELF
              <DropdownButton id="dropdown-basic-secondary" title={this.state.stateSelf}>
                <Dropdown.Item onClick={()=>{this.setState({stateSelf: '0'})}}>0</Dropdown.Item>
                <Dropdown.Item onClick={()=>{this.setState({stateSelf: '1'})}}>1</Dropdown.Item>
              </DropdownButton>
                <div id="edit-selector" style={{float:"right"}}>
		            	  <Button color="primary" action='select-selector' type="button">
                      Get Relative XPath
                    </Button>
		            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" 
                    onClick={(obj) => {
                            var input_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[1]['value']
                            var input_indices = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[3]['value']
                            this.setState({query: input_query, indices: input_indices, modalShow:false})
                            this.props.node.data['query'] = input_query
                            this.props.node.data['indices'] = input_indices
                            this.props.node.data['self'] = this.state.stateSelf
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

