"use client"
import React from 'react'

const DisplayTodo = ({ allTodos, handleDeleteTodo, handleEditTodo }) => {
    const colors = ["bg-[#ff5d5d]", "bg-[#45b6fe]", "bg-[#c87bff]", "bg-[#ff9e5e]", "bg-[#00ff7f]", "bg-[#f4d03f]"];

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
                        return (
                            <li
                                key={todo.id}
                                className={`relative w-full flex items-center justify-between py-3.5 px-4 sm:px-6 border-[3px] border-black ${color} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all group`}
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

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDeleteTodo(todo.id)}
                                        className="flex items-center justify-center w-9 h-9 rounded-sm border-[2px] border-transparent hover:border-black hover:bg-white/30 transition-all cursor-pointer"
                                        title="Delete task"
                                    >
                                        <svg className="w-[18px] h-[18px] hover:scale-110 transition-transform" fill="none" stroke="black" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
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