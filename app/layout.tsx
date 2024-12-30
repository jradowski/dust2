'use client';
import { Inter } from "next/font/google";
import "@/globals.css";
import Link from "next/link";
import { UserProvider } from "@/UserContext";
import ThemeToggle from "@/app/components/ThemeToggle";
import Menu from "@/app/components/Dropdown";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="h-full">
        <head>
            <title>Stable Assistant</title>
        </head>
        <body className="h-full flex flex-col bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
        <UserProvider>
            {/* Nagłówek */}
            <header className="w-full p-4 shadow-lg font-semibold text-lg bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 flex flex-row justify-between items-center">
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                    <Link href="/">Stable Assistant ♘</Link>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <ThemeToggle />
                    <Link href="/home">
                        <img
                            src="/images/login.png"
                            className="w-12 p-2 bg-gray-200 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 "
                            alt="Login Icon"
                        />
                    </Link>
                </div>
            </header>

            {/* Menu */}
            <Menu />

            {/* Sekcja główna */}
            <main className="flex-grow mt-10 bg-gray-200 dark:bg-gray-900">
                {children}
            </main>

            {/* Stopka */}
            <footer className="w-full p-4 text-center text-gray-700 bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-gray-400">
                <div>© All rights reserved</div>
            </footer>
        </UserProvider>
        </body>
        </html>
    );
}
