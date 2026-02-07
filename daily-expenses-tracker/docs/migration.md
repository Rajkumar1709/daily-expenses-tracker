# Migration Guide: MERN to Offline PWA

This document explains the transition of the **Daily Expenses Tracker** from a full-stack MERN (MongoDB, Express, React, Node) application to a client-side **Offline-First PWA**.

## Why the Change?

The initial MERN architecture required:
1.  A running backend server.
2.  Active internet connection.
3.  Database hosting (MongoDB).

**The Pivot**: To allow the application to run on mobile devices **without internet** and be installable as a native-like app, we removed the server dependency entirely.

## Migration Steps

1.  **Removed Backend Dependencies**:
    - Deleted `server/` logic from the production build pipeline.
    - Removed `axios` and API calls from React components.

2.  **Created Local Storage Layer**:
    - Implemented `StorageService.js` to mimic database operations (CRUD).
    - `localStorage` now acts as the "Database".

3.  **Refactored Authentication**:
    - Replaced JWT/Server-side auth with local session management.
    - User accounts are stored as JSON strings in the browser.

4.  **PWA Configuration**:
    - Added `vite-plugin-pwa` to generate `manifest.json`.
    - Configured service workers for caching assets.

## Trade-offs

| Feature | MERN Stack (Original) | Offline PWA (Current) |
| :--- | :--- | :--- |
| **Connectivity** | Requires Internet | Works Offline |
| **Data Sync** | Syncs across all devices | Data stays on one device |
| **Privacy** | Data on Server | Data on Device (Private) |
| **Cost** | Hosting Costs | Free (Static Hosting) |
