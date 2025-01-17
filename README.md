# E-Commerce Application

Welcome to the E-Commerce Application! This project is a full-stack application with a React-based frontend and a Go-powered backend. It provides a seamless shopping experience with features like product browsing, cart management, order placement, and secure authentication.

---

## Table of Contents

- [Overview](#overview)
- [Frontend](#frontend)
- [Backend](#backend)
- [Getting Started](#getting-started)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This e-commerce platform allows users to:
- Browse products.
- Add products to the cart.
- Manage orders.
- Securely authenticate and manage their profiles.
- Access personalized features like a wishlist and special offers.

The frontend is built with React, leveraging modern libraries and hooks, while the backend is developed in Go using efficient and scalable practices.

---

## Frontend

### Key Features
- **React Router DOM** for client-side routing and dynamic page transitions.
- **Material UI** for consistent and responsive styling.
- **Custom Contexts**:
  - `AuthContext` for user authentication and authorization.
  - `CartContext` for cart and product count management.
  - `ThemeContext` for light/dark mode toggling.
- **PrivateRoute** middleware to secure specific routes.
- **Hooks**: Custom hooks like `useCart` to manage reusable logic effectively.

### Pages and Components
- **Navbar**: Displays navigation links and the cart count.
- **Home**: Landing page with featured products.
- **Products**: Product listing page with filter options.
- **ProductDetail**: Detailed view of a single product.
- **Cart**: Cart management page.
- **Orders**: User order history.
- **Wishlist**: Save favorite products.
- **Authentication**: Login and Signup forms.

---

## Backend
checkout the backend [here](https://github.com/nitishb2m/microservices)

The backend is developed in Go (`mux` and `gin` package) and follows a microservices architecture with the following services:
1. **User Service**: Manages user accounts and authentication.
2. **Product Service**: Handles product-related operations.
3. **Cart Service**: Manages cart items and order placement.
4. **Order Service**: Handles order-related operations.
5. **Payment Service**: Handles payment processing.

### Key Features
- RESTful APIs for all operations.
- Lightweight and scalable using Go’s native HTTP package.
- Organized folder structure: `internal`, `pkg`, and `utils`.

---

## Getting Started

### Prerequisites
- Node.js (Frontend)
- Go (Backend)
- A package manager (npm or yarn)

### Installation

#### Clone the Repository
```bash
git clone https://github.com/nitishb2m/microservice-ecomm-frontend.git
cd microservice-ecomm-frontend
npm install
npm run dev
```
