const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const User = require('./../models/userModel');

exports.me = async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);
  return res.status(200).json({
    status: 'success',
    data: { user },
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password)
    return next(new AppError("you can't change password here), 400"));
  // in case of we used roles in the future
  req.body.role = null;
  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id);
  res.status(200).json();
});
