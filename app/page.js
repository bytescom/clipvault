import React from 'react';
import Link from 'next/link';
import { FaTwitter, FaInstagram, FaTiktok, FaYoutube, FaSpotify, FaCheckCircle } from 'react-icons/fa';

const NeoLinkBox = ({ title, color, icon }) => (
  <a 
    href="#" 
    target="_blank" 
    rel="noopener noreferrer" 
    className={`relative w-full flex items-center justify-center py-3.5 px-4 sm:px-6 border-[3px] border-black ${color} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all font-black text-black text-[15px] sm:text-[17px] group`}
  >
    <span>{title}</span> <span className="ml-2 text-xl">{icon}</span>
    
    <div className="absolute right-4 flex items-center justify-center p-2 rounded-md hover:bg-black/10 transition-colors" title="Copy Link">
      <svg className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    </div>
  </a>
);

const App = () => {
  return (
    <div className="min-h-screen bg-[#4db8c8] flex justify-center p-4 sm:p-8 font-sans selection:bg-black selection:text-white relative">
      {/* Background Noise Texture */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      
      {/* Main Container */}
      <div className="w-full max-w-3xl bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex flex-col items-center pt-8 pb-12 px-6 sm:px-8 relative z-10">
        
        {/* Top Navigation Row */}
        <div className="w-full flex items-center justify-between gap-3 mb-6">
          {/* Logo */}
          <Link href="/" className="text-3xl font-black text-black tracking-tighter italic">
            CLIP<span className="text-[#ff5d5d]">VAULT</span>
          </Link>

          {/* Auth Navigation */}
          <div className="flex gap-3">
            <Link href="/auth/login" className="hidden sm:inline-block px-5 py-2 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-black text-black text-sm uppercase">Login</Link>
            <Link href="/auth/signup" className="px-5 py-2 bg-[#45b6fe] border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-black text-black text-sm uppercase">Sign Up</Link>
          </div>
        </div>

 \98       {/* Profile Image */}
        <div className="relative mb-4">
          <img 
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f4d03f" 
            alt="Profile" 
            className="w-28 h-28 rounded-full border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] object-cover bg-[#f4d03f]"
          />
        </div>

        {/* Name & Badge */}
        <div className="flex items-center gap-1.5 mb-1">
          <h1 className="text-xl font-black text-black">NB Zachariah</h1>
          <FaCheckCircle className="text-[#1da1f2] text-lg" />
        </div>

        {/* Bio */}
        <p className="text-black font-bold text-sm mb-6">
          playing around figma 👨🏻‍🎨
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-5 mb-8">
          <a href="#" className="text-black hover:-translate-y-1 hover:scale-110 transition-all"><FaTwitter className="text-[22px]" /></a>
          <a href="#" className="text-black hover:-translate-y-1 hover:scale-110 transition-all"><FaInstagram className="text-[22px]" /></a>
          <a href="#" className="text-black hover:-translate-y-1 hover:scale-110 transition-all"><FaTiktok className="text-[22px]" /></a>
          <a href="#" className="text-black hover:-translate-y-1 hover:scale-110 transition-all"><FaYoutube className="text-[22px]" /></a>
          <a href="#" className="text-black hover:-translate-y-1 hover:scale-110 transition-all"><FaSpotify className="text-[22px]" /></a>
        </div>

        {/* Links */}
        <div className="w-full flex flex-col gap-5 mt-4">
          <NeoLinkBox title="Buy Me A Coffee" color="bg-[#ff5d5d]" icon="☕" />
          <NeoLinkBox title="Join My Newsletter" color="bg-[#45b6fe]" icon="📰" />
          <NeoLinkBox title="Learn Figma" color="bg-[#c87bff]" icon="🖋" />
          <NeoLinkBox title="New Designs OUT!" color="bg-[#ff9e5e]" icon="🚀" />
          <NeoLinkBox title="Book 1-on-1 w/ me!" color="bg-[#00ff7f]" icon="📅" />
        </div>

        {/* Footer Logo */}
        <div className="mt-8 flex flex-col items-center">
          <div className="font-black text-black text-2xl leading-none tracking-tighter text-center">
            CLIP.<br/>VAULT
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;