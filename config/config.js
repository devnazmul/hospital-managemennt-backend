require("dotenv").config();

const dev = {
  app: {
    port: process.env.PORT || 8080,
  },
  db: {
    url: process.env.MONGODB_CONNECTION_STRING,
  },
};

module.exports = dev;
