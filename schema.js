const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username : {type: String, require: true},
    logs : [exerciseSchema]
})

let exerciseSchema = new mongoose.Schema({
    description: {type: String , require: true},
    duration: {type: Number , require: true},
    date: String,
})

exports.userSchema = userSchema;
exports.exerciseSchema = exerciseSchema;