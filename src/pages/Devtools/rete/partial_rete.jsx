import React from "react";
import Rete from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from 'rete-context-menu-plugin';
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
        var out1 = new Rete.Output("output", "URL", numSocket);
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
        var input = new Rete.Input('url', "URL", numSocket);

        return node
                .addInput(input)
                .addOutput(out);
    }
    
    worker(node, inputs, outputs) {}

}

class ClickOperatorComponent extends Rete.Component {
    constructor() {
        super("ClickOperator");
        this.data.component = ClickOperatorNode;
    }
    
    builder(node) {
        var out = new Rete.Output("toRight", "", numSocket);
        var input = new Rete.Input('input', "INPUT", numSocket);
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
        var input = new Rete.Input('input', "INPUT", numSocket);
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
        var input = new Rete.Input('input', "INPUT", numSocket);
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
        var input = new Rete.Input('input', "INPUT", numSocket);
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
        var input = new Rete.Input('input', "INPUT", numSocket);
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

class ExtractItemListComponent extends Rete.Component {
    constructor() {
        super("ExtractItemList");
        this.data.component = RowsScrapperNode;
    }
    
    builder(node) {
        var out = new Rete.Output("toRight", "", numSocket);
        var ctrl = new NothingControl("", "nothing", node);
        var input = new Rete.Input('input', "INPUT", numSocket);

        return node.addInput(input).addControl(ctrl).addOutput(out);
    }
    worker(node, inputs, outputs) {}
}

class ExtractItemDetailComponent extends Rete.Component {
    constructor() {
        super("ExtractItemDetail");
        this.data.component = RowScrapperNode;
    }
    
    builder(node) {
        var out = new Rete.Output("toRight", "", numSocket);
        var ctrl = new NothingControl("", "nothing", node);
        var input = new Rete.Input('input', "INPUT", numSocket);

        return node.addInput(input).addControl(ctrl).addOutput(out);
    }
    worker(node, inputs, outputs) {}
}


export async function createPEditor(container, editor, saveGraphData, GraphData) {
    //var editor = new Rete.NodeEditor("work-flow@1.0.0", container);
    var engine = new Rete.Engine("partial-work-flow@1.0.0");
      
    editor.use(ReactRenderPlugin);
    editor.use(ConnectionPlugin);
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
    if(Object.keys(GraphData).length == 0 || typeof GraphData == 'undefined' ){
        editor.use(DockPlugin, {
                container: document.querySelector('.dock'),
                itemClass: 'dock-item',
                plugins: [ReactRenderPlugin]
        });
    }
    var components = [new OpenURLComponent(), new ExpanderComponent(), new BFSIteratorComponent(), new OpenNodeComponent(), new CloseNodeComponent(), new ValuesScrapperComponent(), new ListsScrapperComponent(), new DictionariesScrapperComponent(), new ClickOperatorComponent() ];
    components.map(c => {
        editor.register(c);
        engine.register(c);
    });

    editor.on(
        "nodecreated noderemoved connectioncreated connectionremoved selectnode",
        async (target) => {
            await engine.abort();
        }
    );


    editor.on('zoom', ({ source }) => {
       return source != 'dblclick';
    });


    if(Object.keys(GraphData).length != 0 && typeof GraphData != 'undefined' ){
        editor.fromJSON(GraphData);
    }

    editor.view.resize();
    AreaPlugin.zoomAt(editor);
    const { area } = editor.view;
    area.zoom(0.4, -300, -150);
    editor.trigger('process');
    //console.log(editor)
}

export async function updatePEditor(editor, saveGraphData, GraphData) {
    var engine = new Rete.Engine("partial-work-flow@1.0.0");
    var components = [new OpenURLComponent(), new ExpanderComponent(), new BFSIteratorComponent(), new OpenNodeComponent(), new CloseNodeComponent(), new ValuesScrapperComponent(), new ListsScrapperComponent(), new DictionariesScrapperComponent(), new ClickOperatorComponent() ];
    components.map(c => {
        engine.register(c);
    });
    editor.on(
        "nodecreated noderemoved connectioncreated connectionremoved selectnode",
        async (target) => {
            await engine.abort();
        }
    );


    editor.on('zoom', ({ source }) => {
       return source != 'dblclick';
    });


    //console.log(GraphData)
    //console.log(typeof GraphData)
    if(typeof GraphData != 'undefined' ){
        if(Object.keys(GraphData).length != 0){
            editor.fromJSON(GraphData);
        }
    }
    //console.log(editor)
    editor.view.resize();
    AreaPlugin.zoomAt(editor);
    const { area } = editor.view;
    area.zoom(0.4, -300, -150);
    editor.trigger('process');
}



