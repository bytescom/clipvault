"use client";

import React, { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { authClient } from '@/lib/auth.client';
import toast from 'react-hot-toast';

// The token arrives as ?token=… appended by better-auth to the redirectTo
// link configured in /auth/forgot-password. The URL never changes while this
// page is open, so a static external snapshot is enough — no effect needed.
const emptySubscribe = () => () => { };
const getClientToken = () => new URLSearchParams(window.location.search).get("token");
const getServerToken = () => undefined; // SSR/hydration pass: not known yet

const ResetPassword = () => {
    const router = useRouter();
    // undefined = not resolved yet (show loading), null = no token in URL
    const token = useSyncExternalStore(emptySubscribe, getClientToken, getServerToken);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid or missing reset token. Request a new link.");
            return;
        }
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        const { error } = await authClient.resetPassword({ newPassword: password, token });
        setIsLoading(false);

        if (error) {
            toast.error(error.message || "Failed to reset password. The link may have expired.");
            return;
        }

        toast.success("Password reset! You can now log in.");
        router.push("/auth/login");
    };

    return (
        <div className="min-h-dvh bg-[#4db8c8] flex justify-center p-4 sm:p-8 font-sans selection:bg-black selection:text-white relative items-center">
            {/* Background Noise Texture */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            <div className="w-full max-w-md bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex flex-col p-5 sm:p-8 relative z-10">
                <h2 className="text-3xl font-black text-black mb-6 text-center tracking-tighter uppercase">New Password</h2>

                {token ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="password" className="block text-sm font-black text-black mb-2 uppercase">New Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border-[3px] border-black text-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder-gray-400"
                                    required
                                    placeholder="******"
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-black transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </button>
                            </div>
                            <p className="mt-2 text-xs font-bold text-gray-500 uppercase">Must be at least 8 characters</p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-black text-black mb-2 uppercase">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border-[3px] border-black text-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder-gray-400"
                                required
                                placeholder="******"
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#ff5d5d] text-black py-3 px-4 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all font-black text-lg uppercase mt-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                ) : token === null ? (
                    <div className="text-center">
                        <p className="text-black font-bold mb-6">
                            This reset link is invalid or has expired.
                        </p>
                        <Link
                            href="/auth/forgot-password"
                            className="inline-block bg-[#ff5d5d] text-black py-3 px-8 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all font-black text-sm uppercase"
                        >
                            Request a New Link
                        </Link>
                    </div>
                ) : (
                    <p className="text-black font-bold text-center">Loading…</p>
                )}
            </div>
        </div>
    )
}

export default ResetPassword
