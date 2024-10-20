const Schedule = require("../../models/Schedule");

const create = async (req, res) => {
  if (req.role === "doctor") {
    const payload = {
      doctor_id: req.id,
      free_slots: req.body.free_slots,
    };
    const isScheduleExist = await Schedule.findOne({ doctor_id: req.id });
    if (isScheduleExist) {
      res.status(409).send({
        error: true,
        data: {},
        message: "This doctor already have an schedule.",
      });
    } else {
      const result = await Schedule.create(payload);
      res.status(200).send({
        error: false,
        data: result,
        message: "schedule created successfully.",
      });
    }
  } else {
    res.status(401).send({
      error: true,
      data: {},
      message: "no permission to perform this tusk",
    });
  }
};

const getAll = async (req, res) => {
  if (req.role === "assistant") {
    const result = await Schedule.find({});
    if (!result) {
      res.status(404).send({
        error: true,
        data: {},
        message: "schedule not found.",
      });
    } else {
      res.status(200).send({
        error: false,
        data: result,
        message: "fetch schedule successfully.",
      });
    }
  } else {
    res.status(401).send({
      error: true,
      data: {},
      message: "no permission to perform this tusk",
    });
  }
};

const get = async (req, res) => {
  const { doctor_id } = req.params;
  console.log({ doctor_id });
  const result = await Schedule.findOne({ doctor_id: doctor_id });
  if (!result) {
    res.status(200).send({
      error: false,
      data: {},
      message: "schedule not found.",
    });
  } else {
    res.status(200).send({
      error: false,
      data: result,
      message: "fetch schedule successfully.",
    });
  }
};

const update = async (req, res) => {
  if (req.role === "doctor") {
    const { doctor_id } = req.params;
    const isScheduleExist = await Schedule.findOne({ doctor_id: doctor_id });
    if (!isScheduleExist) {
      res.status(404).send({
        error: true,
        data: {},
        message: "schedule not found.",
      });
    } else {
      const result = await Schedule.findOneAndUpdate(
        { doctor_id: doctor_id },
        { free_slots: req.body.free_slots }
      );

      res.status(200).send({
        error: false,
        data: result,
        message: "schedule updated successfully.",
      });
    }
  } else {
    res.status(401).send({
      error: true,
      data: {},
      message: "no permission to perform this tusk",
    });
  }
};

const remove = async (req, res) => {
  if (req.role === "doctor") {
    const doctor_id = req.id;
    const isScheduleExist = await Schedule.findOne({ doctor_id: doctor_id });
    if (!isScheduleExist) {
      res.status(404).send({
        error: true,
        data: {},
        message: "schedule not found.",
      });
    } else {
      const result = await Schedule.findByIdAndDelete({ doctor_id: doctor_id });

      res.status(200).send({
        error: false,
        data: result,
        message: "schedule deleted successfully.",
      });
    }
  } else {
    res.status(401).send({
      error: true,
      data: {},
      message: "no permission to perform this tusk",
    });
  }
};

module.exports = {
  get,
  getAll,
  create,
  update,
  remove,
};
