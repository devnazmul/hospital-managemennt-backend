const Admin = require('../../models/Admin');
const Appointment = require('../../models/Appointment');
const bcrypt = require('bcrypt');
// UTILS 
async function getPatientDoctorNames(patientId, doctorId) {
    // Your logic to fetch the names based on the provided _id
    // For example, if you have a separate 'Patients' and 'Doctors' collection:
    const patient = await Admin.findById(patientId).exec();
    const doctor = await Admin.findById(doctorId).exec();

    return {
        patient_name: patient ? patient.name : 'Unknown Patient',
        doctor_name: doctor ? doctor.name : 'Unknown Doctor',
    };
}


const create = async (req, res) => {
  if (req.role === 'assistant' || req.role === 'patient') {
    const payload = {
      doctor_id: req.body.doctor_id,
    };

    if (req.role === 'patient') {
      payload.patient_id = req?.id;
      payload.status = 'pending';
      payload.schedule_date = '';
    } else {
      payload.status = 'approved';
      payload.schedule_date = req.body.schedule_date;
      payload.start_time = req.body.start_time;
      payload.end_time = req.body.end_time;

      if (req.body.patient_id) {
        payload.patient_id = req.body.patient_id;
      } else {
        // Assuming the Admin model is used for both admins and patients
        const AdminExist = await Admin.find({ email: req.body.email });

        if (AdminExist.length === 0) {
          // Hash the password before creating the patient
          bcrypt.hash(req.body.password, 10, async (err, hash) => {
            if (err) {
              throw err;
            } else {
              const result = await Admin.create({
                name: req.body.name,
                email: req.body.email,
                profile_pic_url: req.body?.profilePicUrl || 'https://i.ibb.co/1TsyJh8/Screenshot-2023-07-22-114233.png',
                password: hash,
                role: 'patient',
              });
              if (result) {
                payload.patient_id = result?._id;
                // Now, proceed to create the appointment with the new patient_id
                const appointmentResult = await Appointment.create(payload);
                res.status(200).send({
                  error: false,
                  data: appointmentResult,
                  message: 'Appointment created successfully.',
                });
              } else {
                res.status(500).send({
                  error: true,
                  data: {},
                  message: 'Operation failed.',
                });
              }
            }
          });
          // The rest of the code for the 'assistant' role will be skipped here
          return;
        } else {
          res.status(409).send({
            message: 'User already exists with this email account.',
          });
          return;
        }
      }
    }
    // The rest of the code for the 'patient' role will be skipped here
    // as the patient_id has been set in the payload
    const result = await Appointment.create(payload);
    res.status(200).send({
      error: false,
      data: result,
      message: 'Appointment created successfully.',
    });
  } else {
    res.status(401).send({
      error: true,
      data: {},
      message: 'No permission to perform this task.',
    });
  }
};


const getAll = async (req, res) => {
    if (req.role === 'assistant') {
        const appointments = await Appointment.find({}).exec();
        // Process the appointments to get the desired output
        const result = await Promise.all(
            appointments.map(async (appointment) => {
                const { patient_name, doctor_name } = await getPatientDoctorNames(
                    appointment.patient_id,
                    appointment.doctor_id
                );

                return {
                    _id: appointment._id,
                    patient_id:appointment.patient_id,
                    patient_name,
                    doctor_id:appointment.doctor_id,
                    doctor_name,
                    status: appointment.status,
                    schedule_date: appointment.schedule_date,
                    start_time: appointment.start_time,
                    end_time: appointment.end_time,
                };
            })
        );
        if (!result) {
            res.status(200).send({
                error: false,
                data: {},
                message: 'Appointment not found.'
            });
        } else {
            res.status(200).send({
                error: true,
                data: result,
                message: 'fetch Appointment successfully.'
            });
        }
    } else if (req.role === 'patient') {
        const appointments = await Appointment.find({ patient_id: req.id }).exec();

        // Process the appointments to get the desired output
        const result = await Promise.all(
            appointments.map(async (appointment) => {
                const { patient_name, doctor_name } = await getPatientDoctorNames(
                    appointment.patient_id,
                    appointment.doctor_id
                );

                return {
                    _id: appointment._id,
                    patient_id:appointment.patient_id,
                    patient_name,
                    doctor_id:appointment.doctor_id,
                    doctor_name,
                    status: appointment.status,
                    schedule_date: appointment.schedule_date,
                    start_time: appointment.start_time,
                    end_time: appointment.end_time,
                };
            })
        );
        if (!result) {
            res.status(404).send({
                error: true,
                data: {},
                message: 'Appointment not found.'
            });
        } else {
            res.status(200).send({
                error: true,
                data: result,
                message: 'fetch Appointment successfully.'
            });
        }
    } else if (req.role === 'doctor') {
        const appointments = await Appointment.find({ doctor_id: req.id, status: 'approved' });
        // Process the appointments to get the desired output
        const result = await Promise.all(
            appointments.map(async (appointment) => {
                const { patient_name, doctor_name } = await getPatientDoctorNames(
                    appointment.patient_id,
                    appointment.doctor_id
                );

                return {
                    _id: appointment._id,
                    patient_id:appointment.patient_id,
                    patient_name,
                    doctor_id:appointment.doctor_id,
                    doctor_name,
                    status: appointment.status,
                    schedule_date: appointment.schedule_date,
                    start_time: appointment.start_time,
                    end_time: appointment.end_time,
                };
            })
        );
        if (!result) {
            res.status(404).send({
                error: true,
                data: {},
                message: 'Appointment not found.'
            });
        } else {
            res.status(200).send({
                error: true,
                data: result,
                message: 'fetch Appointment successfully.'
            });
        }
    }

}

const get = async (req, res) => {
    const { id } = req.params
    if (req.role === 'assistant') {
        const result = await Appointment.findOne({ _id: id });
        if (!result) {
            res.status(404).send({
                error: true,
                data: {},
                message: 'Appointment not found.'
            });
        } else {
            res.status(200).send({
                error: true,
                data: result,
                message: 'fetch Appointment successfully.'
            });
        }
    }

    if (req.role === 'patient') {
        const result = await Appointment.findOne({ patient_id: req.id, _id: id });
        if (!result) {
            res.status(404).send({
                error: true,
                data: {},
                message: 'Appointment not found.'
            });
        } else {
            res.status(200).send({
                error: true,
                data: result,
                message: 'fetch Appointment successfully.'
            });
        }
    }

    if (req.role === 'doctor') {
        const result = await Appointment.findOne({ doctor_id: req.id, _id: id });
        if (!result) {
            res.status(404).send({
                error: true,
                data: {},
                message: 'Appointment not found.'
            });
        } else {
            res.status(200).send({
                error: true,
                data: result,
                message: 'fetch Appointment successfully.'
            });
        }
    }

}

const approve = async (req, res) => {
    if (req.role === 'assistant') {
        const { id } = req.params
        const isAppointmentExist = await Appointment.findOne({ _id: id });
        if (!isAppointmentExist) {
            res.status(404).send({
                error: true,
                data: {},
                message: 'Appointment not found.'
            });
        } else {
            const result = await Appointment.findOneAndUpdate({ _id: id }, {status:'approved'});
            res.status(200).send({
                error: true,
                data: result,
                message: 'Appointment approved successfully.'
            });
        }
    } else {
        res.status(401).send({
            error: true,
            data: result,
            message: 'no permission to perform this tusk'
        });
    }
}

const reject = async (req, res) => {
    if (req.role === 'assistant'||req.role === 'aptient') {
        const { id } = req.params
        const isAppointmentExist = await Appointment.findOne({ _id: id });
        if (!isAppointmentExist) {
            res.status(404).send({
                error: true,
                data: {},
                message: 'Appointment not found.'
            });
        } else {
            const result = await Appointment.findOneAndUpdate({ _id: id }, {status:'rejected'});
            res.status(200).send({
                error: true,
                data: result,
                message: 'Appointment rejected successfully.'
            });
        }
    } else {
        res.status(401).send({
            error: true,
            data: result,
            message: 'no permission to perform this tusk'
        });
    }
}

const update = async (req, res) => {
    if (req.role === 'assistant' || req.role === 'patient') {
        const { id } = req.params
        const isAppointmentExist = await Appointment.findOne({ _id: id });
        if (!isAppointmentExist) {
            res.status(404).send({
                error: true,
                data: {},
                message: 'Appointment not found.'
            });
        } else {

            const payload = req.body
            const result = await Appointment.findOneAndUpdate({ _id: id }, payload);

            res.status(200).send({
                error: true,
                data: result,
                message: 'Appointment updated successfully.'
            });
        }
    } else {
        res.status(401).send({
            error: true,
            data: result,
            message: 'no permission to perform this tusk'
        });
    }
}

const remove = async (req, res) => {
    if (req.role === 'assistant') {
        const { id } = req.params
        const isAppointmentExist = await Appointment.findOne({ _id: id });

        if (!isAppointmentExist) {
            res.status(404).send({
                error: true,
                data: {},
                message: 'Appointment not found.'
            });
        } else {
            const result = await Appointment.findByIdAndDelete({ _id: id });

            res.status(200).send({
                error: true,
                data: result,
                message: 'Appointment deleted successfully.'
            });
        }
    } else {
        res.status(401).send({
            error: true,
            data: result,
            message: 'no permission to perform this tusk'
        });
    }

}

module.exports = {
    get,
    getAll,
    create,
    update,
    approve,
    reject,
    remove
};