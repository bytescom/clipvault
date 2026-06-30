"use client"
import React, { useState, useRef, useEffect } from 'react'

// Per-todo 3-dot context menu
// openMenuId / setOpenMenuId are lifted to the parent so the active <li>
// can receive a higher z-index and paint above its siblings.
const TodoMenu = ({ todo, onDelete, onTogglePrivate, onShare, isOpen, onOpenChange }) => {
    const menuRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
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
            {/* 3-dot trigger */}
            <button
                onClick={() => onOpenChange(isOpen ? null : todo.id)}
                className="flex items-center justify-center w-9 h-9 rounded-sm border-[2px] border-transparent hover:border-black hover:bg-white/30 transition-all cursor-pointer"
                title="Options"
                aria-label="Todo options"
            >
                {/* Vertical three dots */}
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="black">
                    <circle cx="12" cy="5"  r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none z-50 overflow-hidden">

                    {/* Toggle Private / Public */}
                    <button
                        onClick={() => { onTogglePrivate(todo.id, todo.isPrivate); onOpenChange(null); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-black text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                        {todo.isPrivate !== false ? (
                            <>
                                {/* Lock → Globe (make public) */}
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Make Public
                            </>
                        ) : (
                            <>
                                {/* Globe → Lock (make private) */}
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Make Private
                            </>
                        )}
                    </button>

                    {/* Share */}
                    <button
                        onClick={() => { onShare(todo); onOpenChange(null); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-black text-black hover:bg-black hover:text-white transition-colors cursor-pointer border-t-[2px] border-black"
                    >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                    </button>

                    {/* Divider */}
                    <div className="border-t-[2px] border-black" />

                    {/* Delete */}
                    <button
                        onClick={() => { onDelete(todo.id); onOpenChange(null); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-black text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};


const DisplayTodo = ({ allTodos, handleDeleteTodo, handleEditTodo, handleTogglePrivate, handleShare }) => {
    const colors = ["bg-[#ff5d5d]", "bg-[#45b6fe]", "bg-[#c87bff]", "bg-[#ff9e5e]", "bg-[#00ff7f]", "bg-[#f4d03f]"];
    // Track which todo's menu is open. Lifted here so the active <li> can
    // receive z-[100] and paint above siblings (CSS transforms create stacking contexts).
    const [openMenuId, setOpenMenuId] = useState(null);

    return (
        <div className="w-full mt-6">
            {allTodos?.length === 0 ? (
                <div className="text-center py-10 px-4 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none">
                    <p className="text-black text-[17px] font-black">
                        No tasks yet. Add one above!
                    </p>
                </div>
            ) : (
                <ul className="flex flex-col gap-5">
                    {allTodos.map((todo, index) => {
                        const color = colors[index % colors.length];
                        const isPrivate = todo.isPrivate !== false; // default true
                        return (
                            <li
                                key={todo.id}
                                className={`relative w-full flex items-center justify-between py-3.5 px-4 sm:px-6 border-[3px] border-black ${color} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all group ${openMenuId === todo.id ? 'z-[100]' : ''}`}
                            >
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none text-sm font-black text-black">
                                        {index + 1}
                                    </span>
                                    <span className="text-black text-[15px] sm:text-[17px] font-black break-all pr-2">
                                        {todo.text}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 flex-shrink-0">
                                    {/* Privacy badge — lock icon only */}
                                    {isPrivate && (
                                        <span
                                            title="Private"
                                            className="flex items-center justify-center w-7 h-7 border-[2px] border-black bg-white/80 select-none"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="black" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </span>
                                    )}

                                    {/* Copy Button */}
                                    <button
                                        onClick={() => navigator.clipboard.writeText(todo.text)}
                                        className="flex items-center justify-center w-9 h-9 rounded-sm border-[2px] border-transparent hover:border-black hover:bg-white/30 transition-all cursor-pointer"
                                        title="Copy task"
                                    >
                                        <svg className="w-[18px] h-[18px] hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="black">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>

                                    {/* Edit Button */}
                                    <button
                                        onClick={() => handleEditTodo(todo.id)}
                                        className="flex items-center justify-center w-9 h-9 rounded-sm border-[2px] border-transparent hover:border-black hover:bg-white/30 transition-all cursor-pointer"
                                        title="Edit task"
                                    >
                                        <svg className="w-[18px] h-[18px] hover:scale-110 transition-transform" fill="none" stroke="black" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>

                                    {/* 3-dot context menu */}
                                    <TodoMenu
                                        todo={todo}
                                        onDelete={handleDeleteTodo}
                                        onTogglePrivate={handleTogglePrivate}
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
    )
}

export default DisplayTodo;