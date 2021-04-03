import React from "react";
import { Node, Socket} from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

export class OpenURLNode extends Node {
    constructor(props){
        super(props)
        this.state = {
            modalShow:false,
            url:"",
            query:"",
            zipcode_url:""
        }
        this.updateState()
    }


    checkBFSIter(){
      console.log(this.props.node.data['url'])
      chrome.tabs.update({url: this.props.node.data['url'], 'active': true}, function(tab) {})
    }



    updateState(){
        if(Object.keys(this.props.node.data).length >= 1){
            //console.log(this.props.node.data)
            this.state.url = this.props.node.data['url']
            this.state.query = this.props.node.data['query']
            this.state.zipcode_url = this.props.node.data['zipcode_url']
        }
    }


  render() {
    const { node, bindSocket} = this.props;
    const { outputs, selected } = this.state;

    return (
      <div className={`node ${selected}`} >
        <div 
            onDoubleClick={() => {
                this.setState({modalShow: true})
                }
            }
        >
        <div className="title">
          Open
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
		    <Button color="secondary" type="button"  style={{width:'80%'}}
          onClick = {()=> this.checkBFSIter()}
        >
           TEST
        </Button>
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
                    Open
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class = 'row' style={{width:'100%'}}>
                <label style={{width:'17%', marginTop:'5px', paddingLeft:'2%'}}>
                URL
                </label>
                <Form.Textarea
                    row={2}
                    style={{width:'80%', height:'30px', marginLeft:'3%', textAlign:'left', overflow:'hidden'}}
                    defaultValue={this.state.url}
                    wrap="off"
                />
              </div>
              <div class = 'row' style={{width:'100%'}}>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={
                    <Tooltip>
                      only for Amazon site
                    </Tooltip>
                  }
                >
                  <label style={{width:'17%', marginTop:'5px', paddingLeft:'2%'}}>
                  (optional) Zipcode URL
                  </label>
                </OverlayTrigger>
                <Form.Textarea
                    row={2}
                    style={{width:'80%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                    defaultValue={this.state.zipcode_url}
                />
              </div>
              <div class = 'row' style={{width:'100%'}}>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={
                    <Tooltip>
                      for checking web page is properly loaded
                    </Tooltip>
                  }
                >
                  <label style={{width:'8%', marginTop:'5px', paddingLeft:'2%'}}>
                  XPath 
                  </label>
                </OverlayTrigger>
                <label style={{width:'9%'}}>
                </label>
                <Form.Textarea
                    row={2}
                    style={{width:'80%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                    defaultValue={this.state.query}
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
                            var input_url = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1]['value']
                            var input_zipcode_url = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1]['value']
                            var input_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[2].childNodes[2]['value']
                            this.setState({url: input_url, query: input_query, zipcode_url: input_zipcode_url, modalShow:false})
                            this.props.node.data['url'] = input_url
                            this.props.node.data['zipcode_url'] = input_zipcode_url
                            this.props.node.data['query'] = input_query
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

