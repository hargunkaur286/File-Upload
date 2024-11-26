# File Upload Application

This is a **File Upload Application** that allows users to upload files directly to an **AWS S3 bucket**. The project is divided into two parts: a **frontend** (client) and a **backend** (server).

**LIVE LINK:** https://file-upload-topaz.vercel.app/

## Features

- **Frontend**: Built with **Vue.js**, it provides an intuitive UI for file uploads, with drag-and-drop functionality and toast notifications for user feedback.
- **Backend**: Built with **Node.js**, it handles file uploads using the **Multer** library and stores the files in an AWS S3 bucket.
- Supports multiple file uploads with progress indicators.
- Notifications for success and error states using the **Toast** library.
- Responsive design for optimal user experience across devices.

---

## Folder Structure

```plaintext
.
├── client          # Frontend application built with Vue.js
│   ├── src         # Vue components and application logic
│   ├── public      # Static assets
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── README.md
├── server          # Backend application built with Node.js
│   ├── s3Service.js # Handles AWS S3 file uploads
│   ├── index.js    # Express server entry point
│   ├── package.json
│   ├── .env        # Environment variables (AWS credentials, etc.)
│   └── README.md
└── README.md       # Main project documentation
```

## Prerequisites
- Node.js (v14+)
- pnpm (for the frontend)
- AWS Account with an S3 bucket configured
- Environment variables for AWS credentials (details below)
  ```plaintext
  AWS_ACCESS_KEY_ID=your_aws_access_key_id
  AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
  AWS_REGION=your_aws_region
  AWS_BUCKET_NAME=your_s3_bucket_name
  ```
## Installation and Setup

1. Clone the Repository
   ```plaintext
   git clone https://github.com/your-repository-url.git
   cd your-repository-name
   ```
2. Setup Backend
   ```plaintext
   cd server
   npm install
   ```
   Add the required AWS credentials to the .env file.
   Start the backend server:
   ```plaintext
   npm start
   ```
   The server will run at http://localhost:4000.
3. Set Up the Frontend
   ```plaintext
   cd client
   pnpm install
   ```
  Start the frontend development server:
  ```plaintext
  pnpm run serve
  ```
  The frontend will be available at http://localhost:8080.


## Key Technologies Used


### Frontend (Client)
- Vue.js: Framework for building the user interface.
- Tailwind CSS: Utility-first CSS framework for responsive design.
- Toast Library: Provides notifications for success and error events.

### Backend (Server)
- Node.js: Server-side JavaScript runtime.
- Express.js: Web framework for handling routes and API requests.
- Multer: Middleware for handling file uploads.
- AWS S3: Cloud storage service for storing uploaded files.


