# Rwanda Construction Inspection Platform

A web application for managing construction inspection workflows in Rwanda, providing district-scoped access to ArcGIS dashboards and Survey123 forms with secure authentication through ArcGIS Enterprise Portal.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [District Access Control](#district-access-control)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

This application enables authenticated users to access construction inspection dashboards and forms specific to their assigned district. By integrating with ArcGIS Enterprise Portal, the platform ensures secure authentication and provides district-filtered navigation to prevent unauthorized access to dashboards outside a user's jurisdiction.

---

## Features

- **ArcGIS Enterprise Authentication** – Secure server-side authentication via dedicated API routes
- **District-Based Access Control** – Automatic filtering of dashboard navigation based on user district assignments
- **Embedded Dashboards** – Seamless integration of ArcGIS dashboards with token-aware URL handling
- **Responsive Design** – Modern, mobile-friendly interface built with Tailwind CSS and Radix UI components

---

## Technology Stack

- **Framework:** Next.js (App Router)
- **Frontend:** React with TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Analytics:** Vercel Analytics (optional)

---

## Prerequisites

Before installing the application, ensure your environment meets the following requirements:

- **Node.js** version 18 or higher (Node.js 20+ recommended)
- **Network Access** to the ArcGIS Portal instance (default: `https://gh.space.gov.rw/portal`)
- Appropriate firewall and DNS configuration for portal connectivity

---

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

---

## Configuration

### ArcGIS Portal Configuration

The application authenticates against an ArcGIS Enterprise Portal instance. The default portal URL is `https://gh.space.gov.rw/portal`.

**Network Requirements:**

- DNS resolution must function correctly for the portal hostname
- Outbound HTTPS connections to the portal must be permitted
- The portal must be accessible from your deployment environment

**Proxy Configuration:**

If your deployment environment requires proxy servers or custom DNS settings, configure these at the operating system or container level before running the application.

---

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Building for Production

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

## Deployment

This is a Next.js server application that includes API routes and must be deployed as a Node.js application.

### Deployment Steps

1. Transfer the repository to your production server
2. Install production dependencies:

```bash
npm ci --omit=dev
```

3. Build the application:

```bash
npm run build
```

4. Start the production server:

```bash
npm start
```

### Required Files for Production

When deploying the build artifacts, ensure you include:

**Essential:**
- `.next/` (build output directory)
- `public/` (static assets)
- `package.json`
- `package-lock.json`
- `node_modules/` (generated via `npm ci` on the server)

**Recommended:**
- `next.config.mjs`
- `tsconfig.json`
- `postcss.config.mjs`

> **Note:** The `node_modules/` directory should be installed on the server using `npm ci` or `npm install`. Manual transfer of this directory is not recommended unless explicitly required.

---

## Project Structure

```
app/
├── api/
│   └── auth/
│       ├── login/route.ts      # ArcGIS Portal authentication endpoint
│       └── proxy/route.ts      # Proxy helper route
├── login/page.tsx              # Login page UI
└── page.tsx                    # Main dashboard container (iframe)

components/
├── district-config.tsx         # District-to-URLs mapping and filtering logic
├── top-navigation.tsx          # Navigation component with district filtering
└── arcgis-auth-provider.tsx   # Token injection helpers for embedded apps

lib/
└── auth-utils.ts               # Token management utilities

public/                         # Static assets
```

---

## District Access Control

District-specific access control is managed through configuration files:

### Configuration Location

**`components/district-config.tsx`**

Define district permissions by adding dashboard and form URLs to each district's `allowedUrls` array. Optionally apply district-specific URL filters using query parameters or URL fragments.

**`components/top-navigation.tsx`**

Navigation menu items are defined here and automatically filtered based on the authenticated user's district assignment at runtime.

---

## Troubleshooting

### Error: `POST /api/auth/login` returns 500 with `getaddrinfo ENOTFOUND`

**Cause:** The server cannot resolve the ArcGIS portal hostname (DNS issue) or cannot establish a connection (network/firewall restriction).

**Resolution:**
- Verify DNS resolution for the portal hostname on the server
- Confirm that outbound HTTPS connections are permitted by firewall rules
- If operating behind a corporate proxy, configure appropriate proxy settings at the Node.js or operating system level

### Dashboards Do Not Load in Embedded iFrame

**Cause:** Some ArcGIS applications include security headers that prevent embedding in iframes.

**Resolution:**
The application provides an "Open Dashboard" fallback button that opens dashboards in a new browser tab when embedding is blocked.

---

## License

**UNLICENSED** – This project is for internal use only.

If you plan to open-source this project, please add an appropriate license file and update this section accordingly.

---

## Support

For technical support or questions regarding this application, please contact your system administrator or the development team responsible for maintaining this platform.
