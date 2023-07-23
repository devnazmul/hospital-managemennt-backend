const mongoose = require('mongoose');

// Define the doctor schedule schema
const appointmentSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'done', 'rejected'],
    required: true,
  },
  schedule_date: {
    type: String,
  },
  start_time: {
    type: String,
  },
  end_time: {
    type: String,
  },
},
{
    timestamps: true
});


const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
