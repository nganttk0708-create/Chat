const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const profileController = require('../controller/profile.controller')

// Cấu hình multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/avatars')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

// Routes
router.get('/edit', profileController.getEditProfile)
router.post('/edit', upload.single('avatar'), profileController.postEditProfile)

module.exports = router
