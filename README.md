# Employee Directory — Full-Stack Search Application

A single-page Employee Directory application built with React, Vite, Tailwind CSS, Axios, Express.js, and MySQL (`mysql2`), featuring parameterized SQL search across all employee fields, automatic MySQL database creation & data seeding, and in-memory frontend query caching.

## Project Structure

```text
employee-search-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.tsx
│   │   │   └── EmployeeTable.tsx
│   │   ├── services/
│   │   │   └── employeeApi.ts
│   │   ├── types/
│   │   │   └── employee.ts
│   │   ├── utils/
│   │   │   ├── searchCache.ts
│   │   │   └── searchCache.test.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── .env
├── backend/
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .env.example
├── database/
│   └── employee_search_db.sql
├── scripts/
│   └── dev.mjs
├── package.json
└── README.md
```

## Prerequisites

- **Node.js** v18+ and **npm**
- **MySQL** 8.0+

## 1. Environment Configuration

Check `backend/.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=employee_search_db
DB_PORT=3306
PORT=5000
```

## 2. Automatic MySQL Seeding & Starting Application

Run the application with:

```bash
npm run dev
```

When you start the application:
1. The backend connects to MySQL using your credentials (without selecting a DB first).
2. It automatically reads and executes `database/employee_search_db.sql`.
3. It creates the `employee_search_db` database if it does not exist.
4. It creates the `employees` table if it does not exist.
5. It inserts and updates the 24 employee records (`ON DUPLICATE KEY UPDATE`).
6. The Express server starts on port `5000` only after seeding succeeds.
7. Vite starts the frontend on port `3000` and proxies `/api` calls to the backend.

## 3. Run Tests & Production Build

```bash
# Run unit tests (cache normalization + caching behavior)
npm test

# Type-check codebase
npm run lint

# Build production bundle into dist/
npm run build
```

## API Reference

### `GET /api/employees/search?q=<searchQuery>`

Searches employees using parameterized SQL queries across:
- Employee `id` (exact integer match)
- `name` (case-insensitive `LIKE`)
- `email` (case-insensitive `LIKE`)
- `dob` (`YYYY-MM-DD` date match)
- `department` (case-insensitive `LIKE`)
- `position` (case-insensitive `LIKE`)

## Frontend In-Memory Caching

- Searches execute only on **Search** button click or pressing **Enter**.
- Queries are normalized using `query.trim().toLowerCase()` before checking the cache.
- Cache hits display results immediately with a **"Loaded from cache"** indicator and do not call the API again.
- Cache misses fetch from the backend and display **"Fetched from API"**.
- Empty match responses are cached; failed requests are never cached.
