const bcrypt = require('bcrypt');
const Admin = require('../../models/Admin');
const jwt = require('jsonwebtoken');
const Appointment = require('../../models/Appointment');

const registration = async (req, res) => {
    // CHECK IF Admin NOT EXIST
    const email = req.body.email;
    const AdminExist = await Admin.find({ email });

    if (AdminExist.length === 0) {
        bcrypt.hash(
            req.body.password,
            10,
            async (err, hash) => {
                if (err) {
                    throw err;
                } else {
                    await Admin.create({
                        name: req.body.name,
                        email: req.body.email,
                        profile_pic_url: (req.body?.profilePicUrl ? req.body.profilePicUrl : 'https://engineering.unl.edu/images/staff/Kayla-Person.jpg'),
                        password: hash,
                        role: req.body.role
                    });
                    res.status(201).send({
                        data: {
                            name: req.body.name,
                            email: req.body.email,
                            profile_pic_url: (req.body?.profilePicUrl ? req.body.profilePicUrl : 'https://engineering.unl.edu/images/staff/Kayla-Person.jpg'),
                            role: req.body.role
                        },
                        message: 'User is created successfully.'
                    });
                }
            })
    } else {
        res.status(409).send({
            message: 'User already exist with this email account.'
        });
    }
}

const login = async (req, res) => {
    try {
        const AdminExist = await Admin.find({ email: req.body.email })
        if (AdminExist.length > 0) {
            bcrypt.compare(req.body.password, AdminExist[0].password, function (err, result) {
                if (!result) {
                    res.status(401).send({
                        error: true,
                        data: [],
                        message: "Email or password incorrect."
                    })
                }
                if (result) {
                    // JWT AUTH ================
                    const token = jwt.sign(
                        {
                            id: AdminExist[0]._id,
                            role: AdminExist[0].role,
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: '1d' }
                    );

                    res.status(200).send({
                        error: false,
                        data: {
                            id: AdminExist[0]._id,
                            name: AdminExist[0].name,
                            email: AdminExist[0].email,
                            role: AdminExist[0].role,
                            profile_pic_url: AdminExist[0].profile_pic_url
                        },
                        token: token,
                        message: "Login successfully."
                    })
                }
            });
        } else {
            res.status(401).send({
                error: true,
                data: [],
                message: "Authentication Error."
            })
        }
    } catch {
        res.status(401).send({
            error: true,
            data: [],
            message: "Authentication Error."
        })
    }
}

const getAll = async (req, res) => {
    const { role } = req.params
    const result = await Admin.find({ role: role }).select({ "_id": 1, "name": 1, "email": 1, "role": 1 });
    if (!result) {
        res.status(404).send({
            error: true,
            data: {},
            message: 'user not found.'
        });
    } else {
        res.status(200).send({
            error: false,
            data: result,
            message: 'fetch users successfully.'
        });
    }
}

const getSingle = async (req, res) => {
    const { id } = req.params
    const result = await Admin.findOne({ _id: id }).select({ "_id": 1, "name": 1, "email": 1, "role": 1 });
    if (!result) {
        res.status(404).send({
            error: true,
            data: {},
            message: 'user not found.'
        });
    } else {
        res.status(200).send({
            error: false,
            data: result,
            message: 'fetch user successfully.'
        });
    }
}
const dashboard = async (req, res) => {
    if (req?.role === 'assistant') {
        const doctors = await Admin.find({ role: 'doctor' }).estimatedDocumentCount()
        const patients = await Admin.find({ role: 'patient' }).estimatedDocumentCount()
        const appointments = await Appointment.find({}).estimatedDocumentCount()
        if (!appointments && !doctors && !patients) {
            res.status(404).send({
                error: true,
                data: {},
                message: 'user not found.'
            });
        } else {
            res.status(200).send({
                error: false,
                data: {
                    doctors,
                    patients,
                    appointments
                },
                message: 'fetch dashboard data successfully.'
            });
        }
    } else {
        res.status(500).send({
            error: true,
            data: {},
            message: 'Unauthenticated'
        });
    }

}

const getByJWT = async (req, res) => {
    if (req?.id) {
        const result = await Admin.findOne({ _id: req?.id }).select({ "_id": 1, "name": 1, "email": 1, "role": 1 });
        if (!result) {
            res.status(404).send({
                error: true,
                data: {},
                message: 'user not found.'
            });
        } else {
            // JWT AUTH ================
            const token = jwt.sign(
                {
                    id: result._id,
                    role: result.role,
                },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.status(200).send({
                error: false,
                data: {
                    id: result._id,
                    name: result.name,
                    email: result.email,
                    role: result.role,
                    profile_pic_url: result.profile_pic_url
                },
                token: token,
                message: "fetched user information successfully."
            })
        }
    } else {
        res.status(498).send({
            error: true,
            data: {},
            message: 'Unauthenticated'
        });
    }

}

const update = async (req, res) => {
    const { id } = req.params
    const isExist = await Admin.findOne({ _id: id });

    if (!isExist) {
        res.status(404).send({
            error: true,
            data: {},
            message: 'user not found.'
        });
    } else {
        if ((isExist?._id === req.id) || req.role === 'assistant') {
            const result = await Admin.findOneAndUpdate({ _id: id }, req.body).select({ "_id": 1, "name": 1, "email": 1, "role": 1 });

            res.status(200).send({
                error: false,
                data: result,
                message: 'user updated successfully.'
            });
        } else {
            res.status(401).send({
                error: true,
                data: result,
                message: 'no permission to perform this tusk'
            });
        }
    }
}

const remove = async (req, res) => {
    const { id } = req.params
    const isExist = await Admin.findOne({ _id: id });
    if (!isExist) {
        res.status(404).send({
            error: true,
            data: {},
            message: 'user not found.'
        });
    } else {
        if ((isExist?._id === req.id) || req.role === 'assistant') {
            const result = await Admin.findByIdAndDelete({ _id: id }).select({ "_id": 1, "name": 1, "email": 1, "role": 1 });
            res.status(200).send({
                error: true,
                data: result,
                message: 'user deleted successfully.'
            });
        } else {
            res.status(401).send({
                error: true,
                data: result,
                message: 'no permission to perform this tusk'
            });
        }

    }
}


module.exports = {
    dashboard,
    getByJWT,
    registration,
    login,
    getAll,
    getSingle,
    remove,
    update
};