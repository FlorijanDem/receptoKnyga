# 📦 Recipe book

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

A RESTful API for managing recipes and make individual meal plan.

---

## 🚀 Features

✅ User authentication (JWT-based)  
✅ CRUD operations for recipes  
✅ Meal plan creation & management  
✅ Search & filter recipes  
✅ Secure & scalable API

---

## 🛠 Built With

- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Postgre sql** - Database
- **Postgres.js** - ODM for Postgre sql
- **JWT** - Authentication
- **argon2** - Password hashing

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the repository

```sh
git clone https://github.com/FlorijanDem/receptoKnyga
cd backend
```

### 2️⃣ Install dependences

```sh
npm i
```

### 3️⃣ Create `.env` file

```sh
# client url
FRONTEND_URL =

# app port
PORT =

# database config
DB_HOST =
DB_PORT =
DB_NAME =
DB_USER =
DB_PASS =
DB_SSL =

# jwt config
JWT_SECRET =
JWT_EXPIRES_IN = 90d
JWT_COOKIE_EXPIRES_IN = 90

# Every backend starts checking the env file
# DISABLE_CHECKING = true
```

### 4️⃣ Run

```sh
node server.js
```

## 📡 API Routes

### 🔐 Authentication

| Method | Endpoint                | Description         | Auth Required |
| ------ | ----------------------- | ------------------- | ------------- |
| POST   | `/api/v1/auth/register` | Register a new user | ❌ No         |
| POST   | `/api/v1/auth/login`    | User login          | ❌ No         |
| POST   | `/api/v1/auth/logout`   | Logout user         | ✅ Yes        |

### 🍽️ Recipes

| Method | Endpoint                    | Description               | Auth Required |
| ------ | --------------------------- | ------------------------- | ------------- |
| GET    | `/api/v1/recipes`           | Get all recipes           | ❌ No         |
| GET    | `/api/v1/recipes/?q=`       | Search recipes            | ❌ No         |
| GET    | `/api/v1/recipes/?type=`    | Filter recipes            | ❌ No         |
| GET    | `/api/v1/recipes/?product=` | Filter recipes by product | ❌ No         |
| GET    | `/api/v1/recipes/:id`       | Get a specific recipe     | ✅ Yes        |
| POST   | `/api/v1/recipes`           | Create a new recipe       | ✅ Yes        |
| PUT    | `/api/v1/recipes/:id`       | Update a recipe           | ✅ Yes        |
| DELETE | `/api/v1/recipes/:id`       | Delete a recipe           | ✅ Yes        |

### ✏️ Characteristics

| Method | Endpoint                  | Description               | Auth Required |
| ------ | ------------------------- | ------------------------- | ------------- |
| GET    | `/api/v1/characteristics` | Get user characteristics  | ✅ Yes        |
| PATCH  | `/api/v1/characteristics` | Edit user characteristics | ✅ Yes        |
