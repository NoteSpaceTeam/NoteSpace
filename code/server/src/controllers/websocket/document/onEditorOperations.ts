import { Socket } from 'socket.io';

function onEditorOperations() {
  return function (socket : Socket, operation : string) {
    socket.broadcast.emit('editorOperations', operation)
    console.log("Editor operation:", operation)
  };
}

export default onEditorOperations;