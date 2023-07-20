const mongoose = require('mongoose');

// Define the doctor schedule schema
const scheduleSchema = new mongoose.Schema({
  doctor_id: {
    type: String,
    required: true,
    unique: true,
  },
  free_slots: [
    {
      date: {
        type: String,
        required: true,
      },
      start_time: {
        type: String,
        required: true,
      },
      end_time: {
        type: String,
        required: true,
      },
    },
  ],
});


const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
