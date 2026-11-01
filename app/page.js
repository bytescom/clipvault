import React from 'react';
import Link from 'next/link';
import { MdLock } from 'react-icons/md';

export default function Home() {
  return (
    <div className="min-h-dvh bg-[#4db8c8] font-sans selection:bg-black selection:text-white relative overflow-x-hidden">

      {/* Noise texture */}
      <div
        className="fixed inset-0 opacity-[0.05] pointer-events-none z-0"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")' }}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b-[3px] border-black flex items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="text-xl sm:text-2xl font-black text-black tracking-tighter flex items-center gap-1">
          <MdLock />
          CLIP<span className="text-[#ff5d5d]">VAULT</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/auth/login"
            className="px-3 sm:px-5 py-2 bg-white border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all font-black text-black text-xs sm:text-sm uppercase"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="px-3 sm:px-5 py-2 bg-[#45b6fe] border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all font-black text-black text-xs sm:text-sm uppercase"
          >
            Get Started →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 sm:pt-28 sm:pb-24">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f4d03f] border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-black text-black text-xs uppercase tracking-widest mb-8">
          🔒 Your private link vault
        </span>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-black tracking-tighter uppercase leading-none mb-6 max-w-3xl">
          Save. Organise.
          <br />
          <span className="text-white [text-shadow:3px_3px_0px_black]">Share.</span>
        </h1>
        <p className="text-black font-bold text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
          ClipVault lets you store all your important links and notes in one secure, beautifully organised place. Private by default. Shareable on demand.
        </p>

        {/* CTA buttons — stack full-width on phones for comfortable taps */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto">
          <Link
            href="/auth/signup"
            className="px-8 py-4 bg-[#ff5d5d] border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all font-black text-black text-base uppercase text-center"
          >
            Start for free →
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all font-black text-black text-base uppercase text-center"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t-[3px] border-black bg-white px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="text-xl font-black text-black tracking-tighter flex items-center gap-1">
          <MdLock />
          CLIP<span className="text-[#ff5d5d]">VAULT</span>
        </Link>
        <p className="text-black font-bold text-xs uppercase tracking-widest">
          © {new Date().getFullYear()} ClipVault. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="/auth/login" className="text-xs font-black text-black uppercase hover:underline">Login</Link>
          <Link href="/auth/signup" className="text-xs font-black text-black uppercase hover:underline">Sign Up</Link>
        </div>
      </footer>
    </div>
  );
}