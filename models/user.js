const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
        username: {
            required: true,
            type: String,
            unique: true
        },
        password: {
            required: true,
            type: String,
            min: 6
        },
        token: String
    },
    {
        timestamps: true,
        toObject: {
            transform: (_doc, user) => {
                delete user.password
                return user
            }
        }
    })

module.exports = mongoose.model('User', userSchema)
