"use client"
import React, { useState, useEffect, useRef } from 'react'
import CreateTodo from './createTodo'
import DisplayTodo from './displayTodo'
import { nanoid } from 'nanoid'
import { useSession, authClient } from '@/lib/auth.client'
import { useRouter } from 'next/navigation'
import { MdLock } from 'react-icons/md'
import { FiLogOut, FiUser } from 'react-icons/fi'

const Vault = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [todos, setTodos] = useState("");
    const [allTodos, setAllTodos] = useState([]);
    const [editTodo, setEditTodo] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/auth/login");
    };

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch('/api/vault');
                if (response.ok) {
                    const data = await response.json();
                    setAllTodos(data);
                }
            } catch (error) {
                console.error("Failed to fetch todos", error);
            }
        };

        if (session) fetchTodos();
    }, [session]);


    const handleAddTodo = async (e) => {
        e.preventDefault();

        if (editTodo) {
            let updateTodo = allTodos.map((ele) => {
                if (ele.id === editTodo) {
                    return { ...ele, text: todos.trim() }
                }
                return ele
            })

            setAllTodos(updateTodo);
            const todoToUpdate = updateTodo.find(t => t.id === editTodo);
            setTodos("");
            setEditTodo(null);

            try {
                await fetch('/api/vault', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(todoToUpdate)
                });
            } catch (error) {
                console.error("Failed to update todo", error);
            }
            return;
        }

        let newTodo = {
            id: nanoid(),
            text: todos,
        };

        let existingTodos = [...allTodos, newTodo];
        setAllTodos(existingTodos);
        setTodos("");

        try {
            await fetch('/api/vault', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodo)
            });
        } catch (error) {
            console.error("Failed to create todo", error);
        }
    }


    const handleDeleteTodo = async (id) => {
        let updatedTodo = allTodos.filter((todo) => todo.id !== id)
        setAllTodos(updatedTodo);

        try {
            await fetch(`/api/vault?id=${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error("Failed to delete todo", error);
        }
    }


    const handleEditTodo = (id) => {
        let todoToBeEdited = allTodos.find((todo) => todo.id === id)
        setTodos(todoToBeEdited.text)
        setEditTodo(id)
    }

    return (
        <main className="min-h-screen bg-[#4db8c8] flex flex-col items-center font-sans selection:bg-black selection:text-white relative">
            {/* Background Noise Texture */}
            <div className="fixed inset-0 opacity-[0.06] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 w-full bg-white border-b-[3px] border-black flex items-center justify-between px-6 py-3">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <MdLock className="text-2xl text-black" />
                    <span className="font-black text-xl uppercase tracking-tight text-black">Vault</span>
                </div>

                {/* Profile avatar + dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(prev => !prev)}
                        className="w-10 h-10 rounded-full bg-black text-white font-black text-sm flex items-center justify-center border-[2px] border-black hover:scale-105 transition-transform cursor-pointer"
                        title={session?.user?.name || "Profile"}
                    >
                        {session?.user?.name?.[0]?.toUpperCase() ?? <FiUser />}
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden z-50">
                            <div className="px-4 py-3 border-b-[2px] border-black">
                                <p className="font-black text-black text-sm truncate">{session?.user?.name}</p>
                                <p className="text-xs text-gray-500 font-bold truncate">{session?.user?.email}</p>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-black text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                                <FiLogOut />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* ── Content ── */}
            <div className="w-full max-w-3xl bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex flex-col p-6 sm:p-10 relative z-10 mt-10 mb-20 mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-black tracking-tight uppercase inline-block border-b-4 border-black pb-1">My Vault</h1>
                    <p className="text-black font-bold text-sm mt-4 uppercase">Keep track of your tasks and goals 🚀</p>
                </header>

                <CreateTodo todos={todos} setTodos={setTodos} handleAddTodo={handleAddTodo} editTodo={editTodo} />
                <DisplayTodo allTodos={allTodos} handleDeleteTodo={handleDeleteTodo} handleEditTodo={handleEditTodo} />
            </div>
        </main>
    )
}

export default Vault
