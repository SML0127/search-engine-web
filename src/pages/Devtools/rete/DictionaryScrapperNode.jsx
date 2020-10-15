import React from "react";
import { Node, Socket } from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';

export class DictionariesScrapperNode extends Node {
    constructor(props){
        super(props)
        this.state = {
            modalShow:false,
            rows:[{}]
        }
        this.updateState() 
    }
   
    updateState(){
        if(Object.keys(this.props.node.data).length >=1 ){
        }
    }

    handleChange = idx => e => {
        const { name, value } = e.target;
        const rows = [...this.state.rows];
        console.log(rows)
        rows[idx] = {
            [name]: value
        };
        console.log(rows)
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
                            Dictionaries Scrapper
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <table
                          className="table table-bordered table-hover"
                          id="tab_logic"
                        >
                        <thead>
                            <tr>
                                <th className="text-center"> QUERY </th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.rows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                    <td>
                                      <label style={{width:"13%"}}> 
                                        KEY : 
                                      </label>
                                      <input
                                          type="text"
                                          name="col_key"
                                          style={{width:"80%", display:"inline"}}
                                          value={this.state.rows[idx].col_key}
                                          onChange={this.handleChange(idx)}
                                          className="form-control"
                                      />
                                      <p/>
                                      <label style={{width:"13%"}}> 
                                        ROWS QUERY :
                                      </label>
                                      <input
                                          type="text"
                                          name="col_rows_query"
                                          style={{width:"80%", display:"inline"}}
                                          value={this.state.rows[idx].col_rows_query}
                                          onChange={this.handleChange(idx)}
                                          className="form-control"
                                      />
                                      <p/>
                                      <label style={{width:"13%"}}> 
                                        ROWS INDICES :
                                      </label>
                                      <input
                                          type="text"
                                          name="col_rows_indices"
                                          style={{width:"80%", display:"inline"}}
                                          value={this.state.rows[idx].col_rows_indices}
                                          onChange={this.handleChange(idx)}
                                          className="form-control"
                                      />
                                      <p/>
                                      <label style={{width:"13%"}}> 
                                        KEY QUERY :
                                      </label>
                                      <input
                                          type="text"
                                          name="col_key_query"
                                          style={{width:"80%", display:"inline"}}
                                          value={this.state.rows[idx].col_key_query}
                                          onChange={this.handleChange(idx)}
                                          className="form-control"
                                      />
                                      <p/>
                                      <label style={{width:"13%"}}> 
                                        KEY INDICES :
                                      </label>
                                      <input
                                          type="text"
                                          name="col_key_indices"
                                          style={{width:"80%", display:"inline"}}
                                          value={this.state.rows[idx].col_key_indices}
                                          onChange={this.handleChange(idx)}
                                          className="form-control"
                                      />
                                      <p/>
                                      <label style={{width:"13%"}}> 
                                        KEY ATTRIBUTE :
                                      </label>
                                      <input
                                          type="text"
                                          name="col_key_attribute"
                                          style={{width:"80%", display:"inline"}}
                                          value={this.state.rows[idx].col_key_attribute}
                                          onChange={this.handleChange(idx)}
                                          className="form-control"
                                      />
                                      <p/>
                                      <label style={{width:"13%"}}> 
                                        VALUE QUERY :
                                      </label>
                                      <input
                                          type="text"
                                          name="col_value_query"
                                          style={{width:"80%", display:"inline"}}
                                          value={this.state.rows[idx].col_value_query}
                                          onChange={this.handleChange(idx)}
                                          className="form-control"
                                      />
                                      <p/>
                                      <label style={{width:"13%"}}> 
                                        VALUE INDICES :
                                      </label>
                                      <input
                                          type="text"
                                          name="col_value_indices"
                                          style={{width:"80%", display:"inline"}}
                                          value={this.state.rows[idx].col_value_indices}
                                          onChange={this.handleChange(idx)}
                                          className="form-control"
                                      />
                                      <p/>
                                      <label style={{width:"13%"}}> 
                                        VALUE ATTRIBUTE :
                                      </label>
                                      <input
                                          type="text"
                                          name="col_value_attribute"
                                          style={{width:"80%", display:"inline"}}
                                          value={this.state.rows[idx].col_value_attribute}
                                          onChange={this.handleChange(idx)}
                                          className="form-control"
                                      />
                                    </td>

                                    <td style={{width:"6%"}}>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            style={{height:"465px"}}
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
                                    var table_rows = obj.currentTarget.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[1].childNodes
                                    var rows_data = []
                                    for(var idx in table_rows){
                                        var row_data = {}
                                        if(typeof table_rows[idx].childNodes != "undefined"){
                                          for(let idxx in table_rows[idx].childNodes){
                                            for(let idxxx in table_rows[idx].childNodes[idxx].childNodes){
                                              if(table_rows[idx].childNodes[idxx].childNodes[idxxx].nodeName==="INPUT"){
                                            
                                                row_data[table_rows[idx].childNodes[idxx].childNodes[idxxx].name] = table_rows[idx].childNodes[idxx].childNodes[idxxx].value 
                                              }

                                            }
                                          }
                                        }
                                        if(Object.keys(row_data).length !== 0){
                                            rows_data.push(row_data)
                                        }
                                    }

                                    this.setState({
                                        rows:rows_data,
                                        modalShow:false
                                    })
                                    this.props.node.data['rows'] = rows_data
                                }
                            }
                        >
                        OK
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
        );
    }
}

