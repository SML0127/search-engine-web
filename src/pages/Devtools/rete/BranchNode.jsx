import React from "react";
import { Node, Socket} from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

export class BranchNode extends Node {
    constructor(props){
        super(props)
        this.state = {
            modalShow:false,
            condition:"",
        }
        this.updateState()
    }
    
    updateState(){
        if(Object.keys(this.props.node.data).length >= 1){
            console.log(this.props.node.data)
            this.state.condition = this.props.node.data['condition']
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
          Branch
        </div>
        <div>
        {/* Outputs */}
        {outputs.map(output => (
                <div className="output" key={output.key}>
                {output.key}
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
                    Branch
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class = 'row' style={{width:'100%'}}>
                <label style={{width:'100%',  marginTop:'5px', paddingLeft:'2%'}}>
                Check if input text is in current web page
                </label>
                <div style={{borderBottom: '1px solid rgba(0, 0, 0, 0.09)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)', marginRight:'1%', marginLeft:'2%', marginTop:'1%', width:'97%', marginBottom:'1.5%'}}></div>
                <label style={{width:'8%',  marginTop:'5px', paddingLeft:'2%'}}>
                Input text
                </label>
                <Form.Textarea
                    row={2}
                    style={{width:'90%', height:'30px', marginLeft:'1%', textAlign:'right', overflow:'hidden'}}
                    defaultValue={this.state.condition}
                />
              </div>

            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" 
                    onClick={(obj) => {
                            var input_condition = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1]['value']
                            this.setState({condition: input_condition, modalShow:false})
                            this.props.node.data['condition'] = input_condition
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

