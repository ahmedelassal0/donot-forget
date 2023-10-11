const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const User = require('./../models/userModel');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  // creating a new user
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });
  await user.save();

  //   generating token for the user
  const token = generateToken(user._id);

  res.json({
    status: 'success',
    data: { user: { ...user._doc, password: undefined } },
    token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // check if email and password exist in the request
  if (!username || !password) {
    return next(new AppError('please provide username and password', 400));
  }

  // check if user exists and password correct
  const user = await User.findOne({ username }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('invalid username or password', 401));
  }

  //   generating token for the user
  const token = generateToken(user._id);

  // send response
  res.status(201).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // check if user sent the token
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    return next(new AppError('please login to access', 401));
  }

  let token = req.headers.authorization.split(' ')[1];
  // check if token is valid
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  //   const decoded = await jwt.verify(token, decoded);

  // check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('the user belongs to that token is no longer exist', 401)
    );
  }
  // check if the user changed his password after token generated
  if (currentUser.isPasswordChangedAfterToken(decoded.iat)) {
    return next(
      new AppError(
        'the password has been changed recently, please login again',
        401
      )
    );
  }
  req.user = currentUser;
  return next();
});

// NOT WORKING YET (a problem with sending an email)
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) check if user sent a valid email
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new AppError('this email is not defined', 404));

  // 2) generate random token that used to update an email
  const resetToken = user.createForgotPasswordToken();
  await user.save({ validateBeforeSave: false });

  // 3) send token to user's email
  /* create the message and url for change password
     (we will send them through the email)*/
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;
  const message = `Forgot Password? go through this URL to change it: ${resetURL}`;

  try {
    // sendEmail({
    //   email: user.email,
    //   subject: 'Natours password reset token (available for 10 inutes)',
    //   message
    // });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiration = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('An error occurred while sending email', 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'please chek your email',
  });
});
