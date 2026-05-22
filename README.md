# 🚀 Email Deliverability & Verification Tool

A full-stack Email Deliverability & Verification platform built using **Rust (Axum)** for the backend and **React + Vite** for the frontend.

The application allows users to upload CSV files containing email addresses and performs multiple verification checks including:

* ✅ Email syntax validation
* ✅ MX record verification
* ✅ Disposable email detection
* ✅ Role-based email detection
* ✅ Bulk CSV processing
* ✅ Clean-list CSV export/download

---

# 🌐 Live Demo

Frontend (Netlify):
https://mellifluous-raindrop-a19bff.netlify.app

Backend API (Render):
https://email-verifier-rust.onrender.com

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* JavaScript
* CSS

## Backend

* Rust
* Axum
* Tokio
* CSV Parser
* Regex
* Trust-DNS Resolver

## Deployment

* Netlify (Frontend)
* Render (Backend)
* Docker

---

# 📂 Features

* Upload CSV files with email lists
* Verify thousands of emails
* Detect invalid/disposable emails
* Detect role-based emails
* Export clean email lists
* Responsive UI dashboard
* Production deployment support

---

# ⚡ Local Setup

## Clone Repository

```bash
git clone https://github.com/suryateja-builds/email-verifier-rust.git
cd email-verifier-rust
```

---

# ▶️ Backend Setup

```bash
cd backend
cargo run
```

Backend runs on:

```txt
http://localhost:8081
```

---

# ▶️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# 📤 API Endpoint

```txt
POST /verify
```

Uploads CSV file and returns verification results.

---

# 📸 Screenshots

<img width="905" height="598" alt="image" src="https://github.com/user-attachments/assets/c460353b-df97-4431-9c8b-c7f2194972e5" />


---

# 🚀 Future Improvements

* SMTP inbox verification
* Catch-all detection
* Background queue processing
* Batch processing optimization
* Progress tracking
* Database integration
* Authentication system

---

# 👨‍💻 Author

Suryateja Malluru

Built as a real-world full-stack systems engineering project using Rust and React.
