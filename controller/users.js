const prisma = require("../db/connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const testUsersRoute = (req, res) => {
  res.json({
    message: "Route is functional",
    status: "Success",
    path: req.path,
    url: req.originalUrl,
  });
};

const allusers = async (req, res) => {
  const users = await prisma.user.findMany({});
  const userRoles = await prisma.userRole.findMany({});
  res.json({
    status: "Success",
    userRoles,
    users,
  });
};

const createAccount = async (userName, password, role) => {
  const salt = await bcrypt.genSalt();
  const encryptedPassword = await bcrypt.hash(password, salt);
  const account = await prisma.user.create({
    data: {
      username: userName,
      password: encryptedPassword,
      userRoleId: role,
    },
  });
  return account;
};
const secrete = process.env.JWT_SUPER_SEACRETE || "superGupthKey";

const createToken = (jwtContent) => {
  return jwt.sign(jwtContent, secrete);
};

const verifyPassword = async (textPassword, encryptedPassword) => {
  const auth = await bcrypt.compare(textPassword, encryptedPassword);
  return auth;
};

const signUp = async (req, res) => {
  const { username, password, userRoleId = null } = req.body;
  const userRoles = await prisma.userRole.findMany({});
  const defaultRole = userRoles.find((role) => role.name === "TEACHER");
  const defaultRoleId = defaultRole ? defaultRole.id : null;
  const defaultRoleName = defaultRole ? defaultRole.name : null;
  const roleId = userRoleId || defaultRoleId;
  const { name } = userRoles.find((role) => role.id === roleId);
  const roleName = name || defaultRoleName;
  const account = await createAccount(username, password, roleId);
  const token = createToken({
    id: account.id,
    username: account.username,
    userRoleId: roleId,
  });
  account.roll = roleName;
  res.cookie("access_token", `${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(201).json({
    message: "account created!",
    status: "Success",
    account,
    token,
  });
};

const login = async (req, res) => {
  const isMock = process.env.loginMock === "true";
  const { username, password, userRoleId = null } = req.body;
  // console.log(req.body);
  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!existingUser) {
    if (isMock) {
      const userRoles = await prisma.userRole.findMany({});
      const defaultRole = userRoles.find((role) => role.name === "TEACHER");
      const defaultRoleId = defaultRole ? defaultRole.id : null;
      const defaultRoleName = defaultRole ? defaultRole.name : null;
      const roleId = userRoleId || defaultRoleId;
      const { name } = userRoles.find((role) => role.id === roleId);
      const roleName = name || defaultRoleName;
      const account = await createAccount(username, password, roleId);
      const token = createToken({
        id: account.id,
        username: account.username,
        userRoleId: roleId,
      });
      account.roll = roleName;
      res.cookie("access_token", `${token}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.status(201).json({
        message: "account created!",
        status: "Success",
        account,
        token,
      });
    }
    return res.status(404).json({
      message: "Either username/password is incorrect",
      status: "Error",
    });
  }
  const auth = await verifyPassword(password, existingUser.password);
  if (!auth) {
    return res.status(401).json({
      message: "Either username/password is incorrect",
      status: "Error",
    });
  }
  const token = createToken({
    id: existingUser.id,
    username: existingUser.username,
    userRoleId: existingUser.userRoleId,
  });
  res.cookie("access_token", `${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.json({
    message: "Account Logged In!",
    existingUser,
    token,
  });
};

module.exports = { testUsersRoute, allusers, signUp, login };
