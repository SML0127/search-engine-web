import React from "react";
import Rete from "rete";
import { createEditor } from "./rete";
import { updateEditor } from "./rete";
import { addOperator } from "./rete";
import global_editors from "./GlobalEditors.react";
import "./styles.css";

let gvar_job_id = -1 // job_id: gvar editor index
let gvar_editor = {} // job_id: gvar editor index
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
  console.log(request)
  if(request['action'] != null){
    console.log('ACTION')
    console.log(global_editors)
    if (global_editors[gvar_job_id] != null ){
      console.log('222222222')
      addOperator(global_editors[gvar_job_id], request) 
    }
    else{
      console.log('333333333')
    }
  }
  else if(request['gvar_job_id'] != null){
    console.log('SELECT')
    gvar_job_id = String(request['gvar_job_id'])

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
            global_editors[this.props.job_id] = new Rete.NodeEditor("work-flow@1.0.0", ref);
            console.log('77777777777777777777')
            let job_id = String(this.props.job_id)
            createEditor(ref, global_editors[this.props.job_id], this.props.saveGraphData, this.props.editor, this.props.job_id)
            this.state.is_created = true
        }
        else{
            updateEditor(global_editors[this.props.job_id], this.props.saveGraphData, this.props.editor, this.props.job_id)
        }
    }


    componentWillMount(){
    }

    componentDidMount(){
      console.log(this.props.job_id)
      gvar_job_id = this.props.job_id
    }
  
    componentWillReceiveProps(props){
        if(props.refresh != this.state.refresh){
            console.log("refresh")
            //this.state.editor.clear()
            global_editors[this.props.job_id].clear()
            this.state.refresh = props.refresh
            this.forceUpdate()
            //gvar_job_id = this.props.job_id
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
