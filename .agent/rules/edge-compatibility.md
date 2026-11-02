# Rule: Edge Runtime Compatibility (Next.js 16 & Netlify)

## Context
In Next.js 16, `middleware.js` was renamed to `proxy.js`. When deploying to Netlify using `@netlify/plugin-nextjs`, `proxy.js` is bundled into a Netlify Edge Function (`___netlify-edge-handler-node-middleware`) executed in a V8/Deno-based edge runtime.

## Requirements
1. **Never import heavy Node.js CJS drivers or native modules into `proxy.js`**:
   - `mongodb`
   - `mongoose`
   - `lib/auth.js` (which instantiates `MongoClient`)
   - Native Node APIs (`net`, `tls`, `dns`, `fs`, `crypto`)
2. **Session verification in `proxy.js`**:
   - Always use `getSessionCookie(request)` from `better-auth/cookies`.
   - It parses incoming request cookies without making database or network calls:
     ```javascript
     import { NextResponse } from "next/server";
     import { getSessionCookie } from "better-auth/cookies";

     export function proxy(request) {
         const sessionCookie = getSessionCookie(request);
         if (!sessionCookie) {
             return NextResponse.redirect(new URL("/auth/login", request.url));
         }
         return NextResponse.next();
     }
     ```
3. **Database validation**:
   - Perform full cryptographic and database session validation inside Server Actions, Server Components, and Route Handlers (`app/api/...`), where the standard Node.js runtime is active.

