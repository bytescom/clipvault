"use client";

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaGoogle } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { authClient, useSession } from '@/lib/auth.client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    // Already signed in? Skip the form.
    const { data: session } = useSession();
    useEffect(() => {
        if (session) router.push("/vault");
    }, [session, router]);


    const handleChange = (e) => {
        let { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(formData);

        const { data, error } = await authClient.signIn.email({
            email: formData.email,
            password: formData.password,
            // callbackURL: "https://example.com/callback",
        });

        if (error) {
            toast.error(error.message || "Invalid email or password.");
            return;
        }

        toast.success("Login successfully!");
        router.push("/vault");
    }

    return (
        <div className="min-h-dvh bg-[#4db8c8] flex justify-center p-4 sm:p-8 font-sans selection:bg-black selection:text-white relative items-center">
            {/* Background Noise Texture */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            <div className="w-full max-w-md bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex flex-col p-5 sm:p-8 relative z-10">
                <h2 className="text-3xl font-black text-black mb-6 text-center tracking-tighter uppercase">Login</h2>

                {/* Google Sign Up button */}
                <button
                    onClick={async () => {
                        const { error } = await authClient.signIn.social({ provider: 'google' });
                        if (error) toast.error("Google sign-in is not available right now.");
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 px-4 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-black text-sm uppercase mb-6"
                >
                    <FaGoogle className="text-red-500 text-xl" />
                    Sign in with Google
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-[3px] border-black"></div>
                    </div>
                    <div className="relative flex justify-center text-sm font-black">
                        <span className="px-3 bg-white text-black uppercase">Or continue with</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-black text-black mb-2 uppercase">Email</label>
                        <input
                            type="email"
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-[3px] border-black text-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder-gray-400"
                            placeholder="your@email.com"
                            required
                        />
                    </div>


                    <div>
                        <label htmlFor="password" className="block text-sm font-black text-black mb-2 uppercase">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
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

                    <div className="flex items-center justify-end">
                        <Link href="/auth/forgot-password" className="text-sm font-black text-black hover:underline hover:translate-x-[1px] transition-transform cursor-pointer">
                            Forgot password?
                        </Link>
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-[#ff5d5d] text-black py-3 px-4 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all font-black text-lg uppercase mt-2 cursor-pointer"
                    >
                        Login
                    </button>


                    <p className="text-sm font-black text-black text-center mt-6">
                        Don&apos;t have an account?
                        <Link className='ml-2 text-[#45b6fe] hover:underline' href="/auth/signup"> SIGN UP</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SignIn
