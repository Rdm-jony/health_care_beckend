# 🏥 Health Care API

The **Health Care API** provides endpoints for managing **users, doctors, appointments, authentication, chat, and more**.  
It is designed for healthcare applications where patients can book appointments, doctors can manage their profiles, and admins can track system statistics.

---

## ✨ Features

- **User Management** – Create, update, and fetch users
- **Authentication & Authorization** – JWT-based login, password reset, Google user support
- **OTP System** – Secure verification with one-time passwords
- **Doctor Management** – Add, update, and view doctor profiles
- **Specialization** – Manage doctor specializations
- **Booking System** – Patients can book and view appointments
- **Statistics** – Track users, doctors, and specialization metrics
- **Chat System** – Real-time messaging support

---

## 🌍 API Base URLs

- **Local Development**:  
  ```
  http://localhost:5000/api/v1
  ```

- **Production (Deployed on Vercel)**:  
  ```
  https://health-care-beckend.vercel.app/api/v1
  ```

---

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/health-care-api.git
   cd health-care-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**  
   Create a `.env` file and set:
   ```env
   PORT=5000
   DATABASE_URL=mongodb://localhost:27017/healthcare
   JWT_SECRET=your_secret_key
   ```

4. **Run the server**
   ```bash
   npm run dev
   ```
   The API will be available at:
   ```
   http://localhost:5000/api/v1
   ```

---

## 🔐 Authentication

Most routes are **protected** using JWT.  

Include the token in request headers:
```json
{
  "Authorization": "with cookie || headers"
}
```

---

## 📂 API Endpoints

### 👤 User

#### Create User
```http
POST /user/create
```
**Request**
```json
{
  "name": "Jony Das",
  "email": "jonydascse21@gmail.com"
}
```
**Response**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "687660d54a2ee5386f5d2c1f",
    "name": "Jony Das",
    "email": "jonydascse21@gmail.com"
  }
}
```

#### Update User
```http
POST /user/update
```
```json
{
  "name": "Updated Name",
  "email": "jony4@gmail.com"
}
```

#### Other User Routes
- `GET /user` → Get all users  
- `GET /user/:id` → Get single user  
- `GET /user/pending` → Get pending requests  
- `GET /user/request-send` → Send a user request  

---

### 🔐 Auth

#### Reset Password
```http
POST /auth/reset-password
```
**Request**
```json
{
  "id": "68833e18716062f268c26480",
  "token": "JWT_TOKEN_HERE"
}
```

**Other Auth Endpoints**
- `POST /auth/login` → User login  
- `POST /auth/token` → Create new access token  
- `POST /auth/change-password` → Change password  
- `POST /auth/set-password` → Set password for Google users  
- `POST /auth/forget-password` → Request password reset  

---

### 📲 OTP

- `POST /otp/send` → Send OTP  
- `POST /otp/verify` → Verify OTP  

---

### 🩺 Doctor

#### Add Doctor
```http
POST /doctor
```

#### Update Doctor
```http
PATCH /doctor/:id
```
**Request**
```json
{
  "name": "Dr. Jony Das"
}
```

**Other Doctor Endpoints**
- `GET /doctor` → Get all doctors  
- `GET /doctor/:id` → Get single doctor  
- `GET /doctor/reject` → Reject doctor request  

---

### 🧑‍⚕️ Specialization

- `POST /specialization` → Add specialization  
- `PATCH /specialization/:id` → Update specialization  
- `GET /specialization` → Get all specializations  

---

### 📅 Booking

#### Create Booking
```http
POST /booking/create
```
**Request**
```json
{
  "doctor": "68b34c99155e908be7ea6524"
}
```

#### Get User Bookings
```http
GET /booking/user
```

---

### 📊 Stats

- `GET /stats/user` → User statistics  
- `GET /stats/specialization` → Specialization statistics  
- `GET /stats/doctor` → Doctor statistics  

---

### 💬 Chat

#### Create Chat Message
```http
POST /chat/create
```
**Request**
```json
{
  "message": "Hello doctor, I need help",
  "threadId": 1
}
```

---

## 🧪 API Testing with Postman

You can import the provided collection file into Postman:

- File: `health care.postman_collection.json`
- Open Postman → Import → Upload the collection

---

## 📜 License

This project is licensed under the **MIT License**.
