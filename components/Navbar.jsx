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

                {/* Navigation */}
                <div className='flex items-center gap-2 sm:gap-3'>
                    {/* Login — text on mobile, pill on desktop */}
                    <Link
                        href="/auth/login"
                        className="text-sm font-bold text-[#8c4928] px-3 py-1.5 rounded-full hover:bg-[#fff5ec] transition-colors md:hidden"
                    >
                        Login
                    </Link>
                    <Link href="/auth/login" className="hidden md:block">
                        <button className="h-11 px-6 text-sm font-bold text-[#8c4928] bg-[#fff5ec] hover:bg-[#fce5d1] rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer">
                            Login
                        </button>
                    </Link>

                    {/* Sign Up — compact on mobile, full on desktop */}
                    <Link href="/auth/signup">
                        <button className="group relative h-9 md:h-11 px-4 md:px-7 text-xs md:text-sm font-bold text-white rounded-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 md:gap-2">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#da5407] via-[#f1712a] to-[#da5407] transition-all duration-500"></div>
                            <span className="relative z-10 flex items-center gap-1.5 md:gap-2">
                                <span className="hidden sm:inline">Start Free</span>
                                <span className="sm:hidden">Sign Up</span>
                                <FaArrowRight className='h-2.5 w-2.5 md:h-3 md:w-3' />
                            </span>
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;