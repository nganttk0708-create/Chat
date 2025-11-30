const mongoose = require('mongoose')

module.exports.connect = async () =>{
    try{
        await mongoose.connect('mongodb+srv://chatweb:ngan.123@ngan.2fxcirz.mongodb.net/chat')
        console.log('Connect success!')
    }catch(error){
        console.log('Connect error!')
    }
}
