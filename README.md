This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


import React from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaEnvelope, FaMedium, FaRegFileAlt, FaSearch, FaMoon, FaChevronDown, FaCode } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Divider = () => (
  <div className="relative flex h-10 w-full before:absolute before:left-[-100vw] before:-z-10 before:h-10 before:w-[300vw] before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-[size:10px_10px] before:[--pattern-foreground:color-mix(in_oklab,var(--color-gray-700)_25%,transparent)] before:border-y before:border-gray-600/70">
  </div>
);

const ConnectButton = ({ icon, label }) => (
  <button className="flex items-center gap-2.5 bg-[#141414] hover:bg-[#1f1f1f] border border-gray-800/60 text-gray-300 py-1.5 px-4 rounded-full text-sm font-medium transition-colors cursor-pointer">
    {icon}
    <span>{label}</span>
  </button>
);

const LinkBox = ({ title, url, icon }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 sm:gap-5 p-4 sm:p-5 w-full bg-[#0a0a0a]/80 hover:bg-[#141414] border border-gray-800/80 rounded-sm transition-all duration-300 group hover:border-gray-600/60 hover:shadow-xl hover:shadow-black/50">
    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-sm bg-[#111] border border-gray-800/80 text-gray-400 group-hover:text-white group-hover:bg-[#1a1a1a] transition-all">
      {icon}
    </div>
    <div className="flex-1 text-left font-bold text-gray-200 group-hover:text-white transition-colors text-lg">{title}</div>
    <div className="flex-shrink-0 flex items-center gap-1">
      <div className="flex items-center justify-center w-10 h-10 rounded-sm bg-transparent text-gray-500 group-hover:text-white transition-all" title="Copy Link">
         <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
         </svg>
      </div>
      <div className="flex items-center justify-center w-10 h-10 rounded-sm bg-transparent text-gray-500 group-hover:text-white transition-all" title="Open Link">
         <svg className="w-5 h-5 group-hover:scale-110 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
         </svg>
      </div>
    </div>
  </a>
);

const App = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden flex justify-center">
      
      {/* Central Column with Vertical Borders */}
      <div className="w-full max-w-2xl border-x border-gray-600/70 flex flex-col relative z-0 min-h-screen">
        
        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-md">
          <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-center">
            <Link href="/" className="text-xl font-bold text-gray-200 tracking-wide hover:text-white transition-colors">
              ClipVault
            </Link>
          </div>
        </nav>

        <Divider />

        {/* Linktree Bio Section */}
        <main className="w-full px-4 sm:px-6 py-10 flex-1">
          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            <LinkBox 
              title="Check out my open source contributions" 
              url="https://github.com" 
              icon={<FaGithub className="text-[17px]" />} 
            />
            <LinkBox 
              title="Connect with me professionally" 
              url="https://linkedin.com" 
              icon={<FaLinkedin className="text-[17px]" />} 
            />
            <LinkBox 
              title="Follow me for tech thoughts" 
              url="https://twitter.com" 
              icon={<FaXTwitter className="text-[17px]" />} 
            />
            <LinkBox 
              title="Read my latest blog posts" 
              url="https://medium.com" 
              icon={<FaMedium className="text-[17px]" />} 
            />
            <LinkBox 
              title="Download my Resume" 
              url="#" 
              icon={<FaRegFileAlt className="text-[17px]" />} 
            />
          </div>
        </main>

        <Divider />
        
        {/* Footer */}
        <footer className="w-full px-4 py-8 flex items-center justify-center">
          <p className="text-sm text-gray-500 font-medium">© {new Date().getFullYear()} mylinks</p>
        </footer>

      </div>
    </div>
  )
}

export default App;