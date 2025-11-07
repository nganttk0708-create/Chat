const uploadToCloundinary = require('../helper/uploadToCloudinary');

module.exports = async (req, res, next) => {
    if (req.file) {
        const link = await uploadToCloundinary(req.file.buffer);
        req.body[req.file.fieldname] = link;
    }
}