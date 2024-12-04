'use client';
import { Inter } from "next/font/google";
import "@/globals.css";
import Link from "next/link";
import { UserProvider } from "@/UserContext";
import ProtectedSectionMenu from "@/ProtectedSectionMenu";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/app/components/ThemeToggle";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <html lang="en" className="h-full">
        <head>
            <title>Stable Assistant</title>
        </head>
        <body className="h-full bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
        <UserProvider>
            {/* Nagłówek */}
            <header className="w-full p-4 shadow-lg font-semibold text-lg bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 flex flex-row justify-between items-center">
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                    <Link href="/home">Stable Assistant ♘</Link>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <ThemeToggle />
                    <Link href="/">
                        <img
                            src="/images/login.png"
                            className="w-12 p-2 bg-gray-200 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                            alt="Login Icon"
                        />
                    </Link>
                </div>
            </header>

            {/* Menu poziome */}
            <nav className="relative text-center bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 shadow-md sticky top-0 z-50">
                {/* Przycisk mobilny */}
                <div className="flex justify-between text-center items-center p-4 md:hidden">
                    <div className="text-lg font-bold">Menu</div>
                    <button
                        onClick={toggleMenu}
                        className="text-gray-800 dark:text-gray-100 focus:outline-none"
                    >
                        {isMenuOpen ? "✖" : "☰"}
                    </button>
                </div>

                {/* Sekcja menu */}
                <div
                    className={`absolute w-full bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 shadow-lg transform transition-transform duration-300 ${
                        isMenuOpen ? "block" : "hidden"
                    } md:relative md:block`}
                >
                    <ProtectedSectionMenu requiredRole="wlasciciel_stajni">
                        <div className="flex flex-col justify-center md:flex-row gap-4 p-2">
                            <Link href="/dashboard" className="hover:underline">
                                Stajnia
                            </Link>
                            <Link href="/dashboard/boxes" className="hover:underline">
                                Boksy
                            </Link>
                            <Link href="/dashboard/padoki" className="hover:underline">
                                Padoki
                            </Link>
                            <Link href="/dashboard/trening" className="hover:underline">
                                Treningi
                            </Link>
                            <Link href="/dashboard/harmonogram" className="hover:underline">
                                Zarządzanie pracownikami
                            </Link>
                            <Link href="/zarzadzanie" className="hover:underline">
                                Zarządzanie stajnią
                            </Link>
                            <Link href="/kowal" className="hover:underline">
                                Wizyta kowala
                            </Link>
                            <Link href="/zarzadzanie_kontami" className="hover:underline">
                                Panel administracyjny
                            </Link>
                            <Link href="/dashboard/notes" className="hover:underline">
                                Wiadomości
                            </Link>
                            <Link href="/moj_profil" className="hover:underline">
                                Mój profil
                            </Link>
                        </div>
                    </ProtectedSectionMenu>

                    <ProtectedSectionMenu requiredRole="pracownik">
                        <div className="flex flex-col justify-center md:flex-row gap-4 p-2">
                            <Link href="/dashboard" className="hover:underline">
                                Stajnia
                            </Link>
                            <Link href="/dashboard/boxes" className="hover:underline">
                                Boksy
                            </Link>
                            <Link href="/dashboard/padoki" className="hover:underline">
                                Padoki
                            </Link>
                            <Link href="/dashboard/trening" className="hover:underline">
                                Treningi
                            </Link>
                            <Link href="/dashboard/zadania" className="hover:underline">
                                Moje zadania
                            </Link>
                            <Link href="/dashboard/notes" className="hover:underline">
                                Wiadomości
                            </Link>
                            <Link href="/moj_profil" className="hover:underline">
                                Mój profil
                            </Link>
                        </div>
                    </ProtectedSectionMenu>
                </div>
            </nav>

            {/* Sekcja główna */}
            <main className="flex-grow min-h-screen mt-10 bg-gray-200 dark:bg-gray-900">
                {children}
            </main>

            {/* Stopka */}
            <footer className="w-full p-4 text-center  text-gray-700 bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-gray-400">
                <div>© All rights reserved</div>
            </footer>
        </UserProvider>
        </body>
        </html>
    );
}
