const mongoose = require('mongoose')
const commentsSchema = new mongoose.Schema({
    groupID: {
        type: Number
    },
    group_name: {
        type: String
    },
    comment: {
        type: String
    },
    comment_id: {
        type: Number
    },
    UID_adding_comment: {
        type: Number
        
    },
    UID_adding_comment_name: {
        type: String
    },
    expen_ID: {
        type: Number
    },
    expen_description: {
        type: String
    },
    date_time: {
        type: Date
    },
    

}, {
    timestamps: true
})


const comments = mongoose.model('comments', commentsSchema)
module.exports = comments