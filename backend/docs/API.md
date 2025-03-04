# 🚀 API Documentation

### 📌 Introduction

Welcome to the **Recipe Book API** documentation. This API allows you to manage users, retrieve data, and perform operations.

- **Authentication:** JWT
- **Formats:** JSON

---

### 🔑 Authentication

Some requests require an JWT token in the cookies.

# 🔐 Authentication Routes

## Register a User (POST)

#### Endpoint: `POST /api/v1/auth/register`

### 📌 Request Body:

```json
{
  "username": "John",
  "password": "Password1",
  "password-confirm": "Password1",
  "email": "john@example.com"
}
```

### 📌 Example Response

```json
{
  "message": "User created",
  "user": {
    "username": "John",
    "role": "user",
    "email": "john@example.com"
  }
}
```

## Login a User (POST)

#### Endpoint: `POST /api/v1/auth/login`

### 📌 Request Body:

```json
{
  "email": "john@example.com",
  "password": "Password1"
}
```

### 📌 Example Response

```json
{
  "message": "You are logged in!"
}
```

## Logout a User (POST)

#### Endpoint: `POST /api/v1/auth/logout`

### 🔑 Authentication Required

This endpoint requires authentication (JWT).

### 📌 Example Response

```json
{
  "message": "You are logout!"
}
```

