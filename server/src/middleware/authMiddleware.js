const jwt = require("jsonwebtoken");
const { sendResponse } = require("../helper/helper");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const responseData = {
      data: {
        statusCode: 401,
        message: "Authorization failed. No token provided.",
      },
      code: 401,
    };
    return sendResponse(res, responseData);
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email, name: decoded.name };
    return next();
  } catch (err) {
    const responseData = {
      data: {
        statusCode: 401,
        message: "Invalid token.",
      },
      code: 401,
    };
    return sendResponse(res, responseData);
  }
};

module.exports = verifyToken;
