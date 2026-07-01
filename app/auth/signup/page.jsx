"use client";

import React, { useState } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth.client';
import { useRouter } from 'next/navigation';
import { FaGoogle } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast from 'react-hot-toast';

const Signup = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await authClient.signUp.email({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
      return;
    }

    toast.success("Account created successfully!");
    router.push("/create-username");
  }

  return (
    <div className="min-h-screen bg-[#4db8c8] flex justify-center p-4 sm:p-8 font-sans selection:bg-black selection:text-white relative items-center">
      {/* Background Noise Texture */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <div className="w-full max-w-md bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex flex-col p-8 relative z-10">
        <h2 className="text-3xl font-black text-black mb-6 text-center tracking-tighter uppercase">Sign Up</h2>

        {/* Google Sign Up button */}
        <button
          onClick={() => authClient.signIn.social({ provider: 'google' })}
          className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 px-4 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-black text-sm uppercase mb-6"
        >
          <FaGoogle className="text-red-500 text-xl" />
          Sign up with Google
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
            <label htmlFor="name" className="block text-sm font-black text-black mb-2 uppercase">Name</label>
            <input
              type="text"
              name='name'
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-[3px] border-black text-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder-gray-400"
              placeholder="Your Name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-black text-black mb-2 uppercase">Email</label>
            <input
              type="email"
              name='email'
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-[3px] border-black text-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder-gray-400"
              placeholder="yourname@email.com"
              required
            />
          </div>


          <div>
            <label htmlFor="password" className="block text-sm font-black text-black mb-2 uppercase">Password</label>
            <input
              type="password"
              name='password'
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-[3px] border-black text-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder-gray-400"
              required
              placeholder="******"
              minLength={6}
            />
            <p className="mt-2 text-xs font-bold text-gray-500 uppercase">Must be at least 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ff5d5d] text-black py-3 px-4 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all font-black text-lg uppercase mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                Signing up...
              </>
            ) : "Sign up"}
          </button>


          <p className="text-sm font-black text-black text-center mt-6">
            Already have an account?
            <Link className='ml-2 text-[#45b6fe] hover:underline' href="/auth/login"> LOGIN</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
