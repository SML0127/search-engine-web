import React from "react";
import { Node, Socket } from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

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
            this.state.rows.splice(0,1) 
        }
    }

    handleChangeValueAttr(idx, value) {
      const rows = [...this.state.rows];
      rows[idx]['col_value_attribute'] =  value
      this.setState({ rows: rows })
    };    


    handleChangeKeyAttr(idx, value) {
      const rows = [...this.state.rows];
      rows[idx]['col_key_attribute'] =  value
      this.setState({ rows: rows })
    };    



    handleChange = idx => e => {
        const { name, value } = e.target;
        const rows = [...this.state.rows];
        rows[idx][name] = value
        this.setState({ rows: rows })
    };
  
    handleAddRow = () => {
        const item = {};
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
                                          value={this.state.rows[idx]['col_key']}
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
                                          value={this.state.rows[idx]['col_rows_query']}
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
                                          value={this.state.rows[idx]['col_key_query']}
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
                                          value={this.state.rows[idx]['col_key_attribute']}
                                          onChange={this.handleChange(idx)}
                                          style={{width:"60%", display:"inline"}}
                                          className="form-control"
                                      />

                                      <DropdownButton id="dropdown-basic-secondary" title="Attr" style={{paddingLeft: "5px", paddingTop:"1px", width:"15%", display:"inline"}} >
                                        <Dropdown.Item onSelect={()=>{this.handleChangeKeyAttr(idx,"alltext")}}>alltext</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeKeyAttr(idx,"src")}}>src</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeKeyAttr(idx,"href")}}>href</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeKeyAttr(idx,"innerHTML")}}>innerHTML</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeKeyAttr(idx,"data-price")}}>data-price</Dropdown.Item>
                                      </DropdownButton>


                                      <p/>
                                      <label style={{width:"13%"}}> 
                                        VALUE QUERY :
                                      </label>
                                      <input
                                          type="text"
                                          name="col_value_query"
                                          style={{width:"80%", display:"inline"}}
                                          value={this.state.rows[idx]['col_value_query']}
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
                                          value={this.state.rows[idx]['col_value_attribute']}
                                          onChange={this.handleChange(idx)}
                                          style={{width:"60%", display:"inline"}}
                                          className="form-control"
                                      />

                                      <DropdownButton id="dropdown-basic-secondary" title="Attr" style={{paddingLeft: "5px", paddingTop:"1px", width:"15%", display:"inline"}} >
                                        <Dropdown.Item onSelect={()=>{this.handleChangeValueAttr(idx,"alltext")}}>alltext</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeValueAttr(idx,"src")}}>src</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeValueAttr(idx,"href")}}>href</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeValueAttr(idx,"innerHTML")}}>innerHTML</Dropdown.Item>
                                        <Dropdown.Item onSelect={()=>{this.handleChangeValueAttr(idx,"data-price")}}>data-price</Dropdown.Item>
                                      </DropdownButton>

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
                <div id="edit-selector" style={{float:"right"}}>
                    <button onClick={this.handleAddRow} className="btn btn-primary" style={{marginRight:"10px"}}>
                      Add Row
                    </button>
                    
		    <Button color="primary" action='select-selector' type="button">
                      Get Relative XPath
                    </Button>
		</div> 
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
        );
    }
}

