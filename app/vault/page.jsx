"use client"
import React, { useState, useEffect, useRef } from 'react'
import CreateTodo from './createTodo'
import DisplayTodo from './displayTodo'
import { nanoid } from 'nanoid'
import { useSession, authClient } from '@/lib/auth.client'
import { useRouter } from 'next/navigation'
import { MdLock } from 'react-icons/md'
import { FiLogOut, FiUser } from 'react-icons/fi'
import Link from 'next/link'

const Vault = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [todos, setTodos] = useState("");
    const [allTodos, setAllTodos] = useState([]);
    const [editTodo, setEditTodo] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    // Always holds the latest allTodos so the unmount cleanup can read it
    const allTodosRef = useRef([]);

    // Keep ref in sync with state so cleanup always has the latest snapshot
    useEffect(() => { allTodosRef.current = allTodos; }, [allTodos]);

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

    // On unmount: flush final isPrivate values for all todos to the DB
    useEffect(() => {

        return () => {
            const snapshot = allTodosRef.current;
            if (!snapshot.length) return;
            snapshot.forEach((todo) => {
                const payload = JSON.stringify({ id: todo.id, isPrivate: todo.isPrivate ?? true });
                // sendBeacon is fire-and-forget and survives page unload
                if (navigator.sendBeacon) {
                    const blob = new Blob([payload], { type: 'application/json' });
                    navigator.sendBeacon('/api/vault/visibility', blob);
                } else {
                    fetch('/api/vault', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: payload,
                        keepalive: true
                    }).catch(() => {});
                }
            });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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


    const handleTogglePrivate = async (id, currentIsPrivate) => {
        const newValue = currentIsPrivate === false ? true : false; // toggle (default is private=true)
        // Optimistic update
        setAllTodos(prev => prev.map(t => t.id === id ? { ...t, isPrivate: newValue } : t));

        try {
            await fetch('/api/vault', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isPrivate: newValue })
            });
        } catch (error) {
            console.error("Failed to update privacy", error);
            // Revert on failure
            setAllTodos(prev => prev.map(t => t.id === id ? { ...t, isPrivate: currentIsPrivate } : t));
        }
    }


    const handleShare = async (todo) => {
        const shareText = todo.text;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Vault Task', text: shareText });
            } catch (_) { /* user cancelled */ }
        } else {
            // Fallback: copy link to clipboard
            await navigator.clipboard.writeText(shareText);
            alert('Copied to clipboard (sharing not supported in this browser).');
        }
    }

    return (
        <main className="min-h-screen bg-[#4db8c8] flex flex-col items-center font-sans selection:bg-black selection:text-white relative">
            {/* Background Noise Texture */}
            <div className="fixed inset-0 opacity-[0.06] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 w-full bg-white border-b-[3px] border-black flex items-center justify-between px-6 py-3">
                {/* Logo */}
                <Link href="/" className="text-2xl font-black text-black tracking-tighter flex items-center">
                    <MdLock/>
                    CLIP<span className="text-[#ff5d5d]">VAULT</span>
                </Link>

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
            <div className="w-[calc(100%-2rem)] sm:w-full max-w-3xl bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex flex-col p-6 sm:p-10 relative z-10 mt-6 sm:mt-10 mb-20 mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl text-black tracking-tighter uppercase inline-block pb-1 font-bold">
                        CLIP<span className="text-[#ff5d5d]">VAULT</span>
                    </h1>
                    <p className="text-black font-bold text-sm mt-4 uppercase">Keep track of all your text and links in one place 🔗</p>
                </header>

                <CreateTodo todos={todos} setTodos={setTodos} handleAddTodo={handleAddTodo} editTodo={editTodo} />
                <DisplayTodo
                    allTodos={allTodos}
                    handleDeleteTodo={handleDeleteTodo}
                    handleEditTodo={handleEditTodo}
                    handleTogglePrivate={handleTogglePrivate}
                    handleShare={handleShare}
                />
            </div>
        </main>
    )
}

export default Vault
