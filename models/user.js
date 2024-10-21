const { Schema, model } = require("mongoose");
const joi = require("joi");
const { handleMongoose } = require("../helpers");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: String,
    token: {
      type: String,
      default: "",
    },
    renewPasswordToken: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

const addUserSchema = joi.object({
  username: joi.string().min(2).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).max(15).required(),
  confirmPassword: joi.string().min(6).max(15).required(),
});

const loginUserSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).max(15).required(),
});

const changePasswordSchema = joi.object({
  newPassword: joi.string().min(6).max(15).required(),
  confirmNewPassword: joi.string().min(6).max(15).required(),
});

const requestForChangingPassword = joi.object({
  emailOrUsername: joi.string().required(),
});

const updateUserSchema = joi.object({
  username: joi.string().min(2).required(),
  email: joi.string().email().required(),
});

const schemas = {
  addUserSchema,
  loginUserSchema,
  requestForChangingPassword,
  changePasswordSchema,
  updateUserSchema,
};

userSchema.post("save", handleMongoose);

const User = model("user", userSchema);

module.exports = { schemas, User };
