# BlogAppBackend

A robust RESTful backend built with **Node.js** and **Express.js** for a feature-rich blogging platform. This backend supports user authentication, blog posts with thumbnails, comment systems, likes, tagging, and JWT-secured APIs. The backend uses **MySQL** for data persistence and follows a modular and scalable architecture.

---

## 🚀 Features

- ✅ User Registration & JWT Authentication
- 📝 CRUD for Blog Posts with thumbnail upload (via Multer)
- 💬 Add, Edit, Delete, and Retrieve Comments
- ❤️ Like/Unlike Blog Posts & get Like counts
- 🏷️ Dynamic Tag Management and Filtering
- 🔐 Middleware-based Route Protection & Logging
- 📁 File Upload Handling (Multer)
- 🔧 Scalable Service & Controller Architecture
- 📬 Sample Postman Collection included for testing

---

## 📁 Project Structure

BLOGAPPBACKEND/
│
├── .vscode/
│   └── launch.json              # VSCode debug configuration
│
├── node_modules/                # Dependencies
│
├── src/
│   ├── config/
│   │   └── db.config.js         # Database pool configuration (MySQL)
│   │
│   ├── controllers/             # All route business logic
│   │   ├── auth.controller.js
│   │   ├── blogPost.controller.js
│   │   ├── comment.controller.js
│   │   ├── postLikes.controller.js
│   │   ├── postTags.controller.js
│   │   └── tags.controller.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT auth and RBAC
│   │   ├── logs.middleware.js   # Request logging
│   │   └── multer.middleware.js # File upload config for thumbnails
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── blogPost.routes.js
│   │   ├── comments.routes.js
│   │   ├── postLikes.routes.js
│   │   ├── postTags.routes.js
│   │   └── tags.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── blogPost.service.js
│   │   ├── comments.service.js
│   │   ├── postLikes.service.js
│   │   ├── postTags.service.js
│   │   └── tags.service.js
│   │
│   ├── uploads/                 # For uploaded thumbnails
│   └── utils/
│       └── db.js                # DB query utility using config
│
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── Blog App.postman_collection  # Sample API collection for Postman
├── package.json                 # Node.js dependencies
├── package-lock.json
└── server.js                    # App entry point

---

## 🔧 Tech Stack

- **Node.js**, **Express.js**
- **MySQL** (via `mysql2`)
- **JWT** (authentication)
- **Multer** (file upload)
- **bcrypt** (password hashing)
- **slugify** (SEO-friendly URLs)

---

## ✅ Getting Started

### 1. Prerequisites

- Node.js v14+
- MySQL installed
  
### 2. Clone the Repository

```bash
git clone https://github.com/amitdudhankar/BlogAppBackend.git
cd BlogAppBackend
```
### 3. Install Dependencies

```bash
npm install
```
### 4. Configure Environment Variables

Create a `.env` file in the root:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=blogapp
SECRET_JWT_KEY=your_jwt_secret
JWT_EXPIRES_IN=7d
```

### 5. Setup the Database

Ensure you have tables:

* `users`, `posts`, `comments`, `post_likes`, `post_tags`, `tags`

Match schema based on the service files in `/src/services`.

### 6. Start the Server

```bash
npm start
```

> For auto-reloading (development):
>
> ```bash
> npm install -g nodemon
> npm run dev
> ```

---

## 📡 API Endpoints

### Auth Routes

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| POST   | `/api/auth/signup` | Register a new user   |
| POST   | `/api/auth/login`  | Login and receive JWT |

### Blog Post Routes

| Method | Endpoint                        | Description                           |
| ------ | ------------------------------- | ------------------------------------- |
| POST   | `/api/blog/add-blog`            | Create a blog post (with `thumbnail`) |
| PUT    | `/api/blog/update-blog/:blogid` | Update a post                         |
| GET    | `/api/blog/get-all-blogs`       | Get all blog posts                    |
| DELETE | `/api/blog/delete-blog/:blogid` | Delete a post                         |

### Comment Routes

| Method | Endpoint                            | Description             |
| ------ | ----------------------------------- | ----------------------- |
| POST   | `/api/comment/add-comment`          | Add a comment           |
| PUT    | `/api/comment/update-comment/:id`   | Edit your comment       |
| GET    | `/api/comment/get-comments/:postId` | Get comments for a post |
| DELETE | `/api/comment/delete-comment/:id`   | Delete your comment     |

### Like Routes

| Method | Endpoint                          | Description              |
| ------ | --------------------------------- | ------------------------ |
| POST   | `/api/postLikes/like`             | Like a post              |
| DELETE | `/api/postLikes/unlike/:postId`   | Unlike a post            |
| GET    | `/api/postLikes/count/:postId`    | Count likes              |
| GET    | `/api/postLikes/is-liked/:postId` | Check if you liked it    |
| GET    | `/api/postLikes/users/:postId`    | Users who liked the post |

### Tag Routes

| Method | Endpoint                     | Description   |
| ------ | ---------------------------- | ------------- |
| POST   | `/api/tag/create-tag`        | Create a tag  |
| PUT    | `/api/tag/update-tag/:tagId` | Update a tag  |
| DELETE | `/api/tag/delete-tag/:tagId` | Delete a tag  |
| GET    | `/api/tag/get-tags/:tagId`   | Get tag by ID |
| GET    | `/api/tag/get-all-tags`      | List all tags |

### Tag Assignment to Posts

| Method | Endpoint                                       | Description       |
| ------ | ---------------------------------------------- | ----------------- |
| POST   | `/api/postTags/add-post-tag`                   | Add tag to a post |
| DELETE | `/api/postTags/remove-post-tag/:postId/:tagId` | Remove tag        |
| GET    | `/api/postTags/get-all-tags-for-post/:postId`  | Tags for post     |
| GET    | `/api/postTags/get-posts-by-tag/:tagId`        | Posts by tag      |

---
## 🧪 Testing the API

Use Postman and import the included file:

📂 `Blog App.postman_collection`

---
## 🔒 Security

* JWT for user sessions
* Passwords hashed using **bcrypt**
* Role-based access and middleware protection

---
## 📂 File Upload

* Uploads go to `/src/uploads/`
* Use `thumbnail` as the key in form-data
* Multer handles size/type checks

---

## 📜 Logging

* Implemented via `logs.middleware.js`
* Tracks request method, path, status, and timestamp

---
## 🤝 Contributing

Pull requests welcome! For major changes, open an issue to discuss before committing.

---

## 📄 License

MIT (or your license of choice)

---

## 👤 Author

**Amit Dudhankar**
