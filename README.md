# Server-Rendered E-commerce Admin Dashboard

A comprehensive, full-stack administrative dashboard built with **Next.js 15 (App Router)**. This application provides real-time analytics, inventory management, and secure authentication for e-commerce administrators.

## 🚀 Live Demo
**[View Live Deployment Here](https://e-commerce-admin-navy-seven.vercel.app/login)** 

## 📖 Project Overview

This project is a **Server-Side Rendered (SSR)** application designed to solve the problem of slow, client-heavy admin panels. By leveraging Next.js, it fetches data on the server for instant page loads and better performance. It features a complete CRUD system for products, visual data analytics, and a secure multi-step wizard for managing inventory.

## ✨ Key Features

### 📊 Interactive Analytics Dashboard
- **Visual Insights:** Includes a **Pie Chart** for stock distribution and a **Bar Graph** for price/stock comparison.
- **Scrollable Charts:** The Stock Levels bar graph includes a horizontal scroll feature to handle large inventories without cramping the UI.
- **KPI Cards:** Instant view of Total Inventory Value, Stock Units, and Unique Products.

### 🛠️ Advanced Product Management (CRUD)
- **Multi-Step Creation Wizard:** A 3-step animated form (Basic Info → Pricing → Image Upload) built with **Framer Motion** for a smooth user experience.
- **Edit Functionality:** Administrators can update existing products. The form pre-fills with current data (fetched via SSR) and handles new image uploads seamlessly.
- **Secure Deletion:** Products can be removed safely from the database.

### 🔒 Secure Authentication & Access
- **Email Verification:** Custom OTP (One-Time Password) system sent via Email.
- **Email Verification:** To ensure that no any randoms can register for admin i have created in such a way that only people with organisation email or g-suit can register (currently set to .iitr.ac.in).
- **Duplicate Prevention:** Backend logic prevents re-registration of existing active emails.
- **Protected Routes:** Middleware ensures only authenticated users can access the dashboard.

### ☁️ Cloud Integration
- **Image Hosting:** Direct integration with **Cloudinary** for scalable image storage.
- **Database:** **MongoDB** for flexible and fast data storage.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Database:** MongoDB & Mongoose
- **Styling:** Styled Components & Tailwind CSS
- **Animations:** Framer Motion
- **Form Validation:** React Hook Form & Zod
- **Charts:** Recharts / Chart.js
- **Image Storage:** Cloudinary
- **Icons:** Lucide React

## ⚙️ Getting Startedmn 

Follow these steps to run the project locally.

### 1. Clone the Repository

git clone [https://github.com/aditya-iitr/ecommerce-admin-dashboard.git]
cd ecommerce-admin-dashboard

### 2. Install Dependencies
npm install
# or
yarn install

### 3. Environment Variables
Create a .env file in the root directory and add the following keys:
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_random_secret_string
EMAIL_USER=your_email_for_otp
EMAIL_PASS=your_email_app_password

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_PRESET=ecommerce_preset

### 4. Run Development Server

npm run dev

Now Open http://localhost:3000 to see the app.
