import React from "react";
import { Node, Socket} from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';

export class RowsScrapperNode extends Node {
    constructor(props){
        super(props)
        this.state = {
            modalShow:false,
            table_name:"",
            base_query:"",
            rows:[{}],
            prev_rows:[]
        }
        this.updateState()
    }

    updateState(){
        if(Object.keys(this.props.node.data).length === 2 ){
            this.tate.base_query = this.props.node.data['base_query']
            this.state.table_name = this.props.node.data['table_name']
        }
        else if(Object.keys(this.props.node.data).length === 3){
            var rows = this.props.node.data['rows']
            if(rows.length !== 0){
                for(var idx in rows){
                    var row_data = {}
                    for(var idxx in rows[idx]){
                        row_data[idxx] = rows[idx][idxx]
                    }
                    this.state.rows.push(row_data)
                }
            }
            this.state.base_query = this.props.node.data['base_query']
            this.state.table_name = this.props.node.data['table_name']
        }
    }

    handleChange = idx => e => {
        const { name, value } = e.target;
        const rows = [...this.state.rows];
        rows[idx] = {
            [name]: value
        };
        this.setState({
            rows
        });
    };
 
    handleAddRow = () => {
        const item = {

        };
        this.setState({
            rows: [...this.state.rows, item]
        });
    };

    handleRemoveSpecificRow = (idx) => () => {
        const rows = [...this.state.rows]
        rows.splice(idx, 1)
        this.setState({ rows })
    }

  render() {
    const { node, bindSocket } = this.props;
    const { outputs, inputs, selected } = this.state;
    return (
      <div className={`node ${selected}`} >
        <div 
            onDoubleClick={() => {
                this.setState({modalShow: true})
                this.state.prev_rows = this.state.rows
                //console.log(this.state.prev_rows)
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
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={ () => {
                    this.setState({modalShow:false})
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Options
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Base Query
                    <Form.Textarea
                        row={12}
                        defaultValue={this.state.base_query}
                    />
                    Table Name
                    <Form.Textarea
                        row={12}
                        defaultValue={this.state.table_name}
                    />
                    Column
                    <table
                        className="table table-bordered table-hover"
                        id="tab_logic"
                    >
                        <thead>
                            <tr>
                                <th className="text-center"> Name </th>
                                <th className="text-center"> XPath </th>
                                <th className="text-center"> Attribute </th>
                                <th className="text-center"> essential </th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.rows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                    <td>
                                        <input
                                            type="text"
                                            name="col_name"
                                            value={this.state.rows[idx].col_name}
                                            onChange={this.handleChange(idx)}
                                            className="form-control"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="col_query"
                                            value={this.state.rows[idx].col_query}
                                            onChange={this.handleChange(idx)}
                                            className="form-control"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="col_attr"
                                            value={this.state.rows[idx].col_attr}
                                            onChange={this.handleChange(idx)}
                                            className="form-control"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="col_essential"
                                            value={this.state.rows[idx].col_essential}
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
                </Modal.Body>
                <Modal.Footer>
                    <Button color="primary" 
                        onClick={(obj) => {

                                var input_base_query = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[1].value
                                var table_name = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[3].value
                                var table_rows = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[5].childNodes[1].childNodes
                                //console.log(input_base_query) 
                                var rows_data = []
                                for(var idx in table_rows){
                                    var row_data = {}
                                    for(var idxx in table_rows[idx].childNodes){
                                        if(typeof table_rows[idx].childNodes[idxx].childNodes != "undefined"){
                                            if(table_rows[idx].childNodes[idxx].childNodes[0].nodeName === "INPUT"){
                                                //console.log(table_rows[idx].childNodes[idxx].childNodes[0].name)   
                                                //console.log(table_rows[idx].childNodes[idxx].childNodes[0].value)
                                                row_data[table_rows[idx].childNodes[idxx].childNodes[0].name] = table_rows[idx].childNodes[idxx].childNodes[0].value 
                                            }
                                        }
                                    }
                                    if(Object.keys(row_data).length !== 0){
                                        rows_data.push(row_data)
                                    }
                                }

                                this.setState({
                                    rows:rows_data,
                                    table_name:table_name,
                                    base_query:input_base_query,
                                    modalShow:false
                                })
                                this.props.node.data['rows'] = rows_data
                                this.props.node.data['table_name'] = table_name
                                this.props.node.data['base_query'] = input_base_query
                                //console.log(rows_data)
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
                                //console.log(this.state)
                                
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

