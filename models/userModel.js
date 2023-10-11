const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is required'],
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: [true, 'email must be unique'],
    lowercase: true,
    validate: [validator.isEmail, 'please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: 8,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpiration: Date,
});

// Authentication
// --- encrypt the password before saving it ---
userSchema.pre('save', async function (next) {
  // if the user saved any other information
  if (!this.isModified('password')) return next();

  // hash the password
  this.password = await bcrypt.hash(this.password, 12);
});

// --- compare input password to actual user password before login ---
userSchema.methods.correctPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

// --- check if password changed after the generation of the token before login ---
userSchema.methods.isPasswordChangedAfterToken = function (JWTExpirationTime) {
  if (this.passwordChangedAt) {
    changePasswordDate = parseInt(this.passwordChangedAt.getTime() / 1000);
    return changePasswordDate > JWTExpirationTime;
  }
  return false;
  /* 
  false means password does not change or has changed before generating the token
  */
};

// change password
// generate forgot password token
userSchema.methods.createForgotPasswordToken = function () {
  // 1) generate random token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // 2) encrypt the token and save it to the database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpiration = Date.now() + 10 * 1000 * 60;

  console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
