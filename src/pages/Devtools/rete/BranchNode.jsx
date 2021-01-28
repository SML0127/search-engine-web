import React from "react";
import { Node, Socket} from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Checkbox from 'rc-checkbox';

export class BranchNode extends Node {
    constructor(props){
        super(props)
        this.state = {
            modalShow:false,
            condition:"",
            is_xpath: false,
            is_text: true,
        }
        this.updateState()
        this.checkBox1 = this.checkBox1.bind(this);
        this.checkBox2 = this.checkBox2.bind(this);
    }
 
    checkBox1(){
      this.setState({is_xpath : false, is_text: true})
    }
    checkBox2(){
      this.setState({is_xpath : true, is_text: false})
    }

   
    updateState(){
        if(Object.keys(this.props.node.data).length >= 1){
            console.log(this.props.node.data)
            this.state.condition = this.props.node.data['condition']
            this.state.is_xpath = this.props.node.data['is_xpath']
            this.state.is_text = this.props.node.data['is_text'];
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
                Condition
                </label>
                <div style={{borderBottom: '1px solid rgba(0, 0, 0, 0.09)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)', marginRight:'1%', marginLeft:'2%', marginTop:'1%', width:'97%', marginBottom:'1.5%'}}></div>
                <label style={{width:'11%',  marginTop:'5px', paddingLeft:'2%'}}>
                Contains Text
                </label>
                <div
                  onClick = {()=> this.checkBox1()}
                  style={{marginLeft:'1%', marginTop:'5px'}}
                >
                  <Checkbox
                    checked={this.state.is_text}
                  />
                </div>
                <label style={{width:'17%',  marginTop:'5px', marginLeft:'30%'}}>
                Contains Element(XPath)
                </label>
                <div
                  onClick = {()=> this.checkBox2()}
                  style={{marginLeft:'1%', marginTop:'5px'}}
                >
                  <Checkbox
                    checked={this.state.is_xpath}
                  />
                </div>


                <div style={{borderBottom: '1px solid rgba(0, 0, 0, 0.09)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)', marginRight:'1%', marginLeft:'2%', marginTop:'1%', width:'97%', marginBottom:'1.5%'}}></div>
                <label style={{width:'12%',  marginTop:'5px', paddingLeft:'2%'}}>
                Condition value
                </label>
                <Form.Textarea
                    row={2}
                    style={{width:'86%', height:'30px', marginLeft:'1%', textAlign:'right', overflow:'hidden'}}
                    defaultValue={this.state.condition}
                    placeholder="Enter text or xpath of element"
                />
              </div>

            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" 
                    onClick={(obj) => {
                            var input_condition = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[8]['value']
                            this.setState({condition: input_condition, modalShow:false})
                            this.props.node.data['condition'] = input_condition
                            this.props.node.data['is_text'] = this.state.is_text
                            this.props.node.data['is_xpath'] = this.state.is_xpath
                        }
                    }
                >
                Save
                </Button>
                <Button color="secondary" 
                    onClick={(obj) => {
                            this.setState({modalShow:false, is_text: this.props.node.data['is_text'], is_xpath: this.props.node.data['is_xpath']})
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

