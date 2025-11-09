// [GET] /socialDashboard/friendsList
module.exports.friendsList = async (req, res) => {
    res.render('pages/socialDashboard/friendsList', {
        pageTitle: 'Danh sách bạn bè'
    })
}

// [GET] /socialDashboard/userList
module.exports.userList = async (req, res) => {
    res.render('pages/socialDashboard/userList', {
        pageTitle: 'Danh sách người dùng'
    })
}

// [GET] /socialDashboard/friendRequests
module.exports.friendRequests = async (req, res) => {
    res.render('pages/socialDashboard/friendRequests', {
        pageTitle: 'Lời mời kết bạn'
    })
}

// [GET] /socialDashboard/invitesSent
module.exports.invitesSent = async (req, res) => {
    res.render('pages/socialDashboard/invitesSent', {
        pageTitle: 'Lời mời đã gửi'
    })
}