# 🚀 API Documentation

### 📌 Introduction

Welcome to the **Recipe Book API** documentation. This API allows you to manage users, retrieve data, and perform operations.

- **Authentication:** JWT
- **Formats:** JSON

---
### 🔑 Authentication

Some requests require an JWT token in the cookies.
### 🔗 Links
- [Authentication Routes](#-authentication-routes)
- [Recipes Routes](#-recipes-routes)

# 🔐 Authentication Routes

...
[Back to API Documentation](#-api-documentation)

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

### 📌 Example Response:

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

### 📌 Example Response:

```json
{
  "message": "You are logged in!"
}
```

## Logout a User (POST)

#### Endpoint: `POST /api/v1/auth/logout`

### 🔑 Authentication Required

### 📌 Example Response:

```json
{
  "message": "You are logout!"
}
```

# 🍲 Recipes Routes

...
[Back to API Documentation](#-api-documentation)

## Get a Recipes (GET)

#### Endpoint: `GET /api/v1/recipes`

### 📌 Example Response:

```json
{
  "status": "success",
  "results": "1",
  "data": [
    {
      "id": 17,
      "title": "test1",
      "description": "",
      "method": "test1",
      "type": "veg",
      "photo": "test1",
      "preparation_time": 5,
      "servings": 5,
      "user_id": 6
    },
    {
      "id": 22,
      "title": "pizza1",
      "description": "cook pica",
      "method": "pizza",
      "type": "non-veg",
      "photo": "pizza",
      "preparation_time": 5,
      "servings": 5,
      "user_id": 4
    }
  ]
}
```

## Get one Recipe (GET)

#### Endpoint: `GET /api/v1/recipes/:id`

### 🔑 Authentication Required

### 📌 Example Response:

```json
{
  "status": "success",
  "data": {
    "id": 17,
    "title": "test1",
    "description": "",
    "method": "test1",
    "type": "veg",
    "photo": "test1",
    "preparation_time": 5,
    "servings": 5,
    "user_id": 6,
    "products": []
  }
}
```

## Add Recipe (POST)

#### Endpoint: `POST /api/v1/recipes`

### 🔑 Authentication Required

### 📌 Request Body:

```json
{
  "title": "Spaghetti Bolognes",
  "photo": "url-to-photo",
  "method": "Boil pasta and prepare sauce...",
  "type": "non-veg",
  "preparation_time": "30",
  "servings": 4,
  "description": "A classic Italian pasta dish.",
  "products": [
    { "title": "Spaghetti", "amount": "200", "units_of_meassurement": "g" },
    { "title": "Tomato Sauce", "amount": "150", "units_of_meassurement": "g" }
  ]
}
```

### 📌 Example Response:

```json
{
  "status": "success",
  "data": {
    "id": 3,
    "title": "Spaghetti Bolognes",
    "description": "A classic Italian pasta dish.",
    "method": "Boil pasta and prepare sauce...",
    "type": "non-veg",
    "photo": "url-to-photo",
    "preparation_time": 30,
    "servings": 4,
    "user_id": 1
  }
}
```

## Edit Recipe (PATCH)

#### Endpoint: `PATCH /api/v1/recipes/:id`

### 🔑 Authentication Required

### 📌 Request Body:

```json
{
  "title": "Spaghetti Bolognes",
  "photo": "url-to-photo",
  "method": "Boil pasta and prepare sauce...",
  "type": "non-veg",
  "preparation_time": "30",
  "servings": 4,
  "description": "A classic Italian pasta dish.",
  "products": [
    { "title": "Spaghetti", "amount": "200", "units_of_meassurement": "g" },
    { "title": "Tomato Sauce", "amount": "150", "units_of_meassurement": "g" }
  ]
}
```

### 📌 Example Response:

```json
{
  "status": "success",
  "data": {
    "id": 3,
    "title": "Spaghetti Bolognes",
    "description": "A classic Italian pasta dish.",
    "method": "Boil pasta and prepare sauce...",
    "type": "non-veg",
    "photo": "url-to-photo",
    "preparation_time": 30,
    "servings": 4,
    "user_id": 1
  }
}
```

## Delete one Recipe (DELETE)

#### Endpoint: `DELETE /api/v1/recipes/:id`

### 🔑 Authentication Required

### 📌 Example Response:

(I think in the future can be change to 204 status code)

```json
{
  "status": "success",
  "data": [
    {
      "id": 3,
      "title": "Spaghetti Bolognes",
      "description": "A classic Italian pasta dish.",
      "method": "Boil pasta and prepare sauce...",
      "type": "non-veg",
      "photo": "url-to-photo",
      "preparation_time": 30,
      "servings": 4,
      "user_id": 1
    }
  ]
}
```
