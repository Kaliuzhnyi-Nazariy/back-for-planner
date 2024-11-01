const { default: mongoose } = require("mongoose");
const { ctrlWrapper, HttpError } = require("../helpers");
const { Plan } = require("../models/plan");

const getAll = async (req, res, next) => {
  const { id } = req.user;

  const tasks = await Plan.find({ owner: id });

  if (!tasks) next(HttpError(404));

  res.status(200).json(tasks);
};

const getTaskById = async (req, res, next) => {
  const { id: owner } = req.user;
  const { taskId } = req.params;

  const task = await Plan.findOne({ owner, _id: taskId });

  if (!task) next(HttpError(404));

  res.json(task);
};

const getTaskByDate = async (req, res, next) => {
  const { id: owner } = req.user;
  const { date } = req.body;

  const task = await Plan.find({ owner, date });

  if (!task) next(HttpError(404));

  res.json(task);
};

const addTask = async (req, res, next) => {
  const { title, taskText, date, x, y } = req.body;
  const { id } = req.user;

  let task;

  if (!x || !y) {
    task = await Plan.create({ title, taskText, date, owner: id });
  } else {
    task = await Plan.create({
      title,
      taskText,
      date,
      coordinates: { x, y },
      owner: id,
    });
  }

  res.status(201).json(task);
};

const updateTask = async (req, res, next) => {
  const { taskId } = req.params;
  const { id: owner } = req.user;

  if (!mongoose.isValidObjectId(taskId)) {
    next(HttpError(400, "Invalid task ID format"));
  }

  let task;

  if (!req.body.x || !req.body.y) {
    task = await Plan.findOneAndUpdate({ owner, _id: taskId }, req.body, {
      new: true,
    });
  } else {
    task = await Plan.findOneAndUpdate(
      { owner, _id: taskId },
      {
        title: req.body.title,
        taskText: req.body.taskText,
        date: req.body.date,
        coordinates: { x: req.body.x, y: req.body.y },
        owner,
      },
      {
        new: true,
      }
    );
  }

  if (!task) next(HttpError(404));

  res.status(200).json(task);
};

const deleteTask = async (req, res, next) => {
  const { taskId } = req.params;
  const { id: owner } = req.user;

  const deletingTask = await Plan.findOneAndDelete({ _id: taskId, owner });

  if (!deletingTask) next(HttpError(404));

  res.json({ deletingTask });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getTaskById: ctrlWrapper(getTaskById),
  getTaskByDate: ctrlWrapper(getTaskByDate),
  addTask: ctrlWrapper(addTask),
  updateTask: ctrlWrapper(updateTask),
  deleteTask: ctrlWrapper(deleteTask),
};
