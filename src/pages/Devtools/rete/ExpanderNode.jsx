import React from "react";
import { Node, Socket } from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import Checkbox from 'rc-checkbox';

export class ExpanderNode extends Node {
    constructor(props){
        super(props)
        this.state = {
            modalShow:false,
            query:"",
            attribute:"",
            noMatchSelf: false,
            matchSelf: false,
            prevNoMatchSelf: false,
            prevMatchSelf: false
        }
        this.updateState() 
        this.checkBox1 = this.checkBox1.bind(this);
        this.checkBox2 = this.checkBox2.bind(this);
    }
   
    updateState(){
        if(Object.keys(this.props.node.data).length >= 1 ){
            this.state.query = this.props.node.data['query']
            this.state.attribute = this.props.node.data['attribute']
            this.state.prefix = this.props.node.data['prefix']
            this.state.suffix = this.props.node.data['suffix']
            this.state.attr_delimiter = this.props.node.data['attr_delimiter']
            this.state.attr_idx = this.props.node.data['attr_idx']
            this.state.noMatchSelf = this.props.node.data['noMatchSelf']
            this.state.matchSelf = this.props.node.data['matchSelf'];
        }
        if(typeof this.props.node.data['noMatchSelf'] == undefined){
            this.state.noMatchSelf = false
        }
        if(typeof this.props.node.data['matchSelf'] == undefined){
            this.state.matchSelf = false
        }
    }


    checkBox1(){
      this.setState({noMatchSelf : !this.state.noMatchSelf})
    }

    checkBox2(){
      this.setState({matchSelf : !this.state.matchSelf})
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
                        <div class = 'row' style={{width:'100%'}}>
                          <label style={{width:'17%', marginTop:'5px', paddingLeft:'2%'}}>
                          XPath
                          </label>
                          <Form.Textarea
                              row={2}
                              style={{width:'80%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                              defaultValue={this.state.query}
                          />
                        </div>
                        <div class = 'row' style={{width:'100%'}}>
                          <label style={{width:'17%', marginTop:'5px', paddingLeft:'2%'}}>
                          ATTRIBUTE
                          </label>
                          <Form.Textarea
                              row={12}
                              style={{width:'80%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                              defaultValue={this.state.attribute}
                          />
                        </div>
                        <div class = 'row' style={{width:'100%'}}>
                          <label style={{width:'17%', marginTop:'5px', paddingLeft:'2%'}}>
                          (optional) Prefix
                          </label>
                          <Form.Textarea
                              row={12}
                              style={{width:'80%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                              defaultValue={this.state.prefix}
                          />
                        </div>
                        <div class = 'row' style={{width:'100%'}}>
                          <label style={{width:'17%', marginTop:'5px', paddingLeft:'2%'}}>
                          (optional) Suffix
                          </label>
                          <Form.Textarea
                              row={12}
                              style={{width:'80%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                              defaultValue={this.state.suffix}
                          />
                        </div>
                        <div class = 'row' style={{width:'100%'}}>
                          <label style={{width:'17%', marginTop:'5px', paddingLeft:'2%'}}>
                          (optional) Attr delimiter
                          </label>
                          <Form.Textarea
                              row={12}
                              style={{width:'80%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                              defaultValue={this.state.attr_delimiter}
                          />
                        </div>
                        <div class = 'row' style={{width:'100%'}}>
                          <label style={{width:'17%', marginTop:'5px', paddingLeft:'2%'}}>
                          (optional) Attr Index
                          </label>
                          <Form.Textarea
                              row={12}
                              style={{width:'80%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                              defaultValue={this.state.attr_idx}
                          />
                        </div>
                        <div class = 'row' style = {{width:'100%', marginLeft:'1%', marginTop:'1%'}}>
                          Add current url if there is no match in XPath
                          <div
                            onClick = {()=> this.checkBox1()}
                            style={{marginLeft:'1%'}}
                          >
                            <Checkbox
                              checked={this.state.noMatchSelf}
                            />
                          </div>

                        </div>
                        <div class = 'row' style = {{width:'100%', marginLeft:'1%', marginTop:'1%'}}>
                          Add current url if there is a match in XPath
                          <div
                            onClick = {()=> this.checkBox2()}
                            style={{marginLeft:'1.85%'}}
                          >
                            <Checkbox
                              checked={this.state.matchSelf}
                            />
                          </div>
                        </div>
                    <div id="edit-selector" style={{float:"right", width:'100%'}}>
		                	 <Button color="secondary" action='select-selector-url' type="button"  style={{marginLeft:'86%', width:'14%'}}>
                          Get XPath for URL
                      </Button>
		                </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button color="primary" 
                            onClick={(obj) => {
                                    var input_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1]['value']
                                    var input_attribute = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1]['value']
                                    var input_prefix = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[2].childNodes[1]['value']
                                    var input_suffix = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[3].childNodes[1]['value']
                                    var input_attr_delimiter = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[4].childNodes[1]['value']
                                    var input_attr_idx = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[5].childNodes[1]['value']
                                    this.setState(
                                        {
                                            query: input_query, 
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
                                    this.setState({modalShow:false, noMatchSelf:this.state.prevNoMatchSelf, matchSelf:this.state.prevMatchSelf})
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

