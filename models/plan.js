const { Schema, model } = require("mongoose");
const joi = require("joi");
const { handleMongoose } = require("../helpers");

const planSchema = new Schema(
  {
    title: {
      type: String,
      default: "",
    },
    taskText: {
      type: String,
      default: "",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    date: {
      type: String,
      default: Date.now(),
    },
    coordinates: {
      x: Number,
      y: Number,
    },
  },
  { versionKey: false, timestamps: true }
);

planSchema.post("save", handleMongoose);

const Plan = model("plan", planSchema);

const addPlan = joi.object({
  title: joi.string().max(64).required(),
  taskText: joi.string().max(256).required(),
  date: joi.string(),
  x: joi.number(),
  y: joi.number(),
});

const updatePlan = joi.object({
  title: joi.string().max(64).required(),
  taskText: joi.string().max(256).required(),
  date: joi.string(),
  x: joi.number(),
  y: joi.number(),
});

const fetchPlanByDate = joi.object({
  date: joi.string().required(),
});

const schemas = {
  addPlan,
  updatePlan,
  fetchPlanByDate,
};

module.exports = { Plan, schemas };
