# Rule: Authentication & Email Conventions

## Context
ClipVault uses **Better Auth** with the native MongoDB adapter and **Nodemailer** for Gmail SMTP email dispatch.

## Requirements
1. **Server Auth Instance (`lib/auth.js`)**:
   - Only import this inside Route Handlers (`app/api/...`) or Node.js server environments.
   - Do not import into Edge code or client components.
2. **Client Auth Instance (`lib/auth.client.js`)**:
   - Use in `"use client"` components for hooks like `useSession()`, `authClient.signIn`, `authClient.signUp`, and `authClient.signOut`.
3. **Password Reset Email (`lib/email.js`)**:
   - Handled via `sendPasswordResetEmail({ to, url })`.
   - Uses `SMTP_USER` and `SMTP_PASS` from environment variables.
   - Strips whitespace automatically from Google App Passwords (`pass.replace(/\s+/g, "")`).
   - If credentials are not set in `.env`, it falls back to `console.warn` with the reset URL so local development is never blocked.
4. **Mongoose Database Access**:
   - Route handlers that query Mongoose models (like `Vault` from `models/vault.models.js`) must call `await connectDB()` from `lib/db.config.js` prior to executing queries.

