import { Socket } from "socket.io"

function onInsert(socket: Socket, data: any) {
  socket.broadcast.emit('insert', data)
}

function onDelete(socket: Socket, data: any) {
  socket.broadcast.emit('delete', data)
}

function onEnter(socket: Socket, data: any) {
  socket.broadcast.emit('enter', data)
}

export default {
  'insert': onInsert,
  'delete': onDelete,
  'enter': onEnter
}