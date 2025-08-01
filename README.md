# 🚀 DigiMart

**DigiMart** is a full-stack e-commerce platform tailored for selling **digital products** like tools, themes, and downloadable assets. It includes a powerful **admin panel**, a **manual UPI payment system** with QR code integration, and a personalized **user dashboard**. Payment verification is handled securely by admins, eliminating the need for third-party gateways.

---

## 🔑 Key Features

- **🛠️ Admin Panel**: Add, update, and manage digital products (tools, themes, etc.) with ease.
- **💳 Manual UPI Payment**: Users scan a QR code, submit the transaction ID, and await admin approval.
- **📦 User Dashboard**: Users can track payment status, view order history, and download files after approval.
- **🛒 Cart System**: Add multiple products to the cart before checkout.
- **🔒 Secure Payment Verification**: Admins manually verify transactions for reliability and security.
- **📱 Responsive Design**: Built with **React + Vite** and styled using **Tailwind CSS** for a smooth experience on all devices.

---

## 🧰 Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Frontend  | React, Vite, Tailwind CSS|
| Backend   | Node.js, Express.js      |
| Database  | MongoDB + Mongoose       |
| Routing   | React Router             |

---

## ⚙️ Prerequisites

Ensure the following tools are installed before setting up the project:

- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm or yarn
- A UPI QR code for test transactions

---

## 🧑‍💻 How to Use

### 👩‍💼 Admin Flow:

1. Log in to the Admin Panel (credentials set during setup).
2. Add new products with name, price, and downloadable file link.
3. View user-submitted transaction IDs.
4. Approve or reject transactions to manage downloads.

### 🧑‍💻 User Flow:

1. Register and log in.
2. Browse available digital products.
3. Add products to your cart and proceed to checkout.
4. Scan the UPI QR code using any UPI app.
5. Enter your transaction ID.
6. Wait for admin approval.
7. Once approved, download the product from your dashboard.

---

## 📈 Future Improvements

- Integrate real-time UPI payment verification (via APIs if available).
- Send email notifications for payments and downloads.
- Add sales and user analytics in the admin panel.
- Support multiple admin roles with customizable permissions.
