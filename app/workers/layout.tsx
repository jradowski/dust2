// app/workers/layout.tsx
'use client';
import { Inter } from 'next/font/google';
import '@/globals.css';
import {useUser} from "@/UserContext";
import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";


const UserNameLink = () => {
    const { user } = useUser(); // Używamy kontekstu użytkownika

    return (
        <Link href="/workers">
            {user ? user.email : "Logowanie"} {/* Wstawiamy imię użytkownika lub komunikat dla gościa */}
        </Link>
    );
};
const inter = Inter({ subsets: ['latin'] });

export default function WorkersLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <head>
            <title>Stable Assistant</title>
        </head>
        <body className={inter.className}>
        <div
            className="w-full h-fit p-4 columns-3 justify-between flex flex-row border-b-2 border-zinc-200 font-bold italic text-lg text-zinc-700 bg-gradient-to-t from-white bg-gray-400 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-gray-600 dark:text-white">

            <div className="text-2xl"><Link href="/home">Stable Assistant ♘</Link></div>
            <ThemeToggle />
            <div className="text-2xl"><Link href="/workers">Logowanie</Link></div>
        </div>
        <div className="workers-container">
            {children}
        </div>
        </body>
        </html>
    );

}