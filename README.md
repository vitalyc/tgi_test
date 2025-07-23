# TGI Test — Backend Job Runner

A Node.js backend service built for Windows that launches, monitors, and analyzes concurrent native jobs (e.g., C++ batch scripts). It exposes REST APIs to control job execution, track status, and produce statistical insights into job behavior.

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
