import React from "react";
import { Node, Socket } from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

export class ExpanderNode extends Node {
    constructor(props){
        super(props)
        this.state = {
            modalShow:false,
            query:"",
            indices:"",
            attribute:"",
            noMatchSelf: "True",
            matchSelf: "True"
        }
        this.updateState() 
    }
   
    updateState(){
        if(Object.keys(this.props.node.data).length >= 1 ){
            this.state.query = this.props.node.data['query']
            this.state.indices = this.props.node.data['indices']
            this.state.attribute = this.props.node.data['attribute']
            this.state.prefix = this.props.node.data['prefix']
            this.state.suffix = this.props.node.data['suffix']
            this.state.attr_delimiter = this.props.node.data['attr_delimiter']
            this.state.attr_idx = this.props.node.data['attr_idx']
            this.state.noMatchSelf = this.props.node.data['noMatchSelf']
            this.state.matchSelf = this.props.node.data['matchSelf'];
        }
        if(typeof this.props.node.data['noMatchSelf'] == undefined){
            this.state.noMatchSelf = "True"
        }
        if(typeof this.props.node.data['matchSelf'] == undefined){
            this.state.matchSelf = "True"
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
                            Expander
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        QUERY
                        <Form.Textarea
                            row={12}
                            defaultValue={this.state.query}
                        />
                        Prefix(site)
                        <Form.Textarea
                            row={12}
                            defaultValue={this.state.prefix}
                        />
                        Suffix
                        <Form.Textarea
                            row={12}
                            defaultValue={this.state.suffix}
                        />
                        Attr delimiter
                        <Form.Textarea
                            row={12}
                            defaultValue={this.state.attr_delimiter}
                        />
                        Attr Index
                        <Form.Textarea
                            row={12}
                            defaultValue={this.state.attr_idx}
                        />
                        INDICES
                        <Form.Textarea
                            row={12}
                            defaultValue={this.state.indices}
                        />
                        ATTRIBUTE
                        <Form.Textarea
                            row={12}
                            defaultValue={this.state.attribute}
                        />
                        Add current url if there is no match
                        <DropdownButton id="dropdown-basic-secondary" title={this.state.noMatchSelf}>
                          <Dropdown.Item onClick={()=>{this.setState({noMatchSelf: "True"})}}>True</Dropdown.Item>
                          <Dropdown.Item onClick={()=>{this.setState({noMatchSelf: "False"})}}>False</Dropdown.Item>
                        </DropdownButton>
                        Add current url if there is a match
                        <DropdownButton id="dropdown-basic-secondary" title={this.state.matchSelf} style={{paddingTop:"1px", width:"15%", display:"inline"}} >
                          <Dropdown.Item onClick={()=>{this.setState({matchSelf: "True"})}}>True</Dropdown.Item>
                          <Dropdown.Item onClick={()=>{this.setState({matchSelf: "False"})}}>False</Dropdown.Item>
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
                                    var input_prefix = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[3]['value']
                                    var input_suffix = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[5]['value']
                                    var input_attr_delimiter = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[7]['value']
                                    var input_attr_idx = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[9]['value']
                                    var input_indices = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[11]['value']
                                    var input_attribute = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[13]['value']
                                    this.setState(
                                        {
                                            query: input_query, 
                                            indices: input_indices, 
                                            attribute: input_attribute, 
                                            prefix: input_prefix,
                                            suffix: input_suffix,
                                            attr_delimiter: input_attr_delimiter,
                                            attr_idx: input_attr_idx,
                                            modalShow:false
                                        }
                                    )
                                    //console.log(this.props)
                                    this.props.node.data['query'] = input_query;
                                    this.props.node.data['indices'] = input_indices;
                                    this.props.node.data['attribute'] = input_attribute;
                                    this.props.node.data['prefix'] = input_prefix;
                                    this.props.node.data['suffix'] = input_suffix;
                                    this.props.node.data['attr_delimiter'] = input_attr_delimiter;
                                    this.props.node.data['attr_idx'] = input_attr_idx;
                                    this.props.node.data['noMatchSelf'] = this.state.noMatchSelf;
                                    this.props.node.data['matchSelf'] = this.state.matchSelf;
                                    //this.props.node.data['url'] = input_url
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
        );
    }
}

