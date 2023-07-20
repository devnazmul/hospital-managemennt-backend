const mongoose = require('mongoose');
const { AvatarGenerator } = require('random-avatar-generator');

const generator = new AvatarGenerator();

const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false },
        role: { type: String, enum: ['doctor', 'patient', 'assistant'], required: true },
        profile_pic_url: { type: String, required: true, default: generator.generateRandomAvatar() },
    },
    {
        timestamps: true
    }
)

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;