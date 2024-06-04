const express = require("express");
require("express-async-errors");
require("dotenv").config();
const prisma = require("./db/connect");
const cookieParser = require("cookie-parser");
const app = express();

//express body json parsing middleware
app.use(express.json());

//express url parsing middleware
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

const defaultRoles = [
  {
    id: 1,
    name: "TEACHER",
  },
  {
    id: 2,
    name: "STUDENT",
  },
];

async function initializeUserRoles() {
  const rolesCount = await prisma.userRole.count();
  if (rolesCount === 0) {
    for (const role of defaultRoles) {
      await prisma.userRole.create({
        data: {
          name: role.name,
        },
      });
    }
    console.log("Default roles initialized successfully.");
  } else {
    console.log("User roles already exist in the database.");
  }
}

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from the server",
    status: "success",
    currentTime: new Date().toISOString(),
    path: req.path,
    url: req.originalUrl,
  });
});

const usersRouter = require("./routes/users");
app.use("/api/v1/users", usersRouter);

const assignmentsRouter = require("./routes/assignment");
app.use("/api/v1/assignments", assignmentsRouter);

const globalErrorHandler = require("./middleware/globalErrorHandler");

app.use(globalErrorHandler);

app.listen(8080, () => {
  console.log("server is running at 8080");
  initializeUserRoles();
});
