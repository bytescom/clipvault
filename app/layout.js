import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ClipVault — Save, Organise & Share Your Links",
  description: "ClipVault is a secure, private vault for all your important links and notes. Keep them organised, control visibility per item, and share anything with one tap.",
};

// Mobile browser chrome (address bar) picks up the brand colour.
export const viewport = {
  themeColor: "#4db8c8",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* Bottom-center keeps toasts clear of the sticky navbar and within
            thumb reach on phones; the width cap avoids overflow on 320px screens. */}
        <Toaster
          position="bottom-center"
          containerStyle={{ bottom: 24 }}
          toastOptions={{ style: { maxWidth: "calc(100vw - 2rem)" } }}
        />
      </body>
    </html>
  );
}
