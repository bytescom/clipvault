"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

const CreateUsername = () => {
    const [username, setUsername]         = useState("");
    const [takenUsernames, setTakenUsernames] = useState([]);
    const [status, setStatus]             = useState(null); // null | "available" | "taken" | "invalid"
    const router = useRouter();

    // Fetch all existing usernames once on mount
    useEffect(() => {
        async function getUsernames() {
            try {
                const response = await fetch("/api/create-username", { method: "GET" });
                if (!response.ok) throw new Error("Failed to fetch usernames");
                const data = await response.json();
                // Normalize to lowercase so comparison is case-insensitive
                setTakenUsernames((data.usernames ?? []).map(u => u.toLowerCase()));
            } catch (err) {
                console.error("Could not load usernames:", err);
            }
        }
        getUsernames();
    }, []);

    // Live availability check — only after 3+ chars are typed
    useEffect(() => {
        if (!username) { setStatus(null); return; }
        if (!USERNAME_REGEX.test(username)) { setStatus("invalid"); return; }
        if (username.length < 3) { setStatus(null); return; } // wait for more input
        if (takenUsernames.includes(username.toLowerCase())) {
            setStatus("taken");
        } else {
            setStatus("available");
        }
    }, [username, takenUsernames]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (status !== "available") return;

        const response = await fetch("/api/create-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();

        if (!response.ok) {
            toast.error(data.message || "Failed to save username.");
            return;
        }

        toast.success("Username created!");
        router.push("/vault");
    }

    return (
        <div className="min-h-screen bg-[#4db8c8] flex justify-center p-4 sm:p-8 font-sans selection:bg-black selection:text-white relative items-center">
            {/* Background Noise Texture */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            <div className="w-full max-w-md bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex flex-col p-8 relative z-10">
                <h2 className="text-3xl font-black text-black mb-6 text-center tracking-tighter uppercase">Create Username</h2>
                <p className="text-black font-bold mb-6 text-center">Pick a unique username for your profile link.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-sm font-black text-black mb-2 uppercase">Username</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-500">clipvault.com/</span>
                            <input
                                type="text"
                                name='username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-[135px] pr-4 py-3 border-[3px] border-black text-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder-gray-400"
                                placeholder="yourname"
                                required
                                pattern="[a-zA-Z0-9_-]+"
                                title="Only letters, numbers, underscores, and dashes are allowed."
                            />
                        </div>

                        {/* Availability feedback */}
                        {status === "available" && (
                            <p className="mt-2 text-sm font-bold text-green-600">✅ @{username} is available!</p>
                        )}
                        {status === "taken" && (
                            <p className="mt-2 text-sm font-bold text-red-500">❌ @{username} is already taken.</p>
                        )}
                        {status === "invalid" && (
                            <p className="mt-2 text-sm font-bold text-orange-500">⚠️ Only letters, numbers, _ and - allowed.</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={status !== "available"}
                        className="w-full bg-[#00ff7f] text-black py-3 px-4 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all font-black text-lg uppercase mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                    >
                        Confirm
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateUsername;
