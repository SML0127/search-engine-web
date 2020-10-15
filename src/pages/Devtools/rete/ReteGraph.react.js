import React from "react";
import Rete from "rete";
import { createEditor } from "./rete";
import { updateEditor } from "./rete";
import "./styles.css";


class ReteGraph extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            refresh:1,
            editor:{},
            
        }
        
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }     

    createE(ref){
        console.log('=======createE=======')
        console.log(this.state.editor)
        console.log(this.props.editor)
        console.log('=======createE=======')
        if(Object.keys(this.state.editor) == 0){
            this.state.editor = new Rete.NodeEditor("work-flow@1.0.0", ref);
            createEditor(ref, this.state.editor, this.props.saveGraphData, this.props.editor)
        }
        else{
            updateEditor(this.state.editor, this.props.saveGraphData, this.props.editor)
        }
    }

    componentWillReceiveProps(props){
        if(props.refresh != this.state.refresh){
            this.state.editor.clear()
            console.log("refresh")
            this.forceUpdate()
            this.setState({refresh:props.refresh})
        }
    }


    render() {
      return (
        <div className="App" >
          <div className="editor">
              <div id="container" className="container" style={{width:'100%'}}>
                <div 
                    ref={ref => ref && this.createE(ref)}
                    style={{width:'100%'}}
                >
                </div>
            </div>
            <div class="dock"></div>
          </div>
        </div>
      );
    }
}
export default ReteGraph;
