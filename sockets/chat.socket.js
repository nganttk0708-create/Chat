const Chat = require('../model/chat.model');
const User = require('../model/accounts.model');
const uploadToCloundinary = require('../helper/uploadToCloudinary');

module.exports = (_io) => {
  _io.on('connection', (socket) => {
    console.log('[socket] New client connected:', socket.id);

    // Join room
    socket.on('join-room', async ({ roomChatID, userID, fullName }) => {
      if (!roomChatID) return;

      socket.join(roomChatID);
      console.log(`[socket] ${socket.id} joined room ${roomChatID} (user: ${userID})`);

      socket.on('client-send-message', async (content) => {

        let images = [];
        for (const imageBuffer of content.images || []) {
          const linkImage = await uploadToCloundinary(imageBuffer);
          images.push(linkImage);
        }

        // Lấy thông tin user để gửi avatar, tên
        const infoUser = await User.findById(userID).lean();

        const chat = new Chat({
          user_id: userID,
          room_id: roomChatID,
          content: content.content,
          images: images,
        });
        await chat.save();

        _io.to(roomChatID).emit('server-return-message', {
          userID,
          fullName: infoUser.fullName,
          avatar: infoUser.avatar || "/images/default-avatar.jpg",
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
