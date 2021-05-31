// @flow

import ReactTable from "react-table"
import * as React from "react";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';


class PreviewMatrixOptionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           g_preview : []
        }
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if(request['node'] == 'option_matrix'){
                this.setState({g_preview:request['preview_result']})
            }
        }.bind(this));

    }

    
    componentDidMount(){
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.show == true){
      }
    }


    closeModal(){
        this.props.setModalShow(false)
    }

    closeModal(){
        this.props.setModalShow(false)
    }

    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={ () => {
                    this.props.setModalShow(false);
                }}
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Preview
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <Form.Textarea style = {{width:'100%', height :'250px', maxHeight:'250px', fontSize:'13px'}} value={this.state.g_preview}/>

            </Modal.Body>
            <Modal.Footer>
              <Button color="secondary" 
                onClick={(obj) => {
                  this.closeModal()
                }}
              >
                Close
              </Button>
            </Modal.Footer>
            </Modal>
        );
    }
}
export default PreviewMatrixOptionModal;
