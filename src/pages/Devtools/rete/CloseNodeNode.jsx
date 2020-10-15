import React from "react";
import { Node, Socket} from "rete-react-render-plugin";
import { Form, Button } from "tabler-react";
import Modal from 'react-bootstrap/Modal';
import Iframe from 'react-iframe';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

export class CloseNodeNode extends Node {
  constructor(props){
      super(props)
      this.state = {
          modalShow:false,
      }
  }
  render() {
    const { node, bindSocket} = this.props;
    const { inputs,outputs, selected } = this.state;

    return (
      <div className={`node ${selected}`}>
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
    );
  }
}

