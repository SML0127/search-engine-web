import React from "react";
import "./editable-item.css";


const EditableItem = (props) => {
    const { title, changeTitle, selectCategoryNode, doubleClickCategoryNode, checkRemove, removeNode, addChild } = props;

    return (
        <div className="EditableItem">
        
            <button
               className="EditableItem-Button EditableItem-Button_add"
               onClick={addChild}>
                 +
            </button>

            <button
              className="EditableItem-Button EditableItem-Button_remove" 
              onClick={checkRemove}>
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
