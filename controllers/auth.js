const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getRandomInt } = require('../utils');
const { query } = require('../api');

// @desc    Signin user
// @route   POST /api/auth/signin
// @access  Public
exports.signin = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const usersData = await query({
    key: 'users',
    url: `/data/users/users.json`,
  });

  if (usersData.users.find((user) => user.email === email)) {
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

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const id = getRandomInt(100000000, 1000000000).toString();

  usersData.users.push({
    id,
    name,
    email,
    password: hash,
    reviewList: [],
    reviewLikeList: [],
    ticketingList: [],
  });

  const token = getToken({ id, name, email });

  res.status(200).json({
    success: true,
    token,
    user: {
      id,
      name,
      email,
      reviewList: [],
      reviewLikeList: [],
      ticketingList: [],
    },
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const usersData = await query({
    key: 'users',
    url: `/data/users/users.json`,
  });

  const user = usersData.users.find((user) => user.email === email);

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
    success: true,
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
