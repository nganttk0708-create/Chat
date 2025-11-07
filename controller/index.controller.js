const Chat = require('../model/chat.model')
const Account = require('../model/accounts.model')

const uploadToCloundinary = require('../helper/uploadToCloudinary');

// [GET] /
module.exports.index = async (req, res) => {
    const userID = res.locals.user._id
    const fullName = res.locals.user.fullName
    // Socket IO
    _io.once('connection', (socket) => {
        socket.on('client-send-message', async (content) => {
            let images = []

            for (const imageBuffer of content.images) {
                const linkImage = await uploadToCloundinary(imageBuffer)
                images.push(linkImage)
            }

            const chat = new Chat({
                user_id: userID,
                content: content.content,
                images: images

            })
            await chat.save()

            _io.emit('server-return-message', {
                userID: userID,
                fullName: fullName,
                content: content.content,
                images: images
            })
        })

        // Typing
        socket.on('client-typing', async (type) => {
            socket.broadcast.emit('server-return-typing', {
                user_id: userID,
                fullName: fullName,
                type: type
            })
        })
    // End Typing

    })
    // End Socket IO

    // Get data from database
    const chats = await Chat.find({ deleted: false })

    for (const chat of chats) {
        const infoUser = await Account.findById(chat.user_id).select('fullName')
        chat.infoUser = infoUser
    }

    //End Get data from database


    res.render('pages/index', {
        pageTitle: 'Trang chủ',
        chats: chats
    })
}