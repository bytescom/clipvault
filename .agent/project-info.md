# ClipVault - Project Information & Architecture Guide

## 1. Project Summary
**ClipVault** is a fast, responsive web application for storing, organizing, and sharing text clips, links, code snippets, and todo items in a personal vault. It is built with a bold neo-brutalist visual style featuring heavy black borders, high-contrast colors, offset drop shadows, and tactile button states.

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js (App Router, Turbopack) | 16.2.x | Server-rendered pages, API routes, Edge proxy |
| **UI Library** | React | 19.2.x | Component lifecycle and hooks |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/postcss`) | 4.x | Utility-first styling with neo-brutalist tokens |
| **Authentication** | Better Auth | 1.6.x | Email/password, session cookies, password reset |
| **Database** | MongoDB & Mongoose | Driver 7.x, Mongoose 9.x | NoSQL database for vault items and auth data |
| **Email Service** | Nodemailer | 6.x | Gmail SMTP email delivery for password reset |
| **Deployment** | Netlify | `@netlify/plugin-nextjs` | Edge functions and serverless API handlers |

---

## 3. Core Features & Workflows

### 3.1 Authentication & Profile
- **Sign Up / Sign In**: Handled via Better Auth email and password provider.
- **Unique Username Claim**: During initial onboarding (`/create-username`), users pick a unique handle (`/api/create-username`) that serves as their public URL route (`/[username]`).
- **Password Reset Flow**:
  1. User enters email at `/auth/forgot-password`.
  2. Server generates a cryptographically secure, 1-hour verification token in MongoDB.
  3. Nodemailer sends a styled HTML email via Gmail SMTP with a direct link:
     `/auth/reset-password?token=...`
  4. User sets their new password at `/auth/reset-password`.

### 3.2 Vault Items (CRUD & Visibility)
- **Item Creation**: User adds text, links, or notes at `/vault`. Each item is assigned a client-side `nanoid` and synced via POST to `/api/vault`.
- **Public vs Private Toggle**: Items can be toggled between private (vault-only) or public (accessible on the user's public profile page at `/[username]`).
- **Optimistic UI Updates**: Item creation, editing, deletion, and privacy toggling update locally in React state immediately with automatic rollback on network failure.
- **Unmount Beacon Sync**: Final privacy statuses are flushed on component unmount using `navigator.sendBeacon` to `/api/vault/visibility`.

### 3.3 Public Profile Pages (`/[username]`)
- Anyone can visit `clipvault.com/@username` or `clipvault.com/username` to view a user's publicly shared links and snippets.
- Private items are strictly filtered out on the server before response delivery.

---

## 4. Key Directory & File Map

```text
clipvault/
├── .agent/                  # Antigravity agent context & guidelines
│   ├── project-info.md      # This file
│   └── rules/               # Scoped agent instructions
│       ├── edge-compatibility.md
│       └── auth-conventions.md
├── .docs/                   # Architecture and technical documentation
│   └── password-reset-flow.txt
├── app/                     # Next.js 16 App Router
│   ├── [username]/          # Public profile route (page.jsx)
│   ├── api/                 # Node.js runtime API Route Handlers
│   │   ├── auth/[...all]/   # Better Auth catch-all route handler
│   │   ├── create-username/ # Unique username claiming & validation
│   │   ├── user/[username]/ # Public user info & public vault items
│   │   └── vault/           # Private vault CRUD & visibility sync
│   ├── auth/                # Authentication pages
│   │   ├── login/           # User sign-in
│   │   ├── signup/          # User registration
│   │   ├── forgot-password/ # Request password reset email
│   │   └── reset-password/  # Enter new password with token
│   ├── create-username/     # Username selection view
│   ├── vault/               # Authenticated dashboard (createTodo, displayTodo)
│   ├── layout.js            # Root layout, fonts (Geist), toast container
│   └── page.js              # Landing page
├── components/              # Reusable UI components
├── lib/                     # Server and client configuration helpers
│   ├── auth.client.js       # Better Auth client instance (React hooks)
│   ├── auth.js              # Better Auth server instance & MongoDB adapter
│   ├── db.config.js         # Mongoose connection manager
│   └── email.js             # Nodemailer Gmail SMTP transport & email template
├── models/                  # Database models
│   └── vault.models.js      # Mongoose schema for vault items
├── proxy.js                 # Next.js 16 route proxy (edge protection)
├── .env                     # Local environment secrets
├── next.config.mjs          # Next.js build configuration
└── package.json             # NPM dependencies & scripts
```

---

## 5. API Routes Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `ALL` | `/api/auth/*` | Better Auth endpoints (sign-in, sign-up, sign-out, session, tokens) | Varies |
| `GET` | `/api/create-username?username=...` | Live debounced availability check | Yes |
| `POST` | `/api/create-username` | Claim and assign unique username to user document | Yes |
| `GET` | `/api/user/[username]` | Fetch public user profile and public vault items | No |
| `GET` | `/api/vault` | Retrieve all vault items for the authenticated user | Yes |
| `POST` | `/api/vault` | Create a new vault item | Yes |
| `PUT` | `/api/vault` | Update text content or `isPrivate` visibility | Yes |
| `DELETE`| `/api/vault?id=...` | Delete a vault item by ID | Yes |
| `POST` | `/api/vault/visibility` | Batch / beacon visibility sync on unmount | Yes |

---

## 6. Critical Technical Rules

1. **Next.js 16 Proxy Convention**:
   - `proxy.js` replaces `middleware.js`.
   - On Netlify, `proxy.js` bundles into an Edge Function.
   - **Never** import `mongodb`, `mongoose`, `lib/auth.js`, or native Node modules in `proxy.js`.
   - Use `getSessionCookie(request)` from `better-auth/cookies`.

2. **Database Connection in API Handlers**:
   - Always call `await connectDB()` from `@/lib/db.config` before executing queries with Mongoose models.
   - Use `auth.api.getSession({ headers: await headers() })` in API route handlers to verify identity.

3. **Email Dispatch**:
   - Always use `lib/email.js` for outbound emails.
   - Requires `SMTP_USER` and `SMTP_PASS` in environment variables.

---

## 7. Environment Variables (.env)

```env
MONGODB_URI=mongodb+srv://...
BETTER_AUTH_SECRET=your-better-auth-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
SMTP_USER=pankajk07414@gmail.com
SMTP_PASS=your-16-character-google-app-password
```

