# MOCK Assignments API

## Environment Variables

- DATABASE_URL="file:./database.db"
- JWT_SUPER_SECRET="yourSecret"
- NODE_ENV="test"
- loginMock='true' (If loginMock is true, any credentials are accepted for logging)

## Database

- Database used is RDBMS SQLite.
- Database location can be adjusted in the environment.

## Tables Required

### User

| Field              | Type         |
| ------------------ | ------------ |
| id                 | int          |
| username           | String       |
| password           | String       |
| createdAssignments | Assignment[] |
| assignments        | Assignment[] |
| UserRole           | UserRole     |
| userRoleId         | int          |

### Assignment

| Field            | Type     |
| ---------------- | -------- |
| id               | int      |
| assignmentName   | String   |
| createdBy        | int      |
| completionStatus | Boolean  |
| startDate        | DateTime |
| endDate          | DateTime |
| creator          | User     |
| students         | User[]   |

### UserRole

| Field | Type   |
| ----- | ------ |
| id    | int    |
| name  | String |
| users | User[] |
