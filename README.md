# Calibrium
**Calibrium** is a production-ready full-stack web application, featuring a React frontend and a Node.js/Express backend with a PostgreSQL database. The project uses a modern tech stack (React, React Router, Tailwind CSS, Vite, Node.js, and PostgreSQL) to ensure a scalable and maintainable application structure. This README provides an overview of the system architecture and the technologies used in the project.

## System Architecture

The application is designed with a decoupled **client–server architecture**. The frontend is a React single-page application (SPA) that communicates with the backend via RESTful API calls. The backend, built with Node.js and Express, exposes JSON endpoints and interacts with a PostgreSQL relational database for all persistent data. This separation of concerns makes the app easier to develop, scale, and maintain. The diagram below illustrates the high-level architecture:

&#x20;*System Architecture: The React frontend (built with Vite) interacts with the Node.js/Express backend via REST API calls, and the backend communicates with the PostgreSQL database.*

![image](https://github.com/user-attachments/assets/c15f8338-9bf0-4204-93a4-693d100e3457)

## Tech Stack

The project is built with the following technologies:

| **Category** | **Technologies**                           |
| ------------ | ------------------------------------------ |
| **Frontend** | React 18, React Router, Tailwind CSS, Vite |
| **Backend**  | Node.js 18, Express 4 (REST API framework) |
| **Database** | PostgreSQL 15 (relational database)        |

## Frontend (React Application)

The frontend is a **React** application bootstrapped with Vite. It is structured as a single-page application, meaning the entire UI is loaded once and dynamic content is rendered on the client side. Key aspects of the frontend stack include:

* **React** – A component-based JavaScript library for building user interfaces. React enables the creation of reusable UI components and handles the view layer of the app. It uses a virtual DOM for efficient updates and manages state using hooks (e.g. `useState`, `useReducer`) and context API for global state, eliminating the need for an external state management library. In short, *React is a JavaScript library for building user interfaces* with a declarative and component-driven architecture.

* **React Router** – The project uses React Router (via `react-router-dom`) for client-side routing. This allows navigation between different views or pages of the app without a full page reload. React Router enables a seamless user experience by updating the browser URL and rendering components dynamically in place, **preventing any page refresh**.

* **Tailwind CSS** – A utility-first CSS framework used for styling the frontend. Tailwind provides a large set of pre-defined CSS utility classes (for example, classes for layout, spacing, colors, typography, etc.) that allow developers to style components directly in JSX without writing custom CSS. This leads to rapid UI development and a consistent design system. *Tailwind CSS is a utility-first CSS framework that simplifies web development by providing a set of pre-designed utility classes*. Using Tailwind ensures the app's styles are **responsive** and easily maintainable, and it avoids the need to write a lot of custom CSS or use traditional CSS frameworks.

* **Vite** – A modern frontend build tool and development server. Vite is used to scaffold and bundle the React application. In development, it provides a lightning-fast dev server with instant hot module replacement, so changes appear immediately as you edit code. For production, Vite bundles and optimizes the assets (using Rollup under the hood) for efficient delivery.

## Backend (Node.js API Server)

The backend is implemented in **Node.js** using the **Express** framework to create a RESTful API. It is responsible for handling client requests, executing server-side logic, and interacting with the database. Key points about the backend:

* **Node.js & Express** – The server runs on Node.js, leveraging Express 4.x as a minimalist web framework for routing and middleware. The server exposes a set of **REST API endpoints** (e.g., JSON APIs) that the React frontend consumes. Express is used to define routes for different resources and HTTP methods (GET, POST, PUT, DELETE), and to implement middleware for tasks like authentication, logging, and error handling. This setup follows industry-standard practices for building scalable REST APIs with Node.js.

* **Server-Side Architecture** – The project structure separates concerns such as routing, business logic, and data access. For example, routes definitions are kept separate from controllers (the functions handling requests), and database access is abstracted into models or services. This modular organization makes the backend codebase maintainable and **production-ready**, so new features or changes can be added without breaking the overall structure. The API can be easily extended or refactored thanks to this clean separation.

## Database (PostgreSQL)

The application uses **PostgreSQL** as the sole database for all data persistence. PostgreSQL is a powerful open-source relational database known for its reliability and robustness. Details about the database usage in this project:

* **Migrations and Seeds** – The project includes database migration files and seed data scripts to set up the PostgreSQL schema and initial data. This helps in reproducible setups for different environments (development, testing, production). The use of migrations means that the database structure (tables, columns, relations) is version-controlled and can be evolved over time in a controlled manner, which is crucial for a production-ready system.
