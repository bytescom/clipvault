import Link from "next/link";
import { FaCoffee } from "react-icons/fa";
import Image from "next/image";

const link = ["Terms", "Privacy", "Status", "Contact", "About"]

export default function Footer() {
    return (
        <footer className="w-full bg-white border-t border-[#f4ebe6] py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <Image src='/favicon.svg' alt="Links Vault" width={20} height={20} />
                    <p className="text-xs sm:text-sm text-[#9e6747] font-medium">© 2026 Links Vault.</p>
                </div>
                <nav className="flex flex-wrap gap-4 sm:gap-6 justify-center">
                    {link.map((link, index) => (
                        <Link
                            key={index}
                            href="#"
                            className="text-xs sm:text-sm hover:underline underline-offset-4 text-[#9e6747] hover:text-[#da5407] transition-colors duration-200 focus:outline-none focus:underline font-medium"
                        >
                            {link}
                        </Link>
                    ))}
                </nav>
            </div>
        </footer>
    )
}