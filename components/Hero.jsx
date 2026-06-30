import Link from "next/link";

export default function Hero() {
    return (
        <div className="w-full lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

            <div className="w-full lg:max-w-7xl h-[75vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl bg-[#da5407] relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] flex items-center justify-center">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                {/* Radial Gradient */}
                <div className="absolute inset-0"
                     style={{
                         background: 'radial-gradient(circle at center, rgba(255,165,0,0.3) 0%, rgba(218,84,7,1) 70%)'
                     }}></div>

                <div className="relative z-10 text-center px-6 max-w-3xl md:max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
                    <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tighter drop-shadow-sm leading-tighter px-4">
                        Secure and access your bookmarks anywhere 🔗
                    </h1>
                    <p className="text-base md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto font-medium py-2  tracking-tight">
                        Links Vault is the safest and most elegant way to organize, search, and manage your important web links.
                        Simple, beautiful, and completely private.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/auth/signup">
                            <button className="w-full sm:w-auto h-12 sm:h-14 px-20 md:px-18 rounded-full text-base sm:text-lg font-bold bg-white text-[#da5407] shadow-lg hover:bg-gray-50 hover:text-[#b8450a] transition-all active:scale-95 cursor-pointer">
                                Create My Vault
                            </button>
                        </Link>

                        <Link href="/dashboard">
                            <button className="w-full sm:w-auto h-12 sm:h-14 px-10 sm:px-8 rounded-full text-base sm:text-lg font-semibold border-2 border-white/40 text-white bg-transparent backdrop-blur-sm hover:bg-white/10 hover:border-white transition-all cursor-pointer">
                                Explore Dashboard
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
