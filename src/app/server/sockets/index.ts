import {  Socket } from 'socket.io';

const socketHandler = (socket: Socket): void => {
  console.log('A user connected:', socket.id);

  socket.on('send_comment', (message: string) => {
    socket.broadcast.emit('send_comment', message)
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
};

export default socketHandler;