import React from "react";
import { Node, Socket} from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

export class HoverNode extends Node {
    constructor(props){
        super(props)
        this.state = {
            modalShow:false,
            hover:"",
        }
        this.updateState()
    }
    
    updateState(){
        if(Object.keys(this.props.node.data).length >= 1){
            console.log(this.props.node.data)
            this.state.hover = this.props.node.data['hover']
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
          Hover
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
                    Hover
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class = 'row' style={{width:'100%'}}>
                <label style={{width:'25%', marginTop:'5px', paddingLeft:'2%'}}>
                Enter the XPath of element to hover
                </label>
                <Form.Textarea
                    row={2}
                    placeholder="/body//xpath//of//element"
                    style={{width:'75%', height:'30px', textAlign:'right', overflow:'hidden'}}
                    defaultValue={this.state.hover}
                />
              </div>

            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" 
                    onClick={(obj) => {
                            var input_hover = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1]['value']
                            this.setState({hover: input_hover, modalShow:false})
                            this.props.node.data['hover'] = input_hover
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

