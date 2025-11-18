const Chat = require('../model/chat.model')
const RoomChat = require('../model/rooms-chat.model')
const Account = require('../model/accounts.model')
const chatSocket = require('../sockets/chat.socket')

const uploadToCloundinary = require('../helper/uploadToCloudinary');

// [GET] /
module.exports.index = async (req, res) => {
    const user = res.locals.user
    const userID = user && (user.id || (user._id && user._id.toString()))
    const roomChatID = req.params.roomChatID

    // Socket IO hookup (keep existing behaviour)
    try {
        chatSocket(req, res)
    } catch (e) {
        // socket hookup failed - continue
    }

    // Fetch recent rooms for the user (content-list)
    let rooms = []
    if (userID) {
        try {
            rooms = await RoomChat.find({
                "users.user_id": userID,
                deleted: false
            })
            .sort({ updatedAt: -1 })
            .limit(20)

            // Populate user info for each room
            for (const room of rooms) {
                const userIds = room.users.map(u => u.user_id)
                const userDocs = await Account.find({ _id: { $in: userIds } }).select('_id fullName')
                room.users = room.users.map(u => {
                    const userData = userDocs.find(ud => ud._id.toString() === u.user_id)
                    return {
                        user_id: u.user_id,
                        fullName: userData ? userData.fullName : 'Người dùng'
                    }
                })
            }
        } catch (e) {
            console.error('Error fetching rooms:', e)
            rooms = []
        }
    }

    // Attach last message preview for each room
    for (const room of rooms) {
        try {
            const last = await Chat.findOne({ room_id: room._id.toString(), deleted: false }).sort({ createdAt: -1 })
            if (last) {
                const u = await Account.findById(last.user_id).select('fullName')
                room._doc.lastPreview = {
                    content: last.content || (last.images && last.images.length ? '[Hình ảnh]' : ''),
                    sender: u ? u.fullName : 'Người dùng'
                }
            }
        } catch (e) {
            // ignore per-room errors
        }
    }

    // Only load chats when a room is explicitly requested
    let chats = []
    if (roomChatID) {
        try {
            const roomIdStr = roomChatID.toString()
            chats = await Chat.find({ room_id: roomIdStr, deleted: false }).sort({ createdAt: 1 })
            for (const chat of chats) {
                let infoUser = await Account.findById(chat.user_id).select('fullName')
                if (!infoUser) infoUser = { fullName: 'Người dùng' }
                chat.infoUser = infoUser
            }
        } catch (e) {
            chats = []
        }
    }

    res.render('pages/index', {
        pageTitle: 'Trang chủ',
        rooms: rooms,
        chats: chats,
        currentRoomID: roomChatID || null
    })
}