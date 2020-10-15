import React from "react";
import { Node, Socket } from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';

export class ListScrapperNode extends Node {
    constructor(props){
        super(props)
        this.state = {
            modalShow:false,
            objectId:"",
            rowsQuery:"",
            attr:""
        }
        this.updateState() 
    }
   
    updateState(){
        if(Object.keys(this.props.node.data).length === 3 ){
            this.state.objectId = this.props.node.data['objectId']
            this.state.rowsQuery = this.props.node.data['rowsQuery']
            this.state.attr = this.props.node.data['attr']
        }
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
                    backdrop="static"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={ () => {
                        this.setState({modalShow:false})
                    }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Options
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Object Id
                        <Form.Textarea
                            row={12}
                            defaultValue={this.state.objectId}
                        />
                        Rows Query
                        <Form.Textarea
                            row={12}
                            defaultValue={this.state.rowsQuery}
                        />
                        Attribute
                        <Form.Textarea
                            row={12}
                            defaultValue={this.state.attr}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button color="primary" 
                            onClick={(obj) => {
                                    var input_objectId = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[1]['value']
                                    var input_rowsQuery = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[3]['value']
                                    var input_attr = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[5]['value']
                                    this.setState(
                                        {
                                            objectId: input_objectId, 
                                            rowsQuery: input_rowsQuery, 
                                            attr: input_attr, 
                                            modalShow:false
                                        }
                                    )
                                    this.props.node.data['objectId'] = input_objectId
                                    this.props.node.data['rowsQuery'] = input_rowsQuery
                                    this.props.node.data['attr'] = input_attr
                                }
                            }
                        >
                        OK
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
        );
    }
}

