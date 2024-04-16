import {Editor} from "slate";
import {HistoryOperations} from "@editor/slate/events/historyEvents";

export function overrideHistoryMethods(editor: Editor, events: HistoryOperations) {
  editor.undo = events.undo;
  editor.redo = events.redo;
  editor.insertData
}