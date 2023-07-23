const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    reciver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    status: {
        type: String,
        enum: ['unread', 'read'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});


const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
