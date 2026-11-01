"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSession } from '@/lib/auth.client';

// Mirrors the server-side rules in /api/create-username.
const usernameRegex = /^[a-zA-Z0-9_\-]{3,30}$/;

const CreateUsername = () => {
    const { data: session } = useSession();
    const [username, setUsername] = useState("");
    // null | "checking" | "available" | "taken"  (invalid input is derived in render)
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Need a session to claim, and claiming is one-time — users who already
    // have a username have nothing to do here.
    useEffect(() => {
        if (session === null) router.push("/auth/login");
        else if (session?.user?.username) router.push("/vault");
    }, [session, router]);

    const handleUsernameChange = (e) => {
        if (isSubmitting) return; // the claim is in flight — don't re-check
        const next = e.target.value;
        setUsername(next);
        // Valid names start checking immediately; the effect below resolves
        // them after a short debounce. Empty or invalid input clears any
        // stale verdict.
        setStatus(next && usernameRegex.test(next) ? "checking" : null);
    };

    // Debounced live availability check against the API — a single-name probe,
    // never the whole user list.
    useEffect(() => {
        // Freeze the verdict while the claim request is in flight: the name
        // legitimately starts "existing" in the DB mid-flight, and re-checking
        // it then would wrongly flash "already taken" for the user's own name.
        if (isSubmitting) return;
        if (!username || !usernameRegex.test(username)) return;

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(
                    `/api/create-username?username=${encodeURIComponent(username)}`,
                    { signal: controller.signal }
                );
                if (!response.ok) throw new Error("Availability check failed");

                const data = await response.json();
                setStatus(data.available ? "available" : "taken");
            } catch (err) {
                if (err.name === "AbortError") return;
                console.error("Availability check failed:", err);
                setStatus(null); // can't verify — keep the form disabled
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [username, isSubmitting]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (status !== "available" || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/create-username", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to save username.");
                setIsSubmitting(false); // allow retrying with another name
                return;
            }

            toast.success("Username created!");
            router.push("/vault");
            // Keep isSubmitting true — we're navigating away.
        } catch (error) {
            console.error("Error creating username:", error);
            toast.error("A network error occurred. Please try again.");
            setIsSubmitting(false);
        }
    }

    // Invalid input is derived, not stored — no state to keep in sync.
    const isInvalid = username.length > 0 && !usernameRegex.test(username);

    return (
        <div className="min-h-dvh bg-[#4db8c8] flex justify-center p-4 sm:p-8 font-sans selection:bg-black selection:text-white relative items-center">
            {/* Background Noise Texture */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            <div className="w-full max-w-md bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex flex-col p-5 sm:p-8 relative z-10">
                <h2 className="text-3xl font-black text-black mb-6 text-center tracking-tighter uppercase">Create Username</h2>
                <p className="text-black font-bold mb-6 text-center">Pick a unique username for your profile link.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-sm font-black text-black mb-2 uppercase">Username</label>
                        <div className="relative">
                            <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 font-black text-gray-500 text-xs sm:text-base">clipvault.com/</span>
                            <input
                                type="text"
                                name='username'
                                value={username}
                                onChange={handleUsernameChange}
                                disabled={isSubmitting}
                                className="w-full pl-[104px] sm:pl-[135px] pr-4 py-3 border-[3px] border-black text-base text-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                                placeholder="yourname"
                                required
                                pattern="[a-zA-Z0-9_\-]{3,30}"
                                maxLength={30}
                                title="3-30 characters: letters, numbers, underscores, and dashes."
                            />
                        </div>

                        {/* Availability feedback */}
                        {isInvalid && (
                            <p className="mt-2 text-sm font-bold text-orange-500">⚠️ 3-30 characters: letters, numbers, _ and - only.</p>
                        )}
                        {!isInvalid && status === "checking" && (
                            <p className="mt-2 text-sm font-bold text-gray-500 flex items-center gap-1.5">
                                <AiOutlineLoading3Quarters className="animate-spin" size={14} />
                                Checking availability…
                            </p>
                        )}
                        {!isInvalid && status === "available" && (
                            <p className="mt-2 text-sm font-bold text-green-600">✅ @{username} is available!</p>
                        )}
                        {!isInvalid && status === "taken" && (
                            <p className="mt-2 text-sm font-bold text-red-500">❌ @{username} is already taken.</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || status !== "available"}
                        className="w-full bg-[#00ff7f] text-black py-3 px-4 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all font-black text-lg uppercase mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                                Creating…
                            </>
                        ) : "Confirm"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateUsername;
