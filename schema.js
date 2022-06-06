const mongoose = require('mongoose');


let exerciseSchema = new mongoose.Schema({
    description: {type: String , require: true},
    duration: {type: Number , require: true},
    date: String,
})

let userSchema = new mongoose.Schema({
    username : {type: String, require: true},
    logs : [exerciseSchema]
})


exports.userSchema = userSchema;
exports.exerciseSchema = exerciseSchema;