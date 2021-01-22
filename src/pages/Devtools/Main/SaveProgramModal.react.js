// @flow

import * as React from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "tabler-react";
import axios from 'axios'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import setting_server from '../setting_server';

class SaveProgramModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initState()
    }

    
    componentDidMount(){
        //this.loadUserProgram()
    }
    
    componentWillReceiveProps(nextProps) {
    }

    initState() {
      let curUrl = window.location.href;
        return {
            programs_info: []
        }
    }

    loadUserProgram() {
        var obj = this;
        console.log('get_user_program in SaveP ')
        axios.post(setting_server.DB_SERVER+'/api/db/userprogram', {
            req_type: "get_user_program",
            job_id: obj.props.jobId
        })
        .then(function (resultData){
            obj.setState({
                programs_info: resultData["data"]['output']
            })
        })
        .catch(function (error){
            console.log(error)
        });
    }

    closeModal(){
        this.props.setModalShow(false)
    }

    render() {
        return (
            <Modal
                {...this.props}
                size="sm"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={ () => {
                    this.props.setModalShow(false);
                }}
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Save program
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" name="site" class="form-control"/>
                </div>
                <div class="form-group">
                    <label for="email">Description</label>
                    <input type="text" name="category" class="form-control"/>
                </div>
                    
            </Modal.Body>
            <Modal.Footer>
                <Button color="primary" 
                        onClick={(obj) => {

                                var site = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1].value.trim()
                                var category = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1].value.trim()
                                if(site == "" || category == ""){
                                    NotificationManager.error('', 'Fill in the site and category fields.')
                                }
                                else{
                                    this.props.saveProgram(site, category, this.props.selectedProjectId)
                                    this.closeModal()
                                }
                            }
                        }
                    >
                    Save
                    </Button>
                    <Button color="secondary" 
                        onClick={(obj) => {
                                this.closeModal()
                            }
                        }
                    >
                    Close
                    </Button>
            </Modal.Footer>
            <NotificationContainer/>
            </Modal>
        );
    }
}
export default SaveProgramModal;
