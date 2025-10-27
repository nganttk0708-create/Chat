module.exports.index = async (req, res) => {
    // Socket IO
    _io.on('connection', (socket) => {
        socket.on('client-send-message', (data) => {
            
        })
    })
    // End Socket IO

    res.render('pages/index', {
        pageTitle: 'Trang chủ'
    })
}