// @flow

import ReactTable from "react-table"
import * as React from "react";
import { Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';


class PreviewDictionariesModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           g_preview : []
        }
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if(request['node'] == 'dictionary'){
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
                <ReactTable
                    data = {this.state.g_preview}
                    columns={[
                        {
                            Header: "Dictionary",
                            resizable: false,
                            accessor: "dictionary",
                            Cell: ( row ) => {
                                return (
                                    <div
                                        style={{
                                            textAlign:"center",
                                            whiteSpace:"normal",
                                            height:"300px"
                                        }}
                                    > {row.value} </div>
                                )
                            }
                        }
                    ]}
                    minRows={8}
                    defaultPageSize={20}
                    showPagination ={false}
                    bordered = {true} 
                    style={{
                        height: "300px"
                    }}
                    className="-striped -highlight"
                />
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
export default PreviewDictionariesModal;
