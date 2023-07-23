const Notification = require('../../models/Notification');
const Schedule = require('../../models/Schedule');


const create = async (req, res) => {
    const payload = {
        sender_id: req.id,
        reciver_id: req.body.reciver_id,
        title: req.body.title,
        message: req.body.message,
        status: 'unread'
    }
    console.log(payload)
    const result = await Notification.create(payload);
    res.status(200).send({
        error: false,
        data: result,
        message: 'Notification send successfully.'
    });
}

const getAll = async (req, res) => {
    const result = await Notification.find({ reciver_id: req?.id });
    if (!result) {
        res.status(404).send({
            error: true,
            data: {},
            message: 'Notification not found.'
        });
    } else {
        res.status(200).send({
            error: false,
            data: result,
            message: 'Fetch notification successfully.'
        });
    }
}

const updateStatus = async (req, res) => {
    const { id } = req.params
    const isScheduleExist = await Notification.findOne({ doctor_id: id });
    if (!isScheduleExist) {
        res.status(404).send({
            error: true,
            data: {},
            message: 'Notification not found.'
        });
    } else {
        const result = await Notification.findOneAndUpdate({ _id: id }, { status: 'read' });
        res.status(200).send({
            error: false,
            data: result,
            message: 'schedule updated successfully.'
        });
    }
}

const remove = async (req, res) => {
    const { id } = req.params;
    const isScheduleExist = await Notification.findOne({ _id: id });
    if (!isScheduleExist) {
        res.status(404).send({
            error: true,
            data: {},
            message: 'notification not found.'
        });
    } else {
        const result = await Notification.findByIdAndDelete({ _id: id });
        res.status(200).send({
            error: false,
            data: result,
            message: 'Notification deleted successfully.'
        });
    }
}

module.exports = {
    getAll,
    create,
    updateStatus,
    remove
};