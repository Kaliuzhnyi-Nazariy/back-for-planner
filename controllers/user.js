const { ctrlWrapper, HttpError } = require("../helpers");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const { SECRET_KEY, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;

  const isUser = await User.findOne({ email });

  if (isUser) {
    return res
      .status(400)
      .json({ message: "User with this email already exists." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    username,
    password: hashPassword,
  });

  res.status(201).json({
    id: newUser._id,
    email: newUser.email,
    username: newUser.username,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const comparePssw = await bcrypt.compare(password, user.password);

  if (!comparePssw) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({ id: user._id, username: user.username, email, token });
};

const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { email, username } = req.body;
  const oldUserInfo = req.user;

  console.log(oldUserInfo);

  if (oldUserInfo.email !== email || oldUserInfo.username !== username) {
    next(HttpError(401));
  }

  const newUserInfo = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  });

  res
    .status(200)
    .json({ email: newUserInfo.email, username: newUserInfo.username });
};

const logout = async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user) {
    next(HttpError(401));
  }

  await User.findByIdAndUpdate(id, { token: "" });

  res.json({ message: "Logged out successfully!" });
};

const deleteAcc = async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user) {
    next(HttpError(401));
  }

  await User.findByIdAndDelete(id);

  res.json({ message: "Deleted successfully!" });
};

const forgotPassword = async (req, res, next) => {
  const { emailOrUsername } = req.body;

  let isUser;

  try {
    isUser = await User.findOne({ email: emailOrUsername });
  } catch {
    console.log("went wrong");
  }

  if (!isUser) {
    isUser = await User.findOne({ username: emailOrUsername });
  }

  if (!isUser) {
    next(404);
  }

  const renewPasswordToken = uuidv4();

  await User.findOneAndUpdate({ email: isUser.email }, { renewPasswordToken });
  try {
    res.json({
      // link: `${BASE_URL}/api/users/renewpassword/${renewPasswordToken}`,
      link: `${renewPasswordToken}`,
    });
  } catch (error) {
    next(error);
  }
};

const renewPassword = async (req, res, next) => {
  const { renewPasswordToken } = req.params;

  const user = await User.findOne({ renewPasswordToken });

  if (!user) next(HttpError(404, "User not found!"));

  if (user.renewPasswordToken === "")
    next(HttpError(400, "No request for changing"));

  const { newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    next(400, "Passwords do not match!");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.findByIdAndUpdate(user.id, {
    password: hashedPassword,
    renewPasswordToken: "",
  });

  res.json({ message: "password successfully changed" });
};

const getCurrentUser = async (req, res, next) => {
  const { username, email, _id } = req.user;

  if (!username || !email || !_id) next(HttpError(400));
  res.json({ username, email, _id });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  updateUser: ctrlWrapper(updateUser),
  logout: ctrlWrapper(logout),
  deleteAcc: ctrlWrapper(deleteAcc),
  forgotPassword: ctrlWrapper(forgotPassword),
  renewPassword: ctrlWrapper(renewPassword),
  getCurrentUser: ctrlWrapper(getCurrentUser),
};
