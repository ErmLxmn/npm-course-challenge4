const mongoose = require('mongoose');


let exerciseSchema = new mongoose.Schema({
    description: {type: String , require: true},
    duration: {type: Number , require: true},
    date: Date,
    eUid: String,
})

let userSchema = new mongoose.Schema({
    username : {type: String, require: true}
})


exports.userSchema = userSchema;
exports.exerciseSchema = exerciseSchema;