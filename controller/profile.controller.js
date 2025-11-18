const Account = require('../model/accounts.model')
const path = require('path')
const fs = require('fs')

// Hiển thị form chỉnh sửa profile
exports.getEditProfile = async (req, res) => {
    const user = res.locals.user
    res.render('pages/profile/edit', { pageTitle: 'Chỉnh sửa thông tin', user })
}

// Xử lý POST update profile
exports.postEditProfile = async (req, res) => {
    try {
        const userId = res.locals.user._id
        const updateData = {
            fullName: req.body.fullName,
            email: req.body.email,
            numberPhone: req.body.numberPhone
        }

        if (req.file) {
            // Lưu path avatar vào DB
            updateData.avatar = '/uploads/avatars/' + req.file.filename
        }

        await Account.findByIdAndUpdate(userId, updateData)
        res.redirect('/') // hoặc redirect về /profile/edit
    } catch (err) {
        console.error(err)
        res.status(500).send('Có lỗi xảy ra khi cập nhật profile')
    }
}
