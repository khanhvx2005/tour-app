const mongoose = require('mongoose');
module.exports.connect = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONG_URL);
        console.log("Kết nối DB thành công")

    } catch (error) {
        console.log("Kết nối DB thất bại")
    }
}