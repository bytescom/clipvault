"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';
import { MdLock } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiShare2, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';

const TodoMenu = ({ todo, onShare, isOpen, onOpenChange }) => {
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
        className="flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-sm border-[2px] border-transparent hover:border-black hover:bg-white/30 transition-all cursor-pointer"
        title="Options"
        aria-label="Item options"
      >
        <BsThreeDotsVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none z-50 overflow-hidden">
          {/* Copy — mobile only; desktop shows the inline icon instead */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(todo.text)
                .then(() => toast.success("Copied to clipboard!"))
                .catch(() => toast.error("Couldn't copy to clipboard."));
              onOpenChange(null);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-3 sm:py-2.5 text-[13px] font-black text-black hover:bg-black hover:text-white transition-colors cursor-pointer sm:hidden"
          >
            <FiCopy className="flex-shrink-0" size={16} />
            Copy
          </button>

          {/* Share */}
          <button
            onClick={() => { onShare(todo); onOpenChange(null); }}
            className="w-full flex items-center gap-2.5 px-3 py-3 sm:py-2.5 text-[13px] font-black text-black hover:bg-black hover:text-white transition-colors cursor-pointer border-t-[2px] border-black sm:border-t-0"
          >
            <FiShare2 className="flex-shrink-0" size={16} />
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
  const colors = ["bg-[#ff5d5d]", "bg-[#45b6fe]", "bg-[#c87bff]", "bg-[#ff9e5e]", "bg-[#00ff7f]", "bg-[#f4d03f]"];


  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/user/${username}`, {
          signal: controller.signal
        });
        if (!res.ok) {
          throw new Error('User not found');
        }
        const data = await res.json();

        const publicOnly = data.filter(item => item.isPrivate === false);
        setPublicItems(publicOnly);

      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
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
      navigator.clipboard.writeText(todo.text)
        .then(() => toast.success("Copied to clipboard!"))
        .catch(() => toast.error("Couldn't copy to clipboard."));
    }
  };


  if (error) {
    return (
      <div className="min-h-dvh bg-[#4db8c8] flex items-center justify-center p-4">
        <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <h1 className="text-2xl font-black text-black">404 - {error}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#4db8c8] flex justify-center p-4 sm:p-8 font-sans selection:bg-black selection:text-white relative">
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
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none text-sm font-black text-black">
                        {index + 1}
                      </span>
                      {isUrl ? (
                        <a href={todo.text} target="_blank" rel="noopener noreferrer" className="text-black text-[15px] sm:text-[17px] font-black break-all pr-2 hover:underline min-w-0">
                          {todo.text}
                        </a>
                      ) : (
                        <span className="text-black text-[15px] sm:text-[17px] font-black break-all pr-2 min-w-0">
                          {todo.text}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Copy Button — inline on desktop; mobile uses the 3-dot menu */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(todo.text)
                            .then(() => toast.success("Copied to clipboard!"))
                            .catch(() => toast.error("Couldn't copy to clipboard."));
                        }}
                        className="hidden sm:flex items-center justify-center w-9 h-9 rounded-sm border-[2px] border-transparent hover:border-black hover:bg-white/30 transition-all cursor-pointer"
                        title="Copy item"
                      >
                        <FiCopy className="hover:scale-110 transition-transform" size={18} />
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