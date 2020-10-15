import React from "react";
import { Node, Socket} from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';

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
        console.log(rows)
        this.setState({ rows: rows })
    };
                                                                     
 
    handleAddRow = () => {
        const item = {};
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
                    Max # of tasks
                    <input id="tasks" name="tasks" type="text" defaultValue={this.state.max_num_tasks}></input>
                    <p></p> 
                    QUERY
                    <Form.Textarea
                        row={12}
                        defaultValue={this.state.query}
                    />
                    Selected Button Query
                    <Form.Textarea
                        row={12}
                        defaultValue={this.state.selected_button_query}
                    />
                    URL QUERY
                    <table
                        className="table table-bordered table-hover"
                        id="tab_logic"
                    >
                        <thead>
                            <tr>
                                <th className="text-center"> Query </th>
                                <th className="text-center"> Initial </th>
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
                                    <td>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={this.handleRemoveSpecificRow(idx)}
                                        >
                                        Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <button onClick={this.handleAddRow} className="btn btn-primary">
                    Add Row
                </button> 
                <div id="edit-selector" style={{float:"right"}}>
                    
		            	  <Button color="primary" action='select-selector' type="button">
                      Get Relative XPath
                    </Button>
		            </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="primary" 
                        onClick={(obj) => {

                                var input_max_num_tasks = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[1].value
                                var input_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[4].value
                                var input_selected_button_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[6].value
                                var table_rows = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[8].childNodes[1].childNodes
                               
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

