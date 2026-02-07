# Getting Started

Welcome to the **Daily Expenses Tracker**! This guide will help you set up the project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: (Version 16 or higher) - [Download Here](https://nodejs.org/)
- **Git**: [Download Here](https://git-scm.com/)
- A code editor like **VS Code**.

## Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Rajkumar1709/daily-expenses-tracker.git
    cd daily-expenses-tracker
    ```

2.  **Navigate to Client Directory**
    The application is a client-side PWA, so we focus on the `client` folder.
    ```bash
    cd client
    ```

3.  **Install Dependencies**
    ```bash
    npm install
    ```

## Running the Application

To start the development server:

```bash
npm run dev
```

- Pass the `--host` flag to access it from other devices on your network:
  ```bash
  npm run dev -- --host
  ```
- The app will be available at `http://localhost:5173`.

## Building for Production

To create an optimized build for deployment (e.g., Vercel, Netlify):

```bash
npm run build
```

This will create a `dist` folder containing the compiled files.

## Project Structure

```
client/
├── public/          # Static assets (icons, manifest)
├── src/
│   ├── components/  # Reusable UI components (Navbar, LoadingScreen)
│   ├── context/     # Global State (AuthContext)
│   ├── pages/       # Application Routes (Dashboard, Login, Analytics)
│   ├── services/    # Data Logic (StorageService.js)
│   ├── App.jsx      # Main Application Component
│   └── main.jsx     # Entry Point
├── index.html       # HTML Template
├── vite.config.js   # Vite & PWA Configuration
└── package.json     # Dependencies & Scripts
```
