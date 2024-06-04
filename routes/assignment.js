const express = require("express");
const router = express.Router();

const {
  getAllAssignment,
  createAssignment,
  deleteAssignment,
  updateAssignment,
} = require("../controller/assignment");

const { requireAuth } = require("../middleware/authMiddleware.js");

router.route("/getAllAssignment").get(getAllAssignment);
router.route("/create").post(requireAuth, createAssignment);
router.route("/delete/:assignmentId").delete(requireAuth, deleteAssignment);
router.route("/update/:assignmentId").put(requireAuth, updateAssignment);

module.exports = router;
