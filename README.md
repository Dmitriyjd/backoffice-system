# 💼 Backoffice System

A full-stack backoffice management system for user and transaction administration, built with **Node.js**, **MongoDB**, and **React + TypeScript**.

## ✨ Features

- 🔐 **Authentication & Authorization**
    - JWT-based login/signup
    - Role-based access control (`admin`, `user`)
    - Dynamic permissions per role

- 👤 **User Management (Admin-only)**
    - List, create, edit, and delete users
    - Assign roles dynamically

- 💸 **Transaction Management**
    - List all transactions (paginated + filtered)
    - View full details (type, sub-type, amount, status, description)
    - Filter by type, sub-type, status, amount, search

- 📊 **Dashboard with Charts**
    - Total revenue grouped by sub-type
    - Breakdown for current **week** and **month**
    - Powered by `Chart.js`

---

## ⚙️ Technologies

### Backend:
- Node.js + Express
- MongoDB (via Mongoose)
- JWT + bcrypt for authentication
- Role/Permission-based middleware
- TypeScript

### Frontend:
- Vite
- React + TypeScript
- MUI (Material UI)
- Axios
- React Router

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/backoffice-system.git
cd backoffice-system
