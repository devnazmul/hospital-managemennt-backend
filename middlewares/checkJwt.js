const jwt = require("jsonwebtoken");
const checkJwt = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = decoded;

    req.id = id;
    req.role = role;
    next();
  } catch (error) {
    console.log({ error });
    next("Authentication Failed!");
  }
};

module.exports = checkJwt;
