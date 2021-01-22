import React from "react";
import { Node, Socket} from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

export class BFSIteratorNode extends Node {
    constructor(props){
        super(props)
        this.state = {
            modalShow:false,
            max_num_tasks:"",
            query:"",
            rows:[{}],
            prev_rows:[]
        }
        this.updateState()
    }

    updateState(){
        if(Object.keys(this.props.node.data).length >= 1  ){
        //    this.state.max_num_tasks = this.props.node.data['max_num_tasks']
        //}
        //else if(Object.keys(this.props.node.data).length === 2){
            var rows = this.props.node.data['rows']
            if(typeof rows != "undefined"){
                if(rows.length !== 0){
                    for(var idx in rows){
                        var row_data = {}
                        for(var idxx in rows[idx]){
                            row_data[idxx] = rows[idx][idxx]
                        }
                        this.state.rows.push(row_data)
                    }
                }
            }
            this.state.rows.splice(0,1) 
            this.state.max_num_tasks = this.props.node.data['max_num_tasks']
            this.state.query = this.props.node.data['query']
            this.state.selected_button_query = this.props.node.data['selected_button_query']
        }
    }


    handleChange = idx => e => {
        const { name, value } = e.target;
        const rows = [...this.state.rows];// column 별로 row가 저장되네
        //rows[idx] = {
        //    [name]: value
        //};
        rows[idx][name] = value
        this.setState({ rows: rows })
    };
                                                                     
 
    handleAddRow = () => {
        const item = {query:'', initial:'', increase:''};
        this.setState({
            rows: [...this.state.rows, item]
        });
    };
    handleRemoveSpecificRow = idx => () =>{ 
        const rows = [...this.state.rows]
        rows.splice(idx, 1)
        this.setState({ rows: rows })
    }


  render() {
    const { node, bindSocket} = this.props;
    const { outputs, inputs, selected } = this.state;
    return (
      <div className={`node ${selected}`} >
        <div 
            onDoubleClick={() => {
                this.setState({modalShow: true})
                this.state.prev_rows = this.state.rows
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
                dialogClassName="modal-80w"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={ () => {
                    this.setState({modalShow:false})
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        BFS Iterator
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class = 'row' style={{width:'100%'}}>
                      <label style={{width:'17%', marginTop:'5px', paddingLeft:'2%'}}>
                      Max # of pages
                      </label>
                      <Form.Textarea
                          row={2}
                          style={{width:'80%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                          defaultValue={this.state.max_num_tasks}
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
                        <label style={{width:'17%', marginTop:'5px', paddingLeft:'2%'}}>
                        XPath
                        </label>
                      </OverlayTrigger>
                      <Form.Textarea
                          row={2}
                          style={{width:'80%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                          defaultValue={this.state.query}
                      />
                    </div>

                    <div class = 'row' style={{width:'100%'}}>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={
                          <Tooltip>
                            for checking whether the last page
                          </Tooltip>
                        }
                      >

                        <label style={{width:'17%', marginTop:'5px', paddingLeft:'2%'}}>
                        XPath of Selected Button
                        </label>
                      </OverlayTrigger>
                      <Form.Textarea
                          row={2}
                          style={{width:'80%', height:'30px', marginLeft:'3%', textAlign:'right', overflow:'hidden'}}
                          defaultValue={this.state.selected_button_query}
                      />
                    </div>
                    <label style = {{marginLeft:'1%'}}>
                    Pagination Query
                    </label>
                    <table
                        className="table table-bordered table-hover"
                        id="tab_logic"
                        style={{marginLeft:'1%',width:'98%'}}
                    >
                        <thead>
                            <tr>
                                <th className="text-center"> Query </th>
                                <th className="text-center"> Init value </th>
                                <th className="text-center"> Increase </th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.rows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                    <td>
                                        <input
                                            type="text"
                                            name="query"
                                            value={this.state.rows[idx]['query']}
                                            onChange={this.handleChange(idx)}
                                            className="form-control"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="initial"
                                            value={this.state.rows[idx]['initial']}
                                            onChange={this.handleChange(idx)}
                                            className="form-control"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="increase"
                                            value={this.state.rows[idx]['increase']}
                                            onChange={this.handleChange(idx)}
                                            className="form-control"
                                        />
                                    </td>
                                    <td style = {{width:'10%'}}>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={this.handleRemoveSpecificRow(idx)}
                                            style={{width:'100%'}}
                                        >
                                        Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div id="edit-selector" style={{marginLeft:'1%', width:'98%'}}>
		            	  <Button color='secondary' onClick={this.handleAddRow}  style={{width:'90%'}}>
                      +
                    </Button>
		            	  <Button color="secondary" action='select-selector' type="button"  style={{width:'10%'}}>
                      Get XPath
                    </Button>
		            </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="primary" 
                        onClick={(obj) => {
                                
                                var input_max_num_tasks = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1].value
                                var input_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[1].childNodes[1].value
                                var input_selected_button_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[2].childNodes[1].value
                                var table_rows = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[4].childNodes[1].childNodes
                               
                                var rows_data = []
                                var is_there_empty_cell = false;
                                for(var idx in table_rows){
                                    if(is_there_empty_cell){
                                        break;
                                    }
                                    var row_data = {}
                                    for(var idxx in table_rows[idx].childNodes){
                                        if(typeof table_rows[idx].childNodes[idxx].childNodes != "undefined"){
                                            if(table_rows[idx].childNodes[idxx].childNodes[0].nodeName === "INPUT"){

                                                if( table_rows[idx].childNodes[idxx].childNodes[0].value === ""){
                                                    is_there_empty_cell = true;
                                                    break;
                                                }
                                                row_data[table_rows[idx].childNodes[idxx].childNodes[0].name] = table_rows[idx].childNodes[idxx].childNodes[0].value 
                                            }
                                        }
                                    }
                                    if(Object.keys(row_data).length !== 0){
                                        rows_data.push(row_data)
                                    }
                                }
                                if(!is_there_empty_cell){
                                    this.props.node.data['rows'] = rows_data
                                }
                                this.setState({
                                    rows:rows_data,
                                    modalShow:false,
                                    max_num_tasks:input_max_num_tasks,
                                    query: input_query,
                                    selected_button_query: input_selected_button_query
                                })
                                this.props.node.data['max_num_tasks'] = input_max_num_tasks
                                this.props.node.data['query'] = input_query
                                this.props.node.data['selected_button_query'] = input_selected_button_query
                            }
                        }
                    >
                    Save
                    </Button>
                    <Button color="secondary" 
                        onClick={(obj) => {
                                this.setState({
                                    rows: this.state.prev_rows,
                                    modalShow:false
                                })
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

