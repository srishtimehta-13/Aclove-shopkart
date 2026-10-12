from pathlib import Path

content = r"""# ALCOVE — Curated Commerce

ALCOVE is a full-stack e-commerce application built with the MERN stack. It is designed around a curated, premium shopping experience, pairing a clean editorial-style storefront with customer authentication, product discovery, cart management, and a backend-driven checkout flow.

> **Project status:** In development. The README describes the project architecture and the features implemented or being integrated; update the feature checklist as the application evolves.

## Table of Contents

- [Overview](#overview)
- [Highlights](#highlights)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Core Workflows](#core-workflows)
- [API Overview](#api-overview)
- [Security and Validation](#security-and-validation)
- [Design System](#design-system)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

## Overview

ALCOVE (also referred to as **Aclove** in parts of the codebase) is a MERN-based online store. The React client communicates with an Express API, which uses MongoDB for persistent data storage. Customer authentication is handled by the backend, product images are intended to be stored through Cloudinary, and checkout integrates Razorpay.

The project is organized to keep the user interface, API routes, controllers, data models, and middleware separate so that features can be maintained and extended independently.

## Highlights

- **Customer accounts:** Registration, login, authenticated account access, and logout.
- **Product catalogue:** Product information such as name, description, price, category, stock, and image URLs.
- **Image uploads:** Multer handles incoming multipart uploads; Cloudinary is used for hosted product images.
- **Cart and wishlist:** Customer-associated cart items and wishlist product references.
- **Checkout and orders:** Server-created order records and Razorpay order creation.
- **Payment verification:** Backend signature verification before marking an order as paid.
- **Responsive storefront:** React-based interface with a premium, editorial visual direction.
- **API integration:** Axios-based client requests to the Express backend.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios |
| Styling and icons | Tailwind CSS, Lucide React (where used) |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), HTTP-only cookies, bcrypt |
| Image uploads | Multer, Cloudinary |
| Payments | Razorpay |
| Configuration | dotenv / environment variables |
| Development | nodemon |

## Architecture

```text
Browser
  |
  v
React + Vite client
  |  Axios requests
  v
Express API
  |-- Routes
  |-- Controllers
  |-- Authentication middleware
  |-- Mongoose models
  |-- Cloudinary image storage
  |-- Razorpay order creation and verification
  |
  v
MongoDB
```

The frontend is responsible for rendering pages and collecting user input. The backend validates requests, enforces authentication, accesses MongoDB, and performs trusted operations such as creating payment orders and verifying payment signatures.

## Project Structure

The exact file layout may differ as development continues. The repository has a client application and a server application, broadly organized as follows:

```text
ALCOVE/
├── client/
│   └── ShopKart/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── context/
│       │   ├── Pages/
│       │   ├── axiosCalls/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── ...
└── server/
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── utils/
    ├── index.js
    ├── package.json
    └── .env
```

### Directory responsibilities

- `Pages/` — page-level React views, such as landing, login, registration, and home pages.
- `components/` — reusable UI elements.
- `context/` — shared client-side state, such as authentication state, where used.
- `axiosCalls/` — Axios configuration and API helpers.
- `routes/` — Express endpoint definitions.
- `controllers/` — request handling and application logic.
- `models/` — Mongoose schemas and database models.
- `middlewares/` — authentication, upload, and request-processing middleware.
- `utils/` — shared utilities, including payment-related setup.

## Getting Started

### Prerequisites

Install the following before running the application:

- Node.js and npm
- MongoDB, either locally or through MongoDB Atlas
- Cloudinary credentials for image upload functionality
- Razorpay test credentials for payment integration

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <repository-folder>
```

Replace the placeholder with the repository URL.

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure backend environment variables

Create a `.env` file in the server directory. Use the variable names expected by your current code. A typical configuration is shown below; remove or rename any variable that your implementation does not use.

```env
PORT=8080
DB_URL=<your-mongodb-connection-string>
JWT_SECRET=<a-long-random-secret>

CLIENT_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

RAZORPAY_KEY_ID=<your-razorpay-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
```

**Important:** The codebase may use a slightly different MongoDB variable name (for example, `dbUrl`) or payment configuration variable names. Match the names read by `process.env` in your source files. Never commit real secrets to Git.

### 4. Install frontend dependencies

Open a second terminal:

```bash
cd client/ShopKart
npm install
```

If your frontend is located in a different directory, run these commands from the folder containing its `package.json`.

### 5. Configure the API URL

Check the Axios instance in the frontend (for example, under `src/axiosCalls/`). During local development, the backend has been configured to run on port `8080`. Ensure the frontend base URL points to the correct API origin and that the backend CORS configuration allows the frontend origin.

## Running the Application

Start the backend:

```bash
cd server
npx nodemon index.js
```

Start the frontend in a separate terminal:

```bash
cd client/ShopKart
npm run dev
```

With the default local setup, the expected addresses are:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

These ports may differ based on your local configuration. Confirm the URLs printed in the terminal.

## Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Port on which the Express server listens |
| `DB_URL` / `dbUrl` | MongoDB connection string; use the exact name expected by the code |
| `JWT_SECRET` | Secret used to sign and verify authentication tokens |
| `CLIENT_ORIGINS` | Comma-separated list of allowed frontend origins, if supported by the CORS configuration |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RAZORPAY_KEY_ID` | Razorpay public/key ID used by the checkout integration |
| `RAZORPAY_KEY_SECRET` | Server-side secret used for payment order creation and signature verification |

Keep `.env` out of version control. Add a `.env.example` containing placeholders if you want contributors to know which variables are required.

## Core Workflows

### Customer authentication

1. A customer submits the registration or login form.
2. The React client sends the request to the Express API.
3. The server validates the input and checks or creates the customer record.
4. Passwords are hashed with bcrypt rather than stored as plain text.
5. Authentication uses a JWT delivered through an HTTP-only cookie.
6. Protected endpoints verify the authenticated customer before returning private data.

### Product catalogue and image upload

1. The client submits product details and image files.
2. The upload middleware processes multipart form data.
3. The server uploads images to Cloudinary and stores the resulting URLs with the product record.
4. The product catalogue API returns product data for the frontend to display.

Product fields used in the project include `name`, `description`, `price`, `category`, `stock`, and `images`.

### Cart and wishlist

Cart entries associate a product with a quantity. Wishlist entries reference products. The backend should validate product IDs and quantities rather than trusting values submitted by the browser.

### Checkout and payment

The checkout flow is designed around server-side trust boundaries:

1. The authenticated customer submits shipping details.
2. The backend validates the details and calculates the payable amount from trusted product and cart data.
3. The backend creates a persistent order with a pending-payment state.
4. The backend creates a Razorpay order using the amount in **paise** (₹1 = 100 paise).
5. The frontend opens Razorpay Checkout using the public Key ID and the generated order ID.
6. After payment, the client sends the payment identifiers and signature to the backend.
7. The backend verifies the signature using the Razorpay Key Secret.
8. Only after successful verification should the order be marked paid/placed and the cart be cleared.

The Razorpay Key Secret must remain on the server. Never treat a client-side success message alone as proof of payment.

## API Overview

The API is organized into route groups. The precise endpoints can change as controllers and routes evolve; use the route files as the source of truth.

| Route group | Responsibility |
|---|---|
| `/customers` | Customer registration, login, current-customer information, and logout |
| Product routes | Product creation and product catalogue/detail retrieval |
| Cart routes | Reading and updating the authenticated customer's cart |
| Order routes | Creating orders and verifying payment |
| Wishlist functionality | Managing the authenticated customer's saved products |

Authentication endpoints previously used in the customer flow include registration, login, current-user (`/me`), and logout routes under the customer route group. Confirm the exact HTTP methods and full paths in the current route definitions before integrating another client.

## Security and Validation

- Hash passwords with bcrypt; never store plain-text passwords.
- Keep JWT secrets, Cloudinary secrets, and Razorpay secrets in environment variables.
- Use HTTP-only cookies for authentication tokens and configure CORS credentials/origins correctly.
- Validate request bodies, MongoDB IDs, product quantities, stock availability, and shipping details on the server.
- Calculate totals from trusted database values; do not rely on a price or total sent by the client.
- Verify Razorpay payment signatures on the backend before updating order status.
- Clear the cart only after verified payment and successful order-state updates.
- Do not commit `.env`, API keys, access tokens, or database credentials.

## Design System

ALCOVE follows a **quiet-luxury, editorial boutique** direction, with generous spacing, restrained accents, and warm neutral surfaces.

| Token | Value | Intended use |
|---|---|---|
| Deep Forest | `#17483F` | Primary brand colour |
| Warm Ivory | `#F7F1E6` | Main background |
| Charcoal | `#292A2A` | Primary text |
| Sage | `#71977C` | Supporting accents |
| Antique Gold | `#C89A55` | Premium highlights |

The intended typography pairs **Cormorant Garamond** for expressive headings with **Manrope** for readable interface text. Keep the experience responsive and accessible, with clear focus states, labels, loading states, errors, and empty states.

## Troubleshooting

### Frontend cannot reach the backend

- Confirm the backend is running on the port configured in the Axios instance.
- Check the browser Network tab for the request URL and response.
- Ensure the frontend origin is allowed by backend CORS.
- If cookies are used, configure credentialed requests on both the client and server.

### Port is already in use

Stop the process using the port, or change the backend `PORT` and the frontend API base URL to match.

### MongoDB connection fails

- Check the connection string and database access permissions.
- Confirm network access is allowed if using MongoDB Atlas.
- Ensure the environment variable name in `.env` exactly matches the name used by the code.

### Cloudinary uploads fail

- Verify the cloud name, API key, and API secret.
- Check that the server loads environment variables before configuring Cloudinary.
- Confirm that the upload middleware receives the expected multipart field name and that the frontend sends `FormData`.

### Razorpay checkout or verification fails

- Use matching test credentials from the same Razorpay account.
- Confirm the backend creates the order and returns the Razorpay order ID.
- Send the payment IDs and signature back to the backend for verification.
- Check that the server uses the stored order ID and the correct Key Secret.
- Confirm that amounts are sent in integer paise, not rupees.

### Cookie authentication fails locally

- Check cookie options such as `httpOnly`, `sameSite`, and `secure` for the local HTTP environment.
- Ensure Axios sends credentials and Express CORS enables credentials for the exact frontend origin.
- Check that frontend and backend hostnames are consistent (`localhost` versus `127.0.0.1`).

## Roadmap

Potential next steps for the project:

- [ ] Complete and test the end-to-end customer journey.
- [ ] Finalize product browsing, category filtering, and product-detail views.
- [ ] Add robust cart quantity and stock validation.
- [ ] Complete wishlist management and customer account views.
- [ ] Test Razorpay success, failure, cancellation, and retry scenarios.
- [ ] Add consistent loading, empty, and error states throughout the UI.
- [ ] Add automated API tests and frontend tests.
- [ ] Add deployment instructions and production environment configuration.
- [ ] Document the final API endpoints with example requests and responses.

## Contributing

1. Create a feature branch.
2. Keep changes focused and follow the existing client/server separation.
3. Test the affected frontend and API workflows.
4. Never include secrets or personal customer data in commits.
5. Open a pull request with a summary and testing notes.

## License

No license has been specified yet. Add a `LICENSE` file and update this section before distributing or accepting reuse of the project.
"""
path = Path("/mnt/data/README.md")
path.write_text(content, encoding="utf-8")
print(f"Created {path} ({len(content.splitlines())} lines, {path.stat().st_size} bytes)")
