# Keep It - Note Taking App

![image](https://github.com/user-attachments/assets/40a8b97a-92fa-4139-a415-8d27ed13c291)

Keep It is a minimalist note-taking application built with React and Node.js, backed by a PostgreSQL database. It offers a clean Material Design interface, fast performance, and persistent data storage.

---

## Features

- Create, edit, and delete notes
- Material Design UI with smooth animations
- Data persistence using PostgreSQL
- RESTful API with Express
- Responsive layout for all devices
- Form validation to prevent empty notes

---

## Tech Stack

### Frontend
- React 18
- Material-UI (MUI)
- Vite
- CSS

### Backend
- Node.js
- Express
- PostgreSQL
- `pg` (PostgreSQL client for Node.js)

---

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- Git
- pgAdmin for managing your database visually (Optional but recommended) 
---

### Clone the Repository
```
git clone https://github.com/RiGa7/keep-it-db/
cd keep-it
```
### Backend Setup
```
cd server 
npm install
cp .env.example .env
```
- ### Edit the .env file with your PostgreSQL credentials:
```
DB_USER=your_db_username
DB_HOST=localhost
DB_NAME=keepit
DB_PASSWORD=your_db_password
DB_PORT=5432
PORT=5000
```

### Frontend Setup
```
cd ../client
npm install
```
### Database Setup

Option 1. Using PostgreSQL CLI
```
CREATE DATABASE keepit;
\c keepit

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Option 2. Using pgAdmin
- Open pgAdmin and connect to your PostgreSQL server.
- Right-click on Databases > Create > Database
- Database Name: keepit
- Expand your new database → Right-click Schemas > public > Tables → Create > Table
- Set Table Name: notes
- In the Columns tab, add the following:
  
| Name	| Data Type	| Constraints |
| ------ | ----------- | ------------|
| id	| SERIAL |	Primary key |
| title |	VARCHAR(255)	|
| content |	TEXT |	Not null |
| created_at |	TIMESTAMP |	Default: CURRENT_TIMESTAMP |

- Click Save

### Run the Application
- Start the backend server:
```
cd server
npm start
```
- Start the frontend development server:
```
npm run dev
```

- Visit the app in your browser at: http://localhost:5173

### Project Structure
```
keep-it/
├── public/
│   └── styles.css
│
├── server/                       # Backend - Express + PostgreSQL
│   ├── node_modules/
│   ├── .env                      # Environment variables
│   ├── index.js                  # Express entry point
│   ├── package.json
│   └── package-lock.json
│
├── src/                          # Frontend - React
│   ├── components/               # React components
│   │   ├── App.jsx
│   │   ├── CreateArea.jsx
│   │   ├── Header.jsx
│   │   └── Note.jsx
│   ├── index.jsx                 # Main React entry point
│
├── .eslintrc.cjs                 # ESLint config
├── .gitignore
├── index.html                    # HTML entry for Vite
├── package.json
├── package-lock.json
├── vite.config.js                # Vite config
└── README.md

```