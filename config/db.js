const mongoose = require("mongoose");
const dev = require("./config");

const dbURL = dev.db.url;

mongoose.set("strictQuery", true);

console.info("=======================================================");
console.info("🤖 Database is connecting......");
console.info("=======================================================");
mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.info("=======================================================");
    console.info("🤖 Database is connected.");
    console.info("=======================================================");
  })
  .catch((err) => {
    console.error("=======================================================");
    console.error(err);
    console.error("=======================================================");
    process.exit(1);
  });
