import React, { Component } from "react";
import Calendar from "react-calendar"
import TreeNode from "../config-category-tree-node";
import AddButton from "../add-button";
import ControlPanel from "../control-panel";
import TextView from "../text-view";
import "./tree.css";
import {Button} from "tabler-react"
import axios from 'axios'
import SelectTPModal from "../vm-config-category-tree/SelectTransformationProgramModal";
import { 
  Modal,
  ModalHeader,
  ModalBody,
}  from 'reactstrap';
import setting_server from '../../../setting_server';


class Tree extends Component {

    constructor(props) {
        super(props);
        this.state = this.initState();
        this.changeTitle = this.changeTitle.bind(this);
        this.selectCategoryNode = this.selectCategoryNode.bind(this);
        this.addRootElement = this.addRootElement.bind(this);
        this.addChild = this.addChild.bind(this);
        this.checkRemove = this.checkRemove.bind(this);
        this.removeNode = this.removeNode.bind(this);
        this.saveState = this.saveState.bind(this);
        this.loadState = this.loadState.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.nodesToString = this.nodesToString.bind(this);
    }


    onTodoChange(key,value){
      this.setState({
        [key]: value
      });
    }

    initState(){
      let curUrl = window.location.href;
      return {
        nodes:[],
        savedNodes: [],
        selected_category_id: "",
        selected_category_title: "",
        id: "",
      }
    }

    componentWillReceiveProps(nextProps) {
      if(this.props.refresh != nextProps.refresh){
         this.props.saveMySiteProperty(this.state.selected_category_title)
      }
    }

    componentDidMount(){
      let curUrl = window.location.href;
      this.getMySiteCategoryTree()

    }

    closeModal(modal) {
      this.setState({
          [modal]: false
          });
    }
    showModal(modal, id) {
      this.setState({
          [modal]: true,
          id: id
          });
    }
    
    checkRemove(id) {
      return () =>{
        this.showModal('confirm_modal',id)
      }
    }

    getMySiteCategoryTree() {
        let userId = this.props.userId
        const obj = this;
        axios.post(setting_server.DB_SERVER+'/api/db/mysitecategorytree', {
            req_type: "get_category_tree",
            user_id: userId
        })
        .then(function (resultData) {
            let output = resultData['data']['output']
            if(output){
              let category_tree = JSON.parse(output[0])
              obj.setState({
                  nodes: obj.initializedСopy(category_tree)
              })
            }
            else{
              obj.setState({
                  nodes: []
              })
            }
            obj.setState({
              selected_category_title: obj.props.mCategory   
            })
        })
        .catch(function (error) {
            console.log(error);
        });

    }


    updateCategory() {
        const obj = this;
        axios.post(setting_server.DB_SERVER+'/api/db/mysitecategorytree', {
            req_type: "update_category_tree",
            category_tree: JSON.stringify(this.simplify(this.state.nodes)),
            user_id: this.props.userId
        })
        .then(function (resultData) {
        })
        .catch(function (error) {
            console.log(error);
        });

    }


    initializedСopy(nodes, location) {
        const nodesCopy = [];
        for (let i = 0; i < nodes.length; i++) {
            const { children, title } = nodes[i];
            const hasChildren = children !== undefined;
            const id = location ? `${location}.${i + 1}` : `${i + 1}`;
            nodesCopy[i] = { 
                    children: hasChildren ? this.initializedСopy(children, id) : undefined,
                    changeTitle: this.changeTitle(id),
                    selectCategoryNode: this.selectCategoryNode(id),
                    checkRemove: this.checkRemove(id),
                    removeNode: this.removeNode(id),
                    addChild: this.addChild(id),
                    id,
                    title,
            };
        }
        return nodesCopy;
    }

    changeTitle(id) {
        return (newTitle) => {
            id = id.split(".").map((str) => parseInt(str));
            const nodes = this.initializedСopy(this.state.nodes);
            let changingNode = nodes[id[0] - 1];

            if (id.length > 1) {
                for (let i = 1; i < id.length; i++) {
                    changingNode = changingNode.children[id[i] - 1];
                }
            }

            changingNode.title = newTitle;
            this.setState({ nodes });
        };
    }

    selectCategoryNode(id) {
        var obj = this;
        return (title) => {
            obj.setState({
                selected_category_id: id,   
                selected_category_title: title
            })
        };
    }
    addRootElement() {
        var obj = this;
        const id = obj.state.nodes.length ? `${obj.state.nodes.length + 1}` : "1";
        const newNode = { 
            children: undefined,
            changeTitle: obj.changeTitle(id),
            selectCategoryNode: obj.selectCategoryNode(id),
            checkRemove: obj.checkRemove(id),
            removeNode: obj.removeNode(id),
            addChild: obj.addChild(id),
            id,
            title: "",
        };
        
        const nodes = [...obj.state.nodes, newNode];
        obj.setState({ nodes });
    }

    addChild(id) {
        return () => {
            id = id.split(".").map((str) => parseInt(str));
            const nodes = this.initializedСopy(this.state.nodes);
            let changingNode = nodes[id[0] - 1];

            if (id.length > 1) {
                for (let i = 1; i < id.length; i++) {
                    changingNode = changingNode.children[id[i] - 1];
                }
            }

            if (changingNode.children === undefined) {
                changingNode.children = [];
            }
            
            id = `${id.join(".")}.${changingNode.children.length + 1}`;

            changingNode.children = [
                ...changingNode.children,
                { 
                    children: undefined,
                    changeTitle: this.changeTitle(id),
                    selectCategoryNode: this.selectCategoryNode(id),
                    checkRemove: this.checkRemove(id),
                    removeNode: this.removeNode(id),
                    addChild: this.addChild(id),
                    id,
                    title: "",
                }];

            this.setState({ nodes });
        }
    }

    
    removeNode(id) {
        return () => {
            id = id.split(".").map((str) => parseInt(str));
            const nodes = this.initializedСopy(this.state.nodes);
            if (id.length === 1) {
                const newNodes = [
                    ...nodes.slice(0, [id[0] - 1]),
                    ...nodes.slice(id[0])
                ];

                this.setState( { nodes: this.initializedСopy(newNodes) } );
            } else {
                let changingNode = nodes[id[0] - 1];
                for (let i = 2; i < id.length; i++) {
                    changingNode = changingNode.children[id[i - 1] - 1];
                }

                const index = id[id.length - 1] - 1;

                const newChildren = [
                    ...changingNode.children.slice(0, index),
                    ...changingNode.children.slice(index + 1),
                ];
                changingNode.children = newChildren;

                this.setState({ nodes: this.initializedСopy(nodes) });
            }
            this.closeModal('confirm_modal')
        }
    }

    saveState() {
        this.setState({ savedNodes: this.initializedСopy(this.state.nodes) });
    }

    loadState() {
        this.setState({ nodes: this.initializedСopy(this.state.savedNodes) });
    }

    onTextChange(e) { 
        this.setState({ nodes: this.initializedСopy(JSON.parse(e.target.value)) });
    }

    nodesToString() {
        return JSON.stringify(this.simplify(this.state.nodes), undefined, 2);
    }

    simplify(nodes) {
        const nodesCopy = [];
        for (let i = 0; i < nodes.length; i++) {
            const { children, title } = nodes[i];
            const hasChildren = children !== undefined && children.length > 0;
            nodesCopy[i] = { 
                title,
                children: hasChildren ? this.simplify(children) : undefined,
            };
        }
        return nodesCopy;
    }

    render() {
        const { nodes, savedNodes } = this.state;
        const { addRootElement, saveState, 
                loadState, onTextChange, nodesToString} = this;
        const hasSaved = savedNodes.length !== 0;

        return (
            <div className="Tree">
                <div className="Tree-AllSide">
                    <label for="name"  style={{display: "flex",justifyContent: "center",alignItems: "center", fontWeight: "bold", fontSize:'20px'}}> My Site Category</label>
                <div>
                    <Button 
                        class="btn btn-outline-dark"
                        type="button"
                        onClick={addRootElement}
                        style={{marginLeft:"30px", width:"100px"}}
                    >
                        Add Root
                    </Button>
                    <Button 
                        class="btn btn-outline-dark"
                        type="button"
                        onClick={() => {this.updateCategory()}}
                        style={{marginLeft:"30px", width:"100px"}}
                    >
                        Update
                    </Button>
                </div>
                <ul className="Nodes" style={{marginTop:"5px",overflow:'auto',width:'100%',maxHeight:'165px',minHeight:'165px'}}>
                  { nodes.map((nodeProps) => {
                    const { id, ...others } = nodeProps;
                    return (
                      <TreeNode 
                        key={id}
                        {...others}
                      />
                    );}) }
                </ul>
                <label style={{marginLeft:'30px', width:"120%", marginTop:'4px', fontWeight:'600', }} >
                  Category
                  <input readonly='readonly' name="selected_Category" class="form-control"style={{width:"80%",marginTop:'1%'}} value= {this.state.selected_category_title } />
                </label>
               <Modal isOpen={this.state.confirm_modal} toggle={this.closeModal.bind(this, 'confirm_modal')}>
                <ModalHeader toggle={this.closeModal.bind(this, 'confirm_modal')}>
                Confirm to remove
                </ModalHeader>
                <ModalBody>
                  Are you sure to do this?
                  <p></p>
                  <Button style={{float:'right'}}onClick={this.closeModal.bind(this, 'confirm_modal')}>
                  No
                  </Button>
                  <Button style={{float:'right'}}onClick={this.removeNode(this.state.id)}>
                  Yes
                  </Button>
                  
                </ModalBody>
              </Modal>
             </div>


            </div>
        );
    }
}

export default Tree;
