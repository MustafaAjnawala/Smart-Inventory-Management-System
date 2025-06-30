# CareEco Inventory Management System Inventory Management System for One Smart Inc.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/) [![Electron.js](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)](https://electronjs.org) [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)

This is an inventory management system for One Smart Inc. built with the MERN stack and Electron.

## ✨ Features

*   📦 Product Management
*   🛒 Purchase Tracking
*   🧾 Billing and Invoicing
*   ↩️ Returns Management
*   🗓️ Expiry Date Notifications

## ✍️ Authors

This project was created by:

*   **Mustafa Ajnawala** - [GitHub Profile](https://github.com/MustafaAjnawala)
*   **O-Erebus** - [GitHub Profile](https://github.com/o-Erebus)

## 📂 Directory Structure

```
.
├── one-smart-inc-frontend-electron/  # Electron frontend application
│   ├── src/
│   │   ├── main/                       # Electron main process
│   │   ├── preload/                    # Electron preload script
│   │   └── renderer/                   # React frontend
│   │       ├── src/
│   │       │   ├── components/         # React components
│   │       │   ├── services/           # API and local DB services
│   │       │   └── theme/              # Material-UI theme
├── server/                             # Node.js backend
│   ├── controllers/                    # Route handlers
│   ├── models/                         # Mongoose models
│   └── ...
└── ...
```

## 🚀 Getting Started

### Prerequisites

*   Node.js
*   MongoDB

### Installation

1.  **Backend:**
    ```bash
    cd server
    npm install
    ```

2.  **Web Frontend:**
    ```bash
    cd one-smart-inc-frontend
    npm install
    ```

3.  **Electron Frontend:**
    ```bash
    cd one-smart-inc-frontend-electron
    npm install
    ```

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd server
    npm run dev
    ```

2.  **Start the Web application:**
    ```bash
    cd one-smart-inc-frontend
    npm run dev
    ```

3.  **Start the Electron application:**
    ```bash
    cd one-smart-inc-frontend-electron
    npm run dev
    ```

## 💻 Technologies Used

*   **Frontend:** React, Electron, Material-UI, Vite
*   **Backend:** Node.js, Express, MongoDB, Mongoose
*   **Database:** MongoDB

## ↔️ API Endpoints

*   `POST /api/products` - Add a new product
*   `GET /api/products` - Get all products
*   `POST /api/purchases` - Add a new purchase
*   `GET /api/purchases` - Get all purchases
*   `GET /api/bills` - Get all bills
*   `POST /api/returns` - Process a return
*   `POST /api/billing` - Process a bill

## Documentation

For more detailed information, please refer to the documentation for each part of the project:

*   [Server Documentation](./server/README.md)
*   [Web Frontend Documentation](./one-smart-inc-frontend/README.md)
*   [Electron Frontend Documentation](./one-smart-inc-frontend-electron/README.md)
