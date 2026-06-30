"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';
import { MdLock } from 'react-icons/md';

const TodoMenu = ({ todo, onDelete, onShare, isOpen, onOpenChange }) => {
    const menuRef = React.useRef(null);

    React.useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onOpenChange(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen, onOpenChange]);

    return (
        <div className="relative flex-shrink-0" ref={menuRef}>
            <button
                onClick={() => onOpenChange(isOpen ? null : todo.id)}
                className="flex items-center justify-center w-9 h-9 rounded-sm border-[2px] border-transparent hover:border-black hover:bg-white/30 transition-all cursor-pointer"
                title="Options"
            >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="black">
                    <circle cx="12" cy="5"  r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none z-50 overflow-hidden">
                    {/* Share */}
                    <button
                        onClick={() => { onShare(todo); onOpenChange(null); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-black text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                    </button>
                </div>
            )}
        </div>
    );
};

export default function UsernamePage({ params }) {
  const { username } = React.use(params);
  
  const [publicItems, setPublicItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/user/${username}`);
        if (!res.ok) {
          throw new Error('User not found');
        }
        const data = await res.json();
        const publicOnly = data.filter(item => item.isPrivate === false);
        setPublicItems(publicOnly);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [username]);

  const handleShare = async (todo) => {
    const isUrl = todo.text.startsWith('http://') || todo.text.startsWith('https://');
    const shareData = isUrl ? { url: todo.text } : { text: todo.text };
    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            console.log("Sharing failed", error);
        }
    } else {
        navigator.clipboard.writeText(todo.text);
        alert("Copied to clipboard!");
    }
  };

  const colors = ["bg-[#ff5d5d]", "bg-[#45b6fe]", "bg-[#c87bff]", "bg-[#ff9e5e]", "bg-[#00ff7f]", "bg-[#f4d03f]"];

  if (error) {
    return (
      <div className="min-h-screen bg-[#4db8c8] flex items-center justify-center p-4">
        <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <h1 className="text-2xl font-black text-black">404 - {error}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4db8c8] flex justify-center p-4 sm:p-8 font-sans selection:bg-black selection:text-white relative">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      
      <div className="w-full max-w-3xl bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex flex-col items-center pt-8 pb-12 px-6 sm:px-8 relative z-10 my-auto min-h-[500px]">
        <div className="w-full flex items-center justify-center gap-3 mb-10">
          <Link href="/" className="text-2xl sm:text-3xl font-black text-black tracking-tighter flex items-center gap-1 hover:scale-105 transition-transform">
            <MdLock className="hidden sm:block" />
            CLIP<span className="text-[#ff5d5d]">VAULT</span>
          </Link>
        </div>

        <div className="relative mb-4">
          <img 
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${username}&backgroundColor=f4d03f`} 
            alt={username} 
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] object-cover bg-[#f4d03f]"
          />
        </div>

        <div className="flex items-center gap-1.5 mb-8">
          <h2 className="text-xl font-black text-black">@{username}</h2>
          <FaCheckCircle className="text-[#45b6fe] text-lg" />
        </div>

        <div className="w-full flex flex-col mt-2">
          {loading ? (
            <div className="text-center py-8 px-4 font-black">Loading...</div>
          ) : publicItems.length === 0 ? (
            <div className="text-center py-8 px-4 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-black text-[15px] font-black">
                    @{username} has no public items yet.
                </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
                {publicItems.map((todo, index) => {
                    const color = colors[index % colors.length];
                    const isUrl = todo.text.startsWith('http://') || todo.text.startsWith('https://');
                    
                    return (
                        <li
                            key={todo.id}
                            className={`relative w-full flex items-center justify-between py-3.5 px-4 sm:px-6 border-[3px] border-black ${color} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all group ${openMenuId === todo.id ? 'z-[100]' : ''}`}
                        >
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none text-sm font-black text-black">
                                    {index + 1}
                                </span>
                                {isUrl ? (
                                    <a href={todo.text} target="_blank" rel="noopener noreferrer" className="text-black text-[15px] sm:text-[17px] font-black break-all pr-2 hover:underline">
                                        {todo.text}
                                    </a>
                                ) : (
                                    <span className="text-black text-[15px] sm:text-[17px] font-black break-all pr-2">
                                        {todo.text}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-1 flex-shrink-0">
                                {/* Copy Button */}
                                <button
                                    onClick={() => { navigator.clipboard.writeText(todo.text); alert("Copied to clipboard!"); }}
                                    className="flex items-center justify-center w-9 h-9 rounded-sm border-[2px] border-transparent hover:border-black hover:bg-white/30 transition-all cursor-pointer"
                                    title="Copy task"
                                >
                                    <svg className="w-[18px] h-[18px] hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="black">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>

                                {/* 3-dot context menu */}
                                <TodoMenu
                                    todo={todo}
                                    onShare={handleShare}
                                    isOpen={openMenuId === todo.id}
                                    onOpenChange={setOpenMenuId}
                                />
                            </div>
                        </li>
                    )
                })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}