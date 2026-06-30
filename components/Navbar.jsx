"use client"

import Link from 'next/link';
import { FaArrowRight } from "react-icons/fa";
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';

const Navbar = () => {

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-[#f4ebe6] transition-all duration-300">
            <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex justify-between items-center">

                <div className="hidden md:flex justify-center items-center bg-[#e9e9e9] border border-[#f4ebe6] rounded-full px-4 h-10 w-60 transition-colors duration-300 focus-within:border-[#da5407] focus-within:ring-2 focus-within:ring-[#da5407]/20">
                    <FaSearch className="text-[#9e6747] mr-2 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search links…"
                        aria-label="Search links"
                        className="w-full bg-transparent outline-none text-sm text-[#1c120d] placeholder-[#9e6747]"
                    />
                </div>


                <Link href="/" className="flex items-center gap-2 cursor-pointer group" aria-label="Go to homepage">
                    <Image src="/logo.svg" alt="Links Vault" width={120} height={40} priority className="w-24 sm:w-[120px]" style={{ height: 'auto' }} />
                </Link>

                {/* Desktop Navigation */}
                <div className='flex justify-center items-center gap-3'>
                    <Link href="/auth/signin">
                        <button className="h-11 px-6 text-sm font-bold text-[#8c4928] bg-[#fff5ec] hover:bg-[#fce5d1] rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer hidden md:flex">
                            Sign In
                        </button>
                    </Link>

                    <Link href="/auth/signup">
                        <button className="group relative h-11 px-7 text-sm font-bold text-white rounded-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer hidden md:flex items-center justify-center gap-2">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#da5407] via-[#f1712a] to-[#da5407] bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-500"></div>
                            <span className="relative z-10 flex items-center gap-2">
                                Start Free
                                <FaArrowRight className='h-3 w-3' />
                            </span>
                        </button>
                    </Link>

                    <Link href="/auth/signin">
                        <button className="h-11 px-1 font text-[#c94e07] transition-all duration-300 flex items-center gap-2 cursor-pointer md:hidden">
                            Sign-In
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;