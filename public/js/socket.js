var socket = io();

// Khi user mở room
function joinRoom(roomChatID, userID, fullName) {
  socket.emit('join-room', { roomChatID, userID, fullName });
}
