const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getRandomInt } = require('../utils');
const User = require('../models/userModel.js');

// @desc    Sign up user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: '이미 가입된 이메일입니다.',
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: '두 비밀번호가 일치하지 않습니다.',
    });
  }

  const user = await User.create({
    id: getRandomInt(100000000, 1000000000).toString(),
    name,
    email,
    password,
    reviewList: [],
    reviewLikeList: [],
    ticketingList: [],
  });

  if (user) {
    return res.status(201).json({
      success: true,
      token: getToken({ id: user.id, name: user.name, email: user.email }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        reviewList: user.reviewList,
        reviewLikeList: user.reviewLikeList,
        ticketingList: user.ticketingList,
      },
    });
  } else {
    return res.status(400).json({
      success: false,
      message: '입력값이 유효하지 않습니다.',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const users = await User.find({ email }).exec();
  const user = users[0];

  if (!email || !password)
    return res.status(400).json({
      success: false,
      message: '이메일과 비밀번호를 입력하세요.',
    });
  if (!user)
    return res.status(401).json({
      success: false,
      message: '존재하지 않는 이메일입니다.',
    });
  if (!(await matchPassword(password, user.password)))
    return res.status(401).json({
      success: false,
      message: '잘못된 비밀번호입니다.',
    });

  const token = getToken({ id: user.id, name: user.name, email: user.email });

  res.status(200).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      reviewList: user.reviewList,
      reviewLikeList: user.reviewLikeList,
      ticketingList: user.ticketingList,
    },
  });
};

// @desc    Logout user
// @route   Get /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
  });
};

function getToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
}

async function matchPassword(enteredPassword, hashedPassword) {
  return await bcrypt.compare(enteredPassword, hashedPassword);
}
