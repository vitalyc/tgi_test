# TGI Test — Backend Job Runner

A Node.js backend service built for Windows that launches, monitors, and analyzes concurrent native jobs (e.g., C++ batch scripts). It exposes REST APIs to control job execution, track status, and produce statistical insights into job behavior.

---

## 🗂️ Note on Project Structure

> In real-world applications, it's a best practice to organize code into folders like:
```text
src/
├── controllers/
├── services/
├── models/
├── routes/
├── utils/
├── middleware/
└── index.ts
```

Even in small projects, this structure supports long-term maintainability and scalability.

However, since this is a **test project**, all files are placed in a single folder. This makes it easier to quickly review everything without navigating through many subdirectories with only one file each.  
**So don't be surprised — the flat layout here is intentional.**

---

## 🚀 Features

- Launch and monitor external jobs (batch scripts)
- Concurrent job execution with retry on failure
- In-memory job tracking (status, retries, exit codes)
- REST API to control and inspect jobs
- Job statistics and insights based on job characteristics

---

## 📦 Installation

```bash
git clone https://github.com/vitalyc/tgi_test.git
cd tgi_test
npm install
```

---

---
## 🛠️ How to Build Before Run
This project is written in TypeScript. To build the project before running it:
```bash
npm run build
```
This command compiles the TypeScript code to JavaScript in the `dist/` directory.
Make sure you have a `tsconfig.json` and a `build` script defined in your `package.json`.
You can then run the server using:
```bash
node dist/index.js
```
## 🖥️ Run the Server

```bash
npm start
```

> Server runs on http://localhost:3000 by default.


---

## 🔧 API Endpoints
The server provides a Swagger UI for API documentation at: [http://localhost:3000/api-docs](http://localhost:3000/api-docs) (only available in development environment).

---

## 🛠 Implementation Details

- Uses a `dummy-job.bat` script to simulate job success/failure (random exit code 0 or n).
- Each job is monitored asynchronously.
- Failed jobs are retried once (if `0 <= retryCountMax <= 10`) before being marked as permanently failed. (default is `0` means - no retry).
- `timeoutMs` sets the task timeout in milliseconds. A value of `0` means no timeout (default is `0`).
- Job status is tracked in-memory with a simple object structure.
- No external database — all state is managed in-memory.
- REST server built with **Express.js** and **TypeScript**.

---

## ✅ Future Improvements
> These features are not required for the test project, but could be valuable future enhancements:
- Persist job history to disk or database
- Add job cancellation support
- Add UI for job monitoring
- Support more job analysis metrics

