# MOCK Assignments API

run using

```
npm run dev
```

or deploy via docker

```
docker pull yesrab/mockassignment:0.0.1.RELEASE
```

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

### Users

- **Test Users API**
  - **GET** `{{URL}}/api/v1/users/test`
- **Get List of All Users**
  - **GET** `{{URL}}/api/v1/users/allusers`
- **Signup**

  - **POST** `{{URL}}/api/v1/users/signup`
  - **Body**:
  - json
    {
    "username": "yesrab",
    "password": "password"
    }

- **Login**

  - **POST** `{{URL}}/api/v1/users/login`
  - **Body**:
  - json
    {
    "username": "username",
    "password": "password"
    }

    ### Assignments

- **Get All Assignments**
  - **GET** `{{URL}}/api/v1/assignments/getAllAssignment`
- **Create Assignment**

  - **POST** `{{URL}}/api/v1/assignments/create`
  - **Body**:
  - json
    {
    "assignmentName": "test assignment",
    "completionStatus": false,
    "startDate": "2024-05-26T11:17:21.055Z",
    "endDate": "2025-01-01T00:00:00.000Z"
    }

- **Delete Assignment**
  - **DELETE** `{{URL}}/api/v1/assignments/delete/3`
- **Update Assignment**
  - **PUT** `{{URL}}/api/v1/assignments/update/3`
  - json
    {
    "assignmentName": "test assignment",
    "completionStatus": false,
    "startDate": "2024-05-26T11:17:21.055Z",
    "endDate": "2025-01-01T00:00:00.000Z"
    }
