const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { fileUpload,sendResponse } = require("../helper/helper");


const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendResponse(res, {
        data: { statusCode: 400, message: 'Missing fields' },
        code: 400
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return sendResponse(res, {
        data: { statusCode: 400, message: 'Email already in use' },
        code: 400
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, passwordHash });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return sendResponse(res, {
      data: {
        statusCode: 200,
        message: 'Registration successful',
        token,
        user: { id: user._id, name: user.name, email: user.email }
      },
      code: 200
    });

  } catch (err) {
    console.error(err);
    return sendResponse(res, {
      data: { statusCode: 500, message: 'Server error' },
      code: 500
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, {
        data: { statusCode: 400, message: 'Invalid credentials' },
        code: 400
      });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return sendResponse(res, {
        data: { statusCode: 400, message: 'Invalid credentials' },
        code: 400
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return sendResponse(res, {
      data: {
        statusCode: 200,
        message: 'Login successful',
        token,
        user: { id: user._id, name: user.name, email: user.email }
      },
      code: 200
    });

  } catch (err) {
    console.error(err);
    return sendResponse(res, {
      data: { statusCode: 500, message: 'Server error' },
      code: 500
    });
  }
};

module.exports = { register, login };