import React from "react";
import Rete from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from 'rete-context-menu-plugin';
import MinimapPlugin from 'rete-minimap-plugin';
import AreaPlugin from "rete-area-plugin";
import { DictionariesScrapperNode } from "./DictionariesScrapperNode";
import { ListsScrapperNode } from "./ListsScrapperNode";
import { ValuesScrapperNode } from "./ValuesScrapperNode";
import { OpenURLNode } from "./OpenURLNode";
import { OpenNodeNode } from "./OpenNodeNode";
import { CloseNodeNode } from "./CloseNodeNode";
import { ExpanderNode } from "./ExpanderNode";
import { BFSIteratorNode } from "./BFSIteratorNode";
import { RowScrapperNode } from "./RowScrapperNode";
import { RowsScrapperNode } from "./RowsScrapperNode";
import { ClickNode } from "./ClickNode";
import { ClickOperatorNode } from "./ClickOperatorNode";
import { InputNode } from "./InputNode";
import { WaitNode } from "./WaitNode";
import { ScrollNode } from "./ScrollNode";
import { BranchNode } from "./BranchNode";
import { HoverNode } from "./HoverNode";
import { OptionListScrapperNode } from "./OptionListScrapperNode";
import { OptionMatrixScrapperNode } from "./OptionMatrixScrapperNode";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import DockPlugin from 'rete-dock-plugin';
import AutoArrangePlugin from 'rete-auto-arrange-plugin';
import ConnectionPathPlugin from 'rete-connection-path-plugin';
import ConnectionRerouterPlugin from 'rete-connection-reroute-plugin';

var numSocket = new Rete.Socket("Number value");



class NothingControl extends Rete.Control {
    static component = ({ value, onChange }) => (
        <div
        />
    );
    
    constructor(emitter, key, node, readonly = false) {
        super(key);
        this.emitter = emitter;
        this.key = key;
        this.component = NothingControl.component;
    }
}


class OpenURLComponent extends Rete.Component {
    constructor() {
        super("OpenURL");
        this.data.component = OpenURLNode;
    }
    
    builder(node) {
        var out1 = new Rete.Output("toRight", "URL", numSocket);
        return node.addOutput(out1);
    }
    worker(node, inputs, outputs) {
    }
}

class OpenNodeComponent extends Rete.Component {
    constructor() {
        super("OpenNode");
        this.data.component = OpenNodeNode;
    }
    builder(node) {
        var output = new Rete.Output("toRight", "", numSocket);
        var input = new Rete.Input('fromLeft', "", numSocket);
        return node.addInput(input).addOutput(output);
    }
    worker(node, inputs, outputs) {}

}

class CloseNodeComponent extends Rete.Component {
    constructor() {
        super("CloseNode");
        this.data.component = CloseNodeNode;
    }
    builder(node) {
        var output = new Rete.Output("toRight", "", numSocket);
        var input = new Rete.Input('fromLeft', "", numSocket);
        return node.addInput(input).addOutput(output);
    }
    worker(node, inputs, outputs) {}

}

class BFSIteratorComponent extends Rete.Component {
    constructor() {
        super("BFSIterator");
        this.data.component = BFSIteratorNode;
    }
    
    builder(node) {
        var out = new Rete.Output("toRight", "", numSocket);
        var input = new Rete.Input('fromLeft', "URL", numSocket);

        return node
                .addInput(input)
                .addOutput(out);
    }
    
    worker(node, inputs, outputs) {}

}

class ClickOperatorComponent extends Rete.Component {
    constructor(props) {
        super("ClickOperator");
        this.data.component = ClickOperatorNode;
    }
    
    builder(node) {
        var out = new Rete.Output("toRight", "", numSocket);
        var input = new Rete.Input('fromLeft', "INPUT", numSocket);
        return node.addInput(input).addOutput(out);
    }

    worker(node, inputs, outputs) {
       console.log(this.data.componnt)
       console.log(node)
       console.log(node.data)
    }
}




class ScrollOperatorComponent extends Rete.Component {
    constructor() {
        super("Scroll");
        this.data.component = ScrollNode;
    }
    
    builder(node) {
        var out = new Rete.Output("toRight", "", numSocket);
        var input = new Rete.Input('fromLeft', "INPUT", numSocket);
        return node.addInput(input).addOutput(out);
    }

    worker(node, inputs, outputs) {}
}




class HoverOperatorComponent extends Rete.Component {
    constructor() {
        super("Hover");
        this.data.component = HoverNode;
    }
    
    builder(node) {
        var out = new Rete.Output("toRight", "", numSocket);
        var input = new Rete.Input('fromLeft', "INPUT", numSocket);
        return node.addInput(input).addOutput(out);
    }

    worker(node, inputs, outputs) {}
}




class InputOperatorComponent extends Rete.Component {
    constructor() {
        super("Input");
        this.data.component = InputNode;
    }
    
    builder(node) {
        var out = new Rete.Output("toRight", "", numSocket);
        var input = new Rete.Input('fromLeft', "INPUT", numSocket);
        return node.addInput(input).addOutput(out);
    }

    worker(node, inputs, outputs) {}
}





class WaitOperatorComponent extends Rete.Component {
    constructor() {
        super("Wait");
        this.data.component = WaitNode;
    }
    
    builder(node) {
        var out = new Rete.Output("toRight", "", numSocket);
        var input = new Rete.Input('fromLeft', "INPUT", numSocket);
        return node.addInput(input).addOutput(out);
    }

    worker(node, inputs, outputs) {}
}







class DictionariesScrapperComponent extends Rete.Component {
    constructor() {
        super("DictionariesScrapper");
        this.data.component = DictionariesScrapperNode;
    }
    
    builder(node) {
        var out = new Rete.Output("toRight", "", numSocket);
        var input = new Rete.Input('fromLeft', "INPUT", numSocket);
        return node.addInput(input).addOutput(out);
    }

    worker(node, inputs, outputs) {}
}

class ListsScrapperComponent extends Rete.Component {
    constructor() {
        super("ListsScrapper");
        this.data.component = ListsScrapperNode;
    }
    
    builder(node) {
        var out = new Rete.Output("toRight", "", numSocket);
        var input = new Rete.Input('fromLeft', "INPUT", numSocket);
        return node.addInput(input).addOutput(out);
    }

    worker(node, inputs, outputs) {}
}

class ValuesScrapperComponent extends Rete.Component {
    constructor() {
        super("ValuesScrapper");
        this.data.component = ValuesScrapperNode;
    }
    
    builder(node) {
        var out = new Rete.Output("toRight", "", numSocket);
        var input = new Rete.Input('fromLeft', "INPUT", numSocket);
        return node.addInput(input).addOutput(out);
    }

    worker(node, inputs, outputs) {}
}


class OptionListScrapperComponent extends Rete.Component {
    constructor() {
        super("OptionListScrapper");
        this.data.component = OptionListScrapperNode;
    }
    
    builder(node) {
        var out = new Rete.Output("toRight", "", numSocket);
        var input = new Rete.Input('fromLeft', "INPUT", numSocket);
        return node.addInput(input).addOutput(out);
    }

    worker(node, inputs, outputs) {}
}

class OptionMatrixScrapperComponent extends Rete.Component {
    constructor() {
        super("OptionMatrixScrapper");
        this.data.component = OptionMatrixScrapperNode;
    }
    
    builder(node) {
        var out = new Rete.Output("toRight", "", numSocket);
        var input = new Rete.Input('fromLeft', "INPUT", numSocket);
        return node.addInput(input).addOutput(out);
    }

    worker(node, inputs, outputs) {}
}






class ClickOptionComponent extends Rete.Component {
    constructor() {
        super("ClickOption");
        this.data.component = ClickNode;
    }
    
    builder(node) {
        var out = new Rete.Output("toRight", "", numSocket);
        var input = new Rete.Input('fromLeft', "INPUT", numSocket);
        return node.addInput(input).addOutput(out);
    }

    worker(node, inputs, outputs) {}
}



class ExpanderComponent extends Rete.Component {
    constructor() {
        super("Expander");
        this.data.component = ExpanderNode;
    }
    
    builder(node) {
        var out = new Rete.Output("toRight", "", numSocket);
        var out2 = new Rete.Output("toDown", "", numSocket);
        var input = new Rete.Input('fromLeft', "INPUT", numSocket);
        return node.addInput(input).addOutput(out).addOutput(out2);
    }

    worker(node, inputs, outputs) {}
}

class BranchOperatorComponent extends Rete.Component {
    constructor() {
        super("Branch");
        this.data.component = BranchNode;
    }
    
    builder(node) {
        var out = new Rete.Output("True", "", numSocket);
        var out2 = new Rete.Output("False", "", numSocket);
        var input = new Rete.Input('fromLeft', "INPUT", numSocket);
        return node.addInput(input).addOutput(out).addOutput(out2);
    }

    worker(node, inputs, outputs) {}
}

const components = [new OpenURLComponent(), new ExpanderComponent(), new BFSIteratorComponent(), new ValuesScrapperComponent(), new ListsScrapperComponent(), new DictionariesScrapperComponent(), new ClickOperatorComponent(), new InputOperatorComponent(), new WaitOperatorComponent(), new ScrollOperatorComponent(), new BranchOperatorComponent(), new HoverOperatorComponent(), new OptionListScrapperComponent(), new OptionMatrixScrapperComponent()];

export async function createEditor(container, editor, saveGraphData, GraphData, job_id) {
    //var editor = new Rete.NodeEditor("work-flow@1.0.0", container);
    var engine = new Rete.Engine("work-flow@1.0.0");
      
    editor.use(ReactRenderPlugin);
    editor.use(ConnectionPlugin);
    editor.use(MinimapPlugin);
    editor.use(AutoArrangePlugin, { margin: {x: 50, y: 50 }, depth: 0 });
    editor.use(ConnectionPathPlugin, {
        type: ConnectionPathPlugin.LINEAR, // DEFAULT or LINEAR transformer
        transformer: () => ([x1, y1, x2, y2]) => [[x1, y1], [x2, y2]], // optional, custom transformer
        curve: ConnectionPathPlugin.curveBundle, // curve identifier
        options: { vertical: true, curvature: 0.4 }, // optional
        arrow: { color: 'steelblue', marker: 'M-5,-10 L-5,10 L20,0 z' }
    });
    editor.use(ConnectionRerouterPlugin);
    editor.use(ContextMenuPlugin,{
        nodeItems: node => {
            //if (node.name == 'OpenURL') {
            //    return{
            //        'Clone':false,
            //        'Delete':false 
            //    }
            //}
            //else{
                return{
                    'Clone':false
                }
            //}
        },
        items: {
           'OpenURL': false
        },
        searchBar: false

    
    });
    editor.use(AreaPlugin);

    editor.use(DockPlugin, {
            container: document.querySelector('#dock_'+job_id),
            itemClass: 'dock-item',
            plugins: [ReactRenderPlugin]
    });
    //var components = [new OpenURLComponent(), new ExpanderComponent(), new BFSIteratorComponent(), new ValuesScrapperComponent(), new ListsScrapperComponent(), new DictionariesScrapperComponent(), new ClickOperatorComponent(), new InputOperatorComponent(), new WaitOperatorComponent(), new ScrollOperatorComponent(), new BranchOperatorComponent(), new HoverOperatorComponent() ];
    components.map(c => {
        editor.register(c);
        engine.register(c);
    });

    editor.on(
        "nodecreated noderemoved connectioncreated connectionremoved selectnode",
        async (target) => {
            await engine.abort();
            saveGraphData(editor.toJSON())
            //console.log(editor.nodes)
            //console.log(target)
        }
    );


    editor.on('zoom', ({ source }) => {
       return source != 'dblclick';
    });

    editor.view.resize();
    AreaPlugin.zoomAt(editor, editor.nodes);


    if(Object.keys(GraphData).length != 0 && typeof GraphData != 'undefined' ){
        editor.fromJSON(GraphData);
    }
    //console.log(editor.plugins)
    //console.log(editor)
}

export async function updateEditor(editor, saveGraphData, GraphData, job_id) {
    var engine = new Rete.Engine("work-flow@1.0.0");
    //if (editor.plugins.size != 7){
    //    editor.use(DockPlugin, {
    //            container: document.querySelector('#dock_'+job_id),
    //            itemClass: 'dock-item',
    //            plugins: [ReactRenderPlugin]
    //    });
    //}

    components.map(c => {
        engine.register(c);
    });
    editor.on(
        "nodecreated noderemoved connectioncreated connectionremoved selectnode",
        async (target) => {
            await engine.abort();
            saveGraphData(editor.toJSON())
        }
    );


    editor.on('zoom', ({ source }) => {
       return source != 'dblclick';
    });

    editor.view.resize();
    AreaPlugin.zoomAt(editor, editor.nodes);

    //console.log(GraphData)
    //console.log(typeof GraphData)
    if(typeof GraphData != 'undefined' ){
        if(Object.keys(GraphData).length != 0){
            editor.fromJSON(GraphData);
        }
    }
    //console.log(editor)
}

function createNotification(type){
  switch (type) {
    case 'warning':
        NotificationManager.warning('Please fill in the pagination query in the first BFSIterator operator. (e.g. &page=%d)','WARNING',  7000);
        break;
    case 'error':
        NotificationManager.error('Error message', 'Click me!', 5000, () => {
            alert('callback');
        });
        break;
    default:
        console.log("Not defined notification")
        break;
  }
};



export async function addOperator(editor, req) {
  let len = Object.keys(editor.nodes).length
  let last_node
  for (var idx = 0; idx < len; idx++) {
    editor.nodes[idx].outputs.forEach((value, key, mapObject) => {
      if(editor.nodes[idx].name == "Expander"){
        if(key == 'toDown'){
          //console.log(value.connections.length)
          if(value.connections.length == 0){
            last_node = editor.nodes[idx];
            //console.log(last_node);
          }
        }
      }
      else{
        //console.log(value.connections.length)
        if(value.connections.length == 0){
          last_node = editor.nodes[idx];
          //console.log(last_node);
        }
      }
      //console.log('---------------')
    });
  }
  //console.log(last_node)
  if(req.action == 'click'){
    const node = await components[6].createNode()
    node.data = {'rows':[{'col_query': req.xpath, 'col_delay': 5, 'col_repeat':false}]}
    let x1 = last_node.position[0]
    let y1 = last_node.position[1]
    node.position = [x1 + 200, y1] 
    editor.addNode(node)
    editor.connect(last_node.outputs.get('toRight'), node.inputs.get('fromLeft'));
  }  
  else if(req.action == 'hover'){
    const node = await components[11].createNode()
    node.data = {'hover':req.xpath}
    let x1 = last_node.position[0]
    let y1 = last_node.position[1]
    node.position = [x1 + 200, y1] 
    editor.addNode(node)
    editor.connect(last_node.outputs.get('toRight'), node.inputs.get('fromLeft'));
  }
  else if(req.action == 'extract'){
    const node = await components[3].createNode()
    node.data = {'rows':[{'col_key':'value1','col_attr':'alltext', 'col_essential':'False', 'col_query':req.xpath}]}
    let x1 = last_node.position[0]
    let y1 = last_node.position[1]
    node.position = [x1 + 200, y1] 
    editor.addNode(node)
    editor.connect(last_node.outputs.get('toRight'), node.inputs.get('fromLeft'));
  }
  else if(req.action == 'extract-list'){
    const node = await components[4].createNode()
    node.data = {'rows':[{'col_key':'list1','col_attr':'alltext', 'col_essential':'False', 'col_query':req.xpath}]}
    let x1 = last_node.position[0]
    let y1 = last_node.position[1]
    node.position = [x1 + 200, y1] 
    editor.addNode(node)
    editor.connect(last_node.outputs.get('toRight'), node.inputs.get('fromLeft'));
  }
  else if(req.action == 'input'){
    const node = await components[7].createNode()
    node.data = {'rows':[{'col_query':req.xpath,'col_value':req.text}]}
    let x1 = last_node.position[0]
    let y1 = last_node.position[1]
    node.position = [x1 + 200, y1] 
    editor.addNode(node)
    editor.connect(last_node.outputs.get('toRight'), node.inputs.get('fromLeft'));
  }
  else if(req.action == 'detail-pagination'){
    createNotification('warning')
    const expander_node = await components[1].createNode()
    const bfsiter_node = await components[2].createNode()
    expander_node.data ={'query':req.xpath, 'attribute':'href' } 
    bfsiter_node.data ={'max_num_tasks':-1} 
    let x1 = last_node.position[0]
    let y1 = last_node.position[1]
    expander_node.position = [x1 + 200, y1] 
    bfsiter_node.position = [x1, y1 + 150] 

    editor.addNode(expander_node)
    editor.addNode(bfsiter_node)
    editor.connect(last_node.outputs.get('toRight'), expander_node.inputs.get('fromLeft'));
    editor.connect(expander_node.outputs.get('toDown'), bfsiter_node.inputs.get('fromLeft'));
  }
  else if(req.action == 'summary-pagination'){
    createNotification('warning')
    

    const expander_node1 = await components[1].createNode()
    const bfsiter_node1 = await components[2].createNode()
    const expander_node2 = await components[1].createNode()
    const bfsiter_node2 = await components[2].createNode()
    bfsiter_node1.data ={'max_num_tasks':-1} 
    expander_node2.data ={'query':req.xpath, 'attribute':'href' } 
    bfsiter_node2.data ={'max_num_tasks':-1} 


    let x1 = last_node.position[0]
    let y1 = last_node.position[1]
    expander_node1.position = [x1 + 200, y1] 
    bfsiter_node1.position = [x1, y1 + 170] 
    expander_node2.position = [x1 + 200, y1 + 170] 
    bfsiter_node2.position = [x1, y1 + 340] 


    editor.addNode(expander_node1)
    editor.connect(last_node.outputs.get('toRight'), expander_node1.inputs.get('fromLeft'));
    editor.addNode(bfsiter_node1)
    editor.connect(expander_node1.outputs.get('toDown'), bfsiter_node1.inputs.get('fromLeft'));
    editor.addNode(expander_node2)
    editor.connect(bfsiter_node1.outputs.get('toRight'), expander_node2.inputs.get('fromLeft'));
    editor.addNode(bfsiter_node2)
    editor.connect(expander_node2.outputs.get('toDown'), bfsiter_node2.inputs.get('fromLeft'));
  }
}

//const components = [new OpenURLComponent(), new ExpanderComponent(), new BFSIteratorComponent(), new ValuesScrapperComponent(), new ListsScrapperComponent(), new DictionariesScrapperComponent(), new ClickOperatorComponent(), new InputOperatorComponent(), new WaitOperatorComponent(), new ScrollOperatorComponent(), new BranchOperatorComponent(), new HoverOperatorComponent() ];
export default components;
