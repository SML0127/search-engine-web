import React from "react";
import { Node, Socket} from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';

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
    
    updateState(){
        if(Object.keys(this.props.node.data).length >= 1){
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
                    Open URL
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              URL
              <Form.Textarea
                  row={12}
                  defaultValue={this.state.url}
              />
              Zipcode URL (optional)
              <Form.Textarea
                  row={12}
                  defaultValue={this.state.zipcode_url}
              />
              QUERY
              <Form.Textarea
                  row={12}
                  defaultValue={this.state.query}
              />
              <p/>
              <div id="edit-selector" style={{float:"right"}}>
		          	  <Button color="primary" action='select-selector' type="button">
                    Get Relative XPath
                  </Button>
		          </div>

            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" 
                    onClick={(obj) => {
                            var input_url = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[1]['value']
                            var input_zipcode_url = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[3]['value']
                            var input_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[5]['value']
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

