import React from "react";
import Rete from "rete";
import { createEditor } from "./rete";
import { updateEditor } from "./rete";
import { addOperator } from "./rete";
import components from "./rete";
import "./styles.css";

var gvar_editor = {} // editor
var gvar_editor_index = {} // job_id: gvar editor index
var gvar_job_id = -1 // job_id: gvar editor index
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request)
  console.log(components)
  if(request['action'] != null){
    addOperator(gvar_editor[gvar_job_id], request) 
  }
});
class ReteGraph extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            refresh:1,
            editor:{},
            is_created: false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }     
   

    createE(ref){
        if(this.state.is_created == false){
            gvar_editor[this.props.job_id] = new Rete.NodeEditor("work-flow@1.0.0", ref);
            createEditor(ref, gvar_editor[this.props.job_id], this.props.saveGraphData, this.props.editor, this.props.job_id)
            this.state.is_created = true
        }
        else{
            updateEditor(gvar_editor[this.props.job_id], this.props.saveGraphData, this.props.editor, this.props.job_id)
        }
    }


    componentWillMount(){
    }

    componentDidMount(){
    }
  
    componentWillReceiveProps(props){
        if(props.refresh != this.state.refresh){
            console.log("refresh")
            //this.state.editor.clear()
            gvar_editor[this.props.job_id].clear()
            this.state.refresh = props.refresh
            this.forceUpdate()
            //console.log(props)
            //console.log(this.props.job_id)
            gvar_job_id = this.props.job_id

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
            <div class="dock" id ={"dock_"+this.props.job_id}></div>
          </div>
        </div>
      );
    }
}
export default ReteGraph;
