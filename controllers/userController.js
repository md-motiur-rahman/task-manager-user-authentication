const User = require("../models/userModel");
const CustomError = require("../utils/customError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

//create jsonwebtoken
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//pass jsonwetoken in cookie
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt-token", token, cookieOptions);
  user.password = undefined; //remove the password from output
  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmedPassword: req.body.confirmedPassword,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new CustomError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!email || !(await user.checkPassword(password, user.password))) {
    return next(new CustomError("Incorrect email or password", 401));
  }
  createSendToken(user, 200, res);
  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //console.log(token);

  if (!token) {
    return next(new CustomError("Please login", 401));
  }

  //const decoded = promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
  const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded.id);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new CustomError("the token does not exist", 401));
  }
  req.user = currentUser;
  next();
});
