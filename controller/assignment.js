const prisma = require("../db/connect");

const getAllAssignment = async (req, res) => {
  const allAssignments = await prisma.assignment.findMany({});
  const assignmentsCount = allAssignments.length;
  res.json({
    message: "All assignments here",
    status: "Success",
    assignmentsCount,
    allAssignments,
  });
};

const createAssignment = async (req, res) => {
  const { tokenData } = res.locals;
  const { id, userRoleId } = tokenData;
  const {
    assignmentName,
    completionStatus,
    startDate,
    endDate = null,
  } = req.body;
  if (endDate) {
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        message: "End date must be after start date",
        status: "Error",
      });
    }
  }
  const userRoles = await prisma.userRole.findMany({});
  const teacherRoll = userRoles.find((role) => role.name === "TEACHER");
  const defaultRoleId = teacherRoll ? teacherRoll.id : null;
  if (userRoleId != defaultRoleId) {
    return res
      .status(403)

      .json({
        message: "Only teachers can create assignments",
        status: "Error",
      });
  }
  const defaultEndDate = new Date(startDate);
  defaultEndDate.setDate(defaultEndDate.getDate() + 7);
  const assignmentData = {
    assignmentName,
    createdBy: id,
    completionStatus,
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : defaultEndDate,
  };
  const insertedData = await prisma.assignment.create({
    data: assignmentData,
  });
  res.status(201).json({
    message: "Assignment created",
    status: "Success",
    insertedData,
  });
};

const deleteAssignment = async (req, res) => {
  const { tokenData } = res.locals;
  const { id: userId } = tokenData;
  const { assignmentId } = req.params;

  const assignment = await prisma.assignment.findUnique({
    where: {
      id: parseInt(assignmentId),
    },
  });

  if (!assignment) {
    return res.status(404).json({
      message: "Assignment not found",
      status: "Error",
    });
  }

  if (assignment.createdBy !== userId) {
    return res.status(403).json({
      message: "Only the creator can delete this assignment",
      status: "Error",
    });
  }

  await prisma.assignment.delete({
    where: {
      id: parseInt(assignmentId),
    },
  });

  res.json({
    message: "Assignment deleted successfully",
    status: "Success",
  });
};

const updateAssignment = async (req, res) => {
  const { tokenData } = res.locals;
  const { id: userId } = tokenData;
  const { assignmentId } = req.params;
  const { assignmentName, completionStatus, startDate, endDate } = req.body;

  const assignment = await prisma.assignment.findUnique({
    where: {
      id: parseInt(assignmentId),
    },
  });

  if (!assignment) {
    return res.status(404).json({
      message: "Assignment not found",
      status: "Error",
    });
  }

  if (assignment.createdBy !== userId) {
    return res.status(403).json({
      message: "Only the creator can update this assignment",
      status: "Error",
    });
  }

  const updatedAssignment = await prisma.assignment.update({
    where: {
      id: parseInt(assignmentId),
    },
    data: {
      assignmentName,
      completionStatus,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  res.json({
    message: "Assignment updated successfully",
    status: "Success",
    updatedAssignment,
  });
};

module.exports = {
  getAllAssignment,
  createAssignment,
  deleteAssignment,
  updateAssignment,
};
