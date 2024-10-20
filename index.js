// All PACKAGES =========================================================
const express = require("express");
const cors = require("cors");
const app = express();
const colog = require("colog");
const path = require("path");
require("./config/db");
const routes = require("./routes");
const dev = require("./config/config");
const morgan = require("morgan");
const cron = require("node-cron");
const Schedule = require("./models/Schedule");
const port = dev.app.port;

// MIDDLEWARE ===========================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));

// TEST ROUTE ===========================================================
app.get("/", (req, res) => {
  res.send("running...");
});

// ROUTES ================================================================
app.use("/api/v1/auth", routes.Admin);
app.use("/api/v1/schedule", routes.Schedule);
app.use("/api/v1/appointment", routes.Appointment);
app.use("/api/v1/notification", routes.Notification);

// CORN JOBS ===========================================================
// cron.schedule("0 0 * * *", async () => {
//   try {
//     const now = new Date();
//     const result = await Schedule.deleteMany({ appointmentDate: { $lt: now } });

//     console.log(`${result.deletedCount} outdated appointments deleted.`);
//   } catch (error) {
//     console.error("Error deleting outdated appointments:", error);
//   }
// });

// ERROR HANDELER MIDDLEWARE ===========================================
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send({
    error: true,
    data: [],
    message: err,
  });
};
app.use(errorHandler);

app.listen(port, () => {
  colog.info("=======================================================");
  colog.info(`🚀 Server is running on http://localhost:${port}`);
  colog.info("=======================================================");
});
