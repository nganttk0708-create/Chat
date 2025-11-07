const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// cloudinary
cloudinary.config({
    cloud_name: 'dkvagkhgb',
    api_key: '488134853383158',
    api_secret: 'hqk6gjx83y_o2HasQY5F_QOcIek'
})
// End cloudinary

let streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        )
        streamifier.createReadStream(buffer).pipe(stream);
    })
}

module.exports = async (buffer) => {
    let result = await streamUpload(buffer);
    return result.secure_url;
}