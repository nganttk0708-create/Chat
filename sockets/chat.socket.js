const Chat = require('../model/chat.model');
const uploadToCloundinary = require('../helper/uploadToCloudinary');

module.exports = (_io) => {
  _io.on('connection', (socket) => {
    console.log('[socket] New client connected:', socket.id);

    // Join room
    socket.on('join-room', async ({ roomChatID, userID, fullName }) => {
      if (!roomChatID) return;

      socket.join(roomChatID);
      console.log(`[socket] ${socket.id} joined room ${roomChatID} (user: ${userID})`);

      // Nhận tin nhắn từ client
      socket.on('client-send-message', async (content) => {
        console.log(`[message] ${userID} sent to room ${roomChatID}:`, content.content);

        let images = [];
        for (const imageBuffer of content.images || []) {
          const linkImage = await uploadToCloundinary(imageBuffer);
          images.push(linkImage);
        }

        const chat = new Chat({
          user_id: userID,
          room_id: roomChatID,
          content: content.content,
          images: images,
        });
        await chat.save();

        // Broadcast message cho tất cả user trong room
        _io.to(roomChatID).emit('server-return-message', {
          userID,
          fullName,
          content: content.content,
          images,
        });
      });

      // Typing event
      socket.on('client-typing', (type) => {
        socket.broadcast.to(roomChatID).emit('server-return-typing', {
          user_id: userID,
          fullName,
          type,
        });
      });
    });

  });
};
