const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chat');
    console.log('Connect success!');
  } catch (error) {
    console.log('Connect error!');
  }
};
