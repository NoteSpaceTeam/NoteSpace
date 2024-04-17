import {BaseOperation} from "slate";


const reverseTypes : { [key : string]: BaseOperation["type"] } = {
    "insert_text": "remove_text",
    "remove_text": "insert_text",
    "insert_node": "remove_node",
    "remove_node": "insert_node",
    "merge_node": "split_node",
    "split_node": "merge_node",
    "move_node": "move_node"
}

export const getReverseType = (type : BaseOperation["type"]) => reverseTypes[type] || type;
