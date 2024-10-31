const express = require("express");
const authanticate = require("../../middlewares/authenticate");
const { validateBody } = require("../../middlewares");
const { schemas } = require("../../models/plan");
const ctrl = require("../../controllers/plans");

const router = express.Router();

router.get("/", authanticate, ctrl.getAll);

router.get(
  "/byDate",
  authanticate,
  validateBody(schemas.fetchPlanByDate),
  ctrl.getTaskByDate
);

router.get("/:taskId", authanticate, ctrl.getTaskById);

router.post("/", authanticate, validateBody(schemas.addPlan), ctrl.addTask);

router.put(
  "/:taskId",
  authanticate,
  validateBody(schemas.updatePlan),
  ctrl.updateTask
);

router.delete("/:taskId", authanticate, ctrl.deleteTask);

module.exports = router;
