// @flow

import ReactTable from "react-table"
import * as React from "react";
import { Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'

let g_html = ''
let g_rows_data = ''
let g_document = ''
let g_preview_result = []


class PreviewValuesModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.initState()

        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            //console.log('111111111111111111')
            //console.log(request)
            this.setState({g_preview_result:request['preview_result']})
        }.bind(this));

    }

    
    componentDidMount(){
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.show == true){
        //console.log(nextProps)
        //var rows_data = nextProps.rows_data
        //console.log('------------------------')
        //console.log(g_preview_result)
        //console.log('------------------------')
        //
        //console.log(this.state.g_preview_result)
        //if(this.state.g_preview_result != g_preview_result){
        //    console.log('--------111111111-----------')
        //    this.setState({g_preview_result: g_preview_result})
        //}
      }
    }


    closeModal(){
        this.props.setModalShow(false)
    }

    initState() {
        return {
            programs_info: [],
        }
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
                    data = {this.state.g_preview_result}
                    columns={[
                        {
                            Header: "Key",
                            resizable: false,
                            accessor: "key",
                            width:150,
                            Cell: ( row ) => {
                                return (
                                    <div
                                        style={{
                                            textAlign:"center",
                                        }}
                                    > {row.value} </div>
                                )
                            }
                        },
                        {
                            Header: "Value",
                            resizable: false,
                            accessor: "value",
                            Cell: ( row ) => {
                                return (
                                    <div
                                        style={{
                                            textAlign:"center",
                                        }}
                                    > {row.value} </div>
                                )
                            }
                        },
                    ]}
                    minRows={5}
                    defaultPageSize={100}
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
export default PreviewValuesModal;
