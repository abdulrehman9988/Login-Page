const mongoose = require('mongoose')
//this line means i connect my database to this path 
const connect=mongoose.connect("mongodb://localhost:27017/Login-Db")

//this is for checking database connected or not
connect.then(()=>{
  console.log("Database Connected Successfully");
  
})
.catch(()=>{
  console.log("Database cannot be connected");
  
})


//i created a login or signup schema that format should be like this
const LoginSchema = new mongoose.Schema({
  name:{
    type:String,
    required: true
  },
  password:{
    type:String,
    required: true
  }
});

// this line means that "user" is my collection name simply i pass my data to that collection
const collection = new mongoose.model("users",LoginSchema)

module.exports = collection