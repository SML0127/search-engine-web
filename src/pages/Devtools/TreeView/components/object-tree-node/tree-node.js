import React from "react";
import EditableItem from "../object-editable-item";
import "./tree-node.css";

const ObjectTreeNode = ({ children, ...otherProps }) => {
    const hasChildren = children !== undefined;

    const renderChildren = (children) => {
        return (
            <ul>
                { children.map((nodeProps) => {
                    const { id, ...others } = nodeProps;
                    return (
                        <ObjectTreeNode 
                          key={id}
                          {...others}
                        />
                    );
                }) }
            </ul>
        );
    }        

    return (
        <li>
            <div className="TreeNode">
                <EditableItem {...otherProps} />
            </div>
            {hasChildren && renderChildren(children)}
        </li>
    );
}

export default ObjectTreeNode;
