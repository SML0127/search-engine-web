import React from "react";
import "./editable-item.css";


const EditableItem = (props) => {
    const { title, changeTitle, selectCategoryNode, doubleClickCategoryNode, checkRemove2, removeNode2, addChild } = props;

    return (
        <div className="EditableItem">
        
            <button
               className="EditableItem-Button EditableItem-Button_add"
               onClick={addChild}>
                 +
            </button>

            <button
              className="EditableItem-Button EditableItem-Button_remove" 
              onClick={checkRemove2}>
                x
            </button>
            
            <input
              className="EditableItem-Text"
              onChange={(e) => { changeTitle(e.target.value) }}
              onClick={(e) => {selectCategoryNode(e.target.value)}}
              onDoubleClick={(e) => {doubleClickCategoryNode(e.target.value)}}
              value={title}
              placeholder="New Item"
            />

        </div>
    );
}

export default EditableItem;
