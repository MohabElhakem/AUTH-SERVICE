````md
# Authentication System

A secure authentication API built with Node.js, Express, and MongoDB.  
Supports access and refresh tokens, session management, and secure logout mechanisms.

---

## Features

- User registration and login
- JWT-based access and refresh tokens
- Secure session handling
- Token blacklisting on logout
- MongoDB-based session storage
- Logout from a single device or all devices

---

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (JSON Web Tokens)
- bcrypt
- Joi
- crypto
- dotenv

---

## Installation

Clone the repository:
```bash
git clone <repo-url>
````

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```


## Environment Variables

Create a `.env` file in the root directory and add:

```env
PORT=your_port
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
NODE_ENV=development
```

> **Note:**
> Cookies will be marked as `secure` only when `NODE_ENV` is set to `production`.


## API Routes

```
METHOD | ENDPOINT                        | DESCRIPTION                     | REQUIRED INPUTS
------------------------------------------------------------------------------------------------
POST   | /auth/signup                   | Register new user               | username, email, password
POST   | /auth/login                    | Login user                      | email, password
GET    | /auth/internal/logout          | Logout current session          | -
POST   | /auth/internal/logout-all      | Logout all user sessions        | password
GET    | /auth/internal/refresh-token   | Refresh access token            | -
```


## Security Notes

* Refresh token validators are stored **hashed** in the database
* Tokens are sent using **HTTP-only cookies**
* Refresh token rotation is implemented to prevent token reuse
* Sessions are invalidated on logout
* Invalid or reused token validators revoke **all active user sessions**



