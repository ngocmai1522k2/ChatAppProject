import io from 'socket.io-client';
let socket;
const baseURL = 'http://192.168.42.238:3001';
const initiateSocket = userId => {
  socket = io(baseURL, {
    transports: ['websocket'],
    query: {userId},
  });
  console.log(`Connecting socket...`);
  socket.on('connect', () => console.log('Current user connected socket...'+ userId));
};
const disconnectSocket = () => {
    console.log('Disconnecting socket...');
    if (socket) socket.disconnect();
    }

export {initiateSocket, socket, disconnectSocket};
