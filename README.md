# UniChat Messaging App

## Overview
UniChat is a real-time messaging application built with the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to communicate in real-time and provides a user-friendly experience.

## Key Features
- **Real-time Communication**: Using `socket.io-client` and `socket.io`, UniChat provides real-time communication between users.
- **User Authentication**: With `jsonwebtoken` and `bcrypt`, the app ensures secure user authentication.
- **File Upload**: `express-fileupload` and `multer` are used for handling file uploads.
- **Data Validation**: `express-validator` and `yup` are used for server-side and client-side data validation respectively.
- **State Management**: `redux` and `@reduxjs/toolkit` are used for state management.
- **Routing**: `react-router-dom` is used for efficient page navigation and routing throughout the application.

## Technologies Used
Here are the main technologies and libraries used in this project:

### Client
- `react` and `react-dom` for building the user interface
- `socket.io-client` for real-time communication
- `redux` and `@reduxjs/toolkit` for state management
- `react-router-dom` for routing and navigation
- `@emotion/react` and `@emotion/styled` for styling components
- `@dhaiwat10/react-link-preview` for link preview functionality
- `@emoji-mart/data` and `@emoji-mart/react` for emoji support
- `@iconify/react` for icons
- `@mui/material` and `@mui/lab` for Material-UI components
- `axios` for making HTTP requests
- `react-hook-form` and `@hookform/resolvers` for form handling and validation
- `yup` for schema validation

### Server
- `express` for server setup
- `socket.io` for real-time communication
- `jsonwebtoken` for token-based authentication
- `bcrypt` for password hashing
- `mongodb` and `mongoose` for database management
- `express-fileupload` and `multer` for handling file uploads
- `express-validator` for server-side data validation
- `cors` for enabling CORS
- `dotenv` for environment variable management
- `morgan` for logging HTTP requests
- `helmet` for securing Express apps

## Installation
To install the necessary dependencies for the client and server, follow these steps:

1. Navigate to the client directory:
```bash
cd client

Install the client dependencies:
npm install

Navigate to the server directory:
cd ../server

Install the server dependencies:
npm install

```

![uk l](https://github.com/kamilawniczak/SkyCast/assets/113726168/74bfaab2-2b99-451b-9b6c-53ec68735559)
![uk r](https://github.com/kamilawniczak/SkyCast/assets/113726168/010bf25c-3717-4274-9333-eb4201b139f2)
![uh 1](https://github.com/kamilawniczak/SkyCast/assets/113726168/da3ca54f-8552-44d9-b31b-bc29c1e7ace0)
