const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    quote : {
        type: String,
        required: true
    },
    owner : {
       type : mongoose.Schema.Types.ObjectId,
       ref : 'User',
       required : true
    }
},
    {
    timestamps : true
})
module.exports = mongoose.model('Todo' , todoSchema)
