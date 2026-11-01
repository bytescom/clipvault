"use client"
import React, { useState, useRef, useEffect } from 'react'
import { FiCopy, FiEdit2, FiShare2, FiTrash2 } from 'react-icons/fi'
import { MdPublic, MdLock } from 'react-icons/md'
import { BsThreeDotsVertical } from 'react-icons/bs'
import toast from 'react-hot-toast'

const TodoMenu = ({ todo, onDelete, onEdit, onTogglePrivate, onShare, isOpen, onOpenChange }) => {
    const menuRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        if (!isOpen) return;

        const handler = (e) => {
            let menuCheck = menuRef.current && !menuRef.current.contains(e.target)
            if (menuCheck) {
                onOpenChange(null);
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        }

    }, [isOpen, onOpenChange]);

    return (
        <div className="relative flex-shrink-0" ref={menuRef}>
            {/* 3-dot trigger — 40px on touch screens, 36px once a pointer is fine */}
            <button
                onClick={() => onOpenChange(isOpen ? null : todo.id)}
                className="flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-sm border-[2px] border-transparent hover:border-black hover:bg-white/30 transition-all cursor-pointer"
                title="Options"
                aria-label="Todo options"
            >
                <BsThreeDotsVertical size={18} />
            </button>

            {/* Dropdown */}
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

                    {/* Edit — mobile only; desktop shows the inline icon instead */}
                    <button
                        onClick={() => { onEdit(todo.id); onOpenChange(null); }}
                        className="w-full flex items-center gap-2.5 px-3 py-3 sm:py-2.5 text-[13px] font-black text-black hover:bg-black hover:text-white transition-colors cursor-pointer border-t-[2px] border-black sm:border-t-0 sm:hidden"
                    >
                        <FiEdit2 className="flex-shrink-0" size={16} />
                        Edit
                    </button>

                    {/* Toggle Private / Public */}
                    <button
                        onClick={() => { onTogglePrivate(todo.id, todo.isPrivate); onOpenChange(null); }}
                        className="w-full flex items-center gap-2.5 px-3 py-3 sm:py-2.5 text-[13px] font-black text-black hover:bg-black hover:text-white transition-colors cursor-pointer border-t-[2px] border-black sm:border-t-0"
                    >
                        {todo.isPrivate !== false ? (
                            <>
                                <MdPublic className="flex-shrink-0" size={16} />
                                Make Public
                            </>
                        ) : (
                            <>
                                <MdLock className="flex-shrink-0" size={16} />
                                Make Private
                            </>
                        )}
                    </button>

                    {/* Share */}
                    <button
                        onClick={() => { onShare(todo); onOpenChange(null); }}
                        className="w-full flex items-center gap-2.5 px-3 py-3 sm:py-2.5 text-[13px] font-black text-black hover:bg-black hover:text-white transition-colors cursor-pointer border-t-[2px] border-black"
                    >
                        <FiShare2 className="flex-shrink-0" size={16} />
                        Share
                    </button>

                    {/* Divider */}
                    <div className="border-t-[2px] border-black" />

                    {/* Delete */}
                    <button
                        onClick={() => { onDelete(todo.id); onOpenChange(null); }}
                        className="w-full flex items-center gap-2.5 px-3 py-3 sm:py-2.5 text-[13px] font-black text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                    >
                        <FiTrash2 className="flex-shrink-0" size={16} />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};


const DisplayTodo = ({ allTodos, handleDeleteTodo, handleEditTodo, handleTogglePrivate, handleShare }) => {
    const colors = ["bg-[#ff5d5d]", "bg-[#45b6fe]", "bg-[#c87bff]", "bg-[#ff9e5e]", "bg-[#00ff7f]", "bg-[#f4d03f]"];
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
                        // Only real links become anchors — plain-text notes stay text.
                        const isUrl = todo.text.startsWith('http://') || todo.text.startsWith('https://');
                        const itemContent = (
                            <>
                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none text-sm font-black text-black">
                                    {index + 1}
                                </span>
                                <span className="text-black text-[15px] sm:text-[17px] font-black break-all pr-2 min-w-0">
                                    {todo.text}
                                </span>
                            </>
                        );
                        return (
                            <li
                                key={todo.id}
                                className={`relative w-full flex items-center justify-between py-3.5 px-4 sm:px-6 border-[3px] border-black ${color} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all group ${openMenuId === todo.id ? 'z-[100]' : ''}`}
                            >
                                {isUrl ? (
                                    <a href={todo.text} target="_blank" rel="noopener noreferrer" className='cursor-pointer flex items-center gap-3 sm:gap-4 min-w-0 flex-1'>
                                        {itemContent}
                                    </a>
                                ) : (
                                    <div className='flex items-center gap-3 sm:gap-4 min-w-0 flex-1'>
                                        {itemContent}
                                    </div>
                                )}

                                <div className="flex items-center gap-1 flex-shrink-0">
                                    {/* Privacy badge — lock icon only */}
                                    {isPrivate && (
                                        <span
                                            title="Private"
                                            className="flex items-center justify-center w-7 h-7 border-[2px] border-black bg-white/80 select-none"
                                        >
                                            <MdLock size={14} />
                                        </span>
                                    )}

                                    {/* Copy Button — inline on desktop; mobile uses the 3-dot menu */}
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(todo.text)
                                                .then(() => toast.success("Copied to clipboard!"))
                                                .catch(() => toast.error("Couldn't copy to clipboard."));
                                        }}
                                        className="hidden sm:flex items-center justify-center w-9 h-9 rounded-sm border-[2px] border-transparent hover:border-black hover:bg-white/30 transition-all cursor-pointer"
                                        title="Copy task"
                                    >
                                        <FiCopy className="w-[18px] h-[18px] hover:scale-110 transition-transform" size={18} />
                                    </button>

                                    {/* Edit Button — inline on desktop; mobile uses the 3-dot menu */}
                                    <button
                                        onClick={() => handleEditTodo(todo.id)}
                                        className="hidden sm:flex items-center justify-center w-9 h-9 rounded-sm border-[2px] border-transparent hover:border-black hover:bg-white/30 transition-all cursor-pointer"
                                        title="Edit task"
                                    >
                                        <FiEdit2 className="hover:scale-110 transition-transform" size={18} />
                                    </button>

                                    {/* 3-dot context menu */}
                                    <TodoMenu
                                        todo={todo}
                                        onDelete={handleDeleteTodo}
                                        onEdit={handleEditTodo}
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