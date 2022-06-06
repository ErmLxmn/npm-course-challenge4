const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {userSchema, exerciseSchema} = require('./schema.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())

const USER = new mongoose.model("User", userSchema);
const EXERCISE = new mongoose.model("Exercise", exerciseSchema);

 function inputUser(data, callback) {
    let user = new USER({
        username: data.username
    })

     USER.findOne({username : data.username}, function (err, userFound){
        if(err) return console.error(err);
        if(!userFound){
            user.save(function (err, savedUser){
                if(err) return console.error(err);
                
                callback({username: savedUser.username, _id : savedUser.id})
            })
        }else{
            callback({username: userFound.username, _id : userFound.id})
        }
    })
    
}

function inputExercise(data, callback){

    USER.findById({_id : data.id}, function (err, userFound){

        let exercise = new EXERCISE({
            description : data.description,
            duration : data.duration,
            date : data.date,
        })
        
        if(isNaN(Date.parse(exercise.date)))
            exercise.date =  new Date().toString().substring(0 , 15);
        else
            exercise.date = new Date(exercise.date).substring(0 , 15);

        callback({
            username : userFound.username,
            description : exercise.description,
            duration : exercise.duration,
            date : exercise.date,
            _id : userFound.id
        })
    })

}

exports.inputUser = inputUser;
exports.inputExercise = inputExercise;