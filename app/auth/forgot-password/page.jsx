"use client";

import React, { useState } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth.client';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await authClient.requestPasswordReset({
            email,
            redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        setIsLoading(false);

        if (error) {
            toast.error(error.message || "Something went wrong. Please try again.");
            return;
        }

        // Same response either way — never reveal whether the email exists.
        setIsSent(true);
    };

    return (
        <div className="min-h-dvh bg-[#4db8c8] flex justify-center p-4 sm:p-8 font-sans selection:bg-black selection:text-white relative items-center">
            {/* Background Noise Texture */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            <div className="w-full max-w-md bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex flex-col p-5 sm:p-8 relative z-10">
                <h2 className="text-3xl font-black text-black mb-6 text-center tracking-tighter uppercase">Reset Password</h2>

                {isSent ? (
                    <div className="text-center">
                        <p className="text-black font-bold mb-6">
                            If an account exists for <span className="font-black">{email}</span>, a reset
                            link is on its way. Check your inbox (and spam folder).
                        </p>
                        <Link
                            href="/auth/login"
                            className="inline-block bg-[#ff5d5d] text-black py-3 px-8 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all font-black text-sm uppercase cursor-pointer"
                        >
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <p className="text-black font-bold text-sm text-center">
                            Enter your email and we&apos;ll send you a link to reset your password.
                        </p>

                        <div>
                            <label htmlFor="email" className="block text-sm font-black text-black mb-2 uppercase">Email</label>
                            <input
                                type="email"
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border-[3px] border-black text-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder-gray-400"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#ff5d5d] text-black py-3 px-4 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all font-black text-lg uppercase mt-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </button>

                        <p className="text-sm font-black text-black text-center mt-6">
                            Remembered it?
                            <Link className='ml-2 text-[#45b6fe] hover:underline' href="/auth/login"> LOG IN</Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword
