const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
       await mongoose.connect(process.env.MONGO_URL);
       console.log("Connect Successfully");
    } catch (err) {
        console.log("Couldn't connect!");
    }
}