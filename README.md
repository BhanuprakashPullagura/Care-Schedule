# CareSchedule 🏥

CareSchedule is a full-stack Doctor Appointment Booking System built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).

It allows patients to register securely, book appointments with doctors, make payments online, receive automated email notifications, access prescriptions, and download medical records as PDF.

---

## Features

### Authentication & Security
- User Registration
- User Login
- JWT Authentication
- OTP Email Verification
- Forgot Password with OTP Reset

### Doctor Management
- View all doctors
- Filter doctors by specialization
- Doctor profile details
- Real-time availability checking

### Appointment System
- Book appointment
- View appointments
- Cancel appointment
- Prevent double booking

### Payment Integration
- Razorpay Payment Gateway
- Payment Verification
- Payment Status Tracking

### Smart Notification System
- OTP Email Notification
- Appointment Confirmation Email
- Payment Success Email
- Prescription Email

### Medical Record System
- Doctor Prescription Upload
- Diagnosis & Notes Management
- Patient Medical Record View

### PDF Generation
- Download Prescription as PDF using jsPDF

### Admin Panel
- Admin Login
- Add Doctor
- View Doctors
- Manage Appointments
- Dashboard Overview

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router
- React Toastify
- jsPDF

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### Authentication
- JWT
- bcrypt

### File Upload
- Multer
- Cloudinary

### Email Service
- Nodemailer

### Payment Gateway
- Razorpay

### AI Integration (Optional/Future)
- Gemini API

---

## Project Structure

/backend
/controllers
/models
/routes
/middlewares
/config
/lib

/frontend
/src
/components
/pages
/context

/admin
/src
/pages
/context

---

## Installation

### Clone Repository

```bash
git clone <your-repository-url>
cd CareSchedule
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

GEMINI_API_KEY=your_gemini_api_key
```

Run backend:

```bash
npm run server
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_BACKEND_URL=http://localhost:4000
```

Run frontend:

```bash
npm run dev
```

---

## Admin Panel Setup

```bash
cd admin
npm install
```

Create `.env`

```env
VITE_BACKEND_URL=http://localhost:4000
```

Run admin:

```bash
npm run dev
```

---

## API Endpoints

### User Routes

- POST `/api/user/register`
- POST `/api/user/login`
- POST `/api/user/verify-otp`
- POST `/api/user/forgot-password`
- POST `/api/user/reset-password`
- GET `/api/user/get-profile`
- POST `/api/user/book-appointment`
- GET `/api/user/appointments`
- POST `/api/user/cancel-appointment`

### Payment Routes

- POST `/api/user/create-order`
- POST `/api/user/verify-payment`

### Admin Routes

- POST `/api/admin/login`
- POST `/api/admin/add-doctor`
- GET `/api/admin/all-doctors`
- POST `/api/admin/change-availability`
- DELETE `/api/admin/delete-doctor/:doctorId`
- GET `/api/admin/appointments`
- GET `/api/admin/dashboard`

### AI Chat Route

- POST `/api/user/chat`

---

## Workflow

1. User registers/login with OTP verification
2. User browses doctors
3. User books appointment
4. Payment completed using Razorpay
5. Appointment confirmed
6. Email notification sent
7. Doctor uploads prescription
8. Prescription emailed to patient
9. Patient downloads PDF

---

## Future Enhancements

- AI Chatbot
- Telemedicine Video Calls
- SMS Notifications
- Doctor Ratings
- Analytics Dashboard

---

## Author

P Bhanu Prakash

---

## License

This project is for educational purposes.