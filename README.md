# 🔒 ClipVault (v1.0 Launched! 🚀)

**Save. Organise. Share.**

ClipVault is your private link vault. It lets you store all your important links and notes in one secure, beautifully organised place. Private by default. Shareable on demand.

## Features ✨
- **Neobrutalist Design:** A stunning, highly interactive, and responsive user interface.
- **Private by Default:** All your saved links and notes are hidden from the public unless you explicitly choose to share them.
- **Public Profile:** A clean "Link-in-Bio" style page for your public links (`/[username]`).
- **Secure Authentication:** Powered by `better-auth` for seamless and secure sign-ups and logins.

## Tech Stack 🛠️
- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **Styling:** Tailwind CSS (Custom Neobrutalist theme)
- **Database:** MongoDB (Mongoose)
- **Authentication:** Better-Auth

## Getting Started 💻

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd mylinks
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   BETTER_AUTH_SECRET=your_random_secret_string
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   BETTER_AUTH_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment 🚀
When deploying to production (e.g., Vercel), remember to update your environment variables:
- `NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_URL` must be set to your live production domain (e.g., `https://clipvault.vercel.app`).
- Ensure your MongoDB database allows connections from your hosting provider (whitelist `0.0.0.0/0` in MongoDB Atlas if using Vercel).

---
*Built with ❤️ for Version 1.0 Launch.*
