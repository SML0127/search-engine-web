import React from "react";
import "./editable-item.css";


const ObjectEditableItem = (props) => {
    const { title, changeTitle, selectCategoryNode, checkRemove, removeNode, addChild } = props;

    return (
        <div className="EditableItem">
        
            <button
               className="EditableItem-Button EditableItem-Button_add"
               onClick={addChild}>
                 +
            </button>

            <button
              className="EditableItem-Button EditableItem-Button_remove" 
              onClick={removeNode}>
                x
            </button>
            
            <input
              className="ObjectEditableItem-Text"
              onChange={(e) => { changeTitle(e.target.value) }}
              value={title}
              placeholder="New Item"
            />

        </div>
    );
}

export default ObjectEditableItem;
