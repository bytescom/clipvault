"use client"
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import CreateTodo from './createTodo'
import DisplayTodo from './displayTodo'
import { nanoid } from 'nanoid'
import { useSession, authClient } from '@/lib/auth.client'
import { useRouter } from 'next/navigation'
import { MdLock } from 'react-icons/md'
import { FiLogOut, FiUser } from 'react-icons/fi'
import toast from 'react-hot-toast'

const Vault = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [todos, setTodos] = useState("");
    const [allTodos, setAllTodos] = useState([]);
    const [editTodo, setEditTodo] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const allTodosRef = useRef([]);  // holds the latest allTodos so the unmount cleanup can read it
    const dirtyPrivacyRef = useRef(new Set()); // ids whose isPrivate changed but isn't flushed yet

    // Keep ref in sync with state so cleanup always has the latest
    useEffect(() => {
        allTodosRef.current = allTodos;
    }, [allTodos]);

    // Close dropdown on outside click
    useEffect(() => {

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);


    // Flush final isPrivate values for todos changed in this session to the DB
    useEffect(() => {
        // Capture the Set instance once — it's only mutated in place, never
        // replaced, so the cleanup below always sees the live contents.
        const dirtyPrivacy = dirtyPrivacyRef.current;

        return () => {
            // Only items whose privacy was actually toggled need flushing —
            // every other change is already persisted by its own POST/PUT.
            const snapshot = allTodosRef.current.filter((todo) =>
                dirtyPrivacy.has(todo.id)
            );

            snapshot.forEach((todo) => {
                const payload = JSON.stringify({ id: todo.id, isPrivate: todo.isPrivate ?? true });

                if (navigator.sendBeacon) {
                    const blob = new Blob([payload], { type: 'application/json' });
                    navigator.sendBeacon('/api/vault/visibility', blob);
                } else {
                    fetch('/api/vault/visibility', {
                        method: 'POST',
                        body: payload,
                        keepalive: true
                    }).catch(() => { });
                }
            });
        };
    }, []);

    // Apply guard
    useEffect(() => {
        if (session === null) router.push("/auth/login");
    }, [session, router]);

    const handleSignOut = async () => {
        await authClient.signOut();
        // Full navigation: router.push("/") races the session-null guard on
        // this page (which fires /auth/login mid-transition).
        window.location.href = "/";
    };

    useEffect(() => {
        const controller = new AbortController();

        const fetchTodos = async () => {
            try {
                const response = await fetch('/api/vault', { signal: controller.signal });
                if (response.ok) {
                    const data = await response.json();
                    setAllTodos(data);
                }
            } catch (error) {
                if (error.name === "AbortError") return;
                console.error("Failed to fetch todos", error);
            }
        };

        if (session) fetchTodos();

        return () => controller.abort();
    }, [session]);


    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (editTodo) {
            const previousTodos = allTodos;
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
                const response = await fetch('/api/vault', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: todoToUpdate.id, text: todoToUpdate.text })
                });

                if (!response.ok) throw new Error(`Update failed (${response.status})`);
            } catch (error) {
                console.error("Failed to update todo", error);
                // Optimistic edit failed server-side — restore the old text.
                setAllTodos(previousTodos);
                toast.error("Couldn't save your changes. Please try again.");
            }
            return;
        }

        let newTodo = {
            id: nanoid(),
            text: todos.trim(),
        };

        setAllTodos((prev) => [...prev, newTodo]);
        setTodos("");

        try {
            const response = await fetch('/api/vault', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodo)
            });

            if (!response.ok) throw new Error(`Create failed (${response.status})`);
        } catch (error) {
            console.error("Failed to create todo", error);
            // Optimistic add failed server-side — remove it so the UI doesn't
            // show an item that will vanish on the next reload.
            setAllTodos((prev) => prev.filter((t) => t.id !== newTodo.id));
            toast.error("Couldn't save the task. Please try again.");
        }
    }


    const handleDeleteTodo = async (id) => {
        const deletedTodo = allTodos.find((todo) => todo.id === id);
        setAllTodos((prev) => prev.filter((todo) => todo.id !== id));

        try {
            const response = await fetch(`/api/vault?id=${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`Delete failed (${response.status})`);
        } catch (error) {
            console.error("Failed to delete todo", error);
            // Restore the item — it still exists server-side.
            if (deletedTodo) setAllTodos((prev) => [...prev, deletedTodo]);
            toast.error("Couldn't delete the task. Please try again.");
        }
    }


    const handleEditTodo = (id) => {
        let todoToBeEdited = allTodos.find((todo) => todo.id === id)
        setTodos(todoToBeEdited.text)
        setEditTodo(id)
    }


    const handleTogglePrivate = async (id, currentIsPrivate) => {
        const newValue = !currentIsPrivate;

        // Optimistic update
        setAllTodos(prev => prev.map(t => t.id === id ? { ...t, isPrivate: newValue } : t));
        dirtyPrivacyRef.current.add(id);

        try {
            const response = await fetch('/api/vault', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isPrivate: newValue })
            });

            if (!response.ok) throw new Error(`Update failed (${response.status})`);
        } catch (error) {
            console.error("Failed to update privacy", error);

            // Revert on failure
            setAllTodos(prev => prev.map(t => t.id === id ? { ...t, isPrivate: currentIsPrivate } : t));
            toast.error("Couldn't update visibility. Please try again.");
        }
    }


    const handleShare = async (todo) => {
        const shareText = todo.text;

        if (navigator.share) {
            try {
                await navigator.share({ title: 'Vault Task', text: shareText });
            } catch (_) { /* user cancelled */ }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(shareText);
                toast.success('Copied to clipboard (sharing not supported in this browser).');
            } catch (error) {
                console.error("Clipboard write failed", error);
                toast.error("Couldn't copy to clipboard.");
            }
        }
    }

    return (
        <main className="min-h-dvh bg-[#4db8c8] flex flex-col items-center font-sans selection:bg-black selection:text-white relative">
            {/* Background Noise Texture */}
            <div className="fixed inset-0 opacity-[0.06] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 w-full bg-white border-b-[3px] border-black flex items-center justify-between px-3 sm:px-6 py-3">
                {/* Logo */}
                <Link href="/" className="text-lg sm:text-2xl font-black text-black tracking-tighter flex items-center">
                    <MdLock />
                    CLIP<span className="text-[#ff5d5d]">VAULT</span>
                </Link>

                {/* Profile avatar + dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(prev => !prev)}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black text-white font-black text-sm flex items-center justify-center border-[2px] border-black hover:scale-105 transition-transform cursor-pointer"
                        title={session?.user?.name || "Profile"}
                    >
                        {session?.user?.name?.[0]?.toUpperCase() ?? <FiUser />}
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden z-50">
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
                <header className="mb-8 sm:mb-10 text-center">
                    <h1 className="text-3xl sm:text-4xl text-black tracking-tighter uppercase inline-block pb-1 font-bold">
                        CLIP<span className="text-[#ff5d5d]">VAULT</span>
                    </h1>
                    <p className="text-black font-bold text-sm mt-4">
                        Hi, @{session?.user?.username || 'User'} — Keep track of all your text and links in one place 🔗
                    </p>
                </header>

                <CreateTodo
                    todos={todos}
                    setTodos={setTodos}
                    handleAddTodo={handleAddTodo}
                    editTodo={editTodo}
                />

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
