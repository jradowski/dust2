'use client'
import { Inter } from "next/font/google";
import "@/globals.css";
import Link from "next/link";
import { UserProvider } from '@/UserContext';
import Login from '@/Login';
import Wylogowany from '@/Wylogowany';
import ProtectedSectionMenu from '@/ProtectedSectionMenu'; // Jeśli używasz tego komponentu
import { useUser } from '@/UserContext';
import { usePathname } from 'next/navigation';

const UserNameLink = () => {
    const { user } = useUser(); // Używamy kontekstu użytkownika
  
    return (
      <Link href="/workers">
        {user ? "Witaj: "+user.email : "Zaloguj się:"} {/* Wstawiamy imię użytkownika lub komunikat dla gościa */}
      </Link>
    );
  };
const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const pathname = usePathname();

    // Warunek sprawdzający, czy ścieżka jest "/workers", aby pominąć layout
    if (pathname === '/workers') {
        return <>{children}</>;
    }

    return (
        
        <html lang="en">
            <head>
                <title>Stable Assistant</title>
            </head>
            <body className={inter.className}>
            <UserProvider>
                <div
                    className="w-full h-fit p-4 columns-3 justify-between flex flex-row border-b-2 border-zinc-200 font-bold italic text-lg text-zinc-700 bg-gradient-to-t from-white  bg-gray-400 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-gray-600  dark:text-white">
                    <div>
                        <UserNameLink />
                    </div>
                    <div className="text-2xl"><Link href="/home">Stable Assistant ♘</Link></div>
                </div>
                <div className="flex flex-row">
                    <div className="flex flex-col gap-2 min-h-screen w-fit float-top-left text-zinc-700 lg:text-xl sm:text-sm border-r-2 border-zinc-200 bg-gradient-to-t from-white bg-gray-400 font-bold italic dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-r-2 dark:border-gray-600 dark:text-white">

                        {/* Linki do różnych stron */}
                        
                        {/* Sekcja dostępna dla właściciela stajni */}
                        <ProtectedSectionMenu requiredRole="wlasciciel_stajni">
                        <Link href="/dashboard">
                            <div className="hover:bg-gray-500 pl-2">Stajnia</div>
                        </Link>
                        <Link href="/dashboard/boxes">
                            <div className="hover:bg-gray-500 pl-2">Boksy</div>
                        </Link>
                        <Link href="/dashboard/padoki">
                            <div className="hover:bg-gray-500 pl-2">Padoki</div>
                        </Link>
                        <Link href="/dashboard/trening">
                            <div className="hover:bg-gray-500 pl-2">Treningi</div>
                        </Link>

                            <Link href="/dashboard/harmonogram">
                                <div className="hover:bg-gray-500 whitespace-break-spaces pl-2">Zarządzanie pracownikami</div>
                            </Link>
                            <Link href="/zarzadzanie">
                                <div className="hover:bg-gray-500 pl-2">Zarządzanie stajnią</div>
                            </Link>
                            <Link href="/dashboard/notes">
                            <div className="hover:bg-gray-500 pl-2">Wiadomości</div>
                        </Link>
                        <Link href="/zarzadzanie_kontami">
                            <div className="hover:bg-gray-500 pl-2">Panel administracyjny</div>
                        </Link>
                        </ProtectedSectionMenu>
                    



                        <ProtectedSectionMenu requiredRole="pracownik">
                        <Link href="/dashboard">
                            <div className="hover:bg-gray-500 pl-2">Stajnia</div>
                        </Link>
                        <Link href="/dashboard/boxes">
                            <div className="hover:bg-gray-500 pl-2">Boksy</div>
                        </Link>
                        <Link href="/dashboard/padoki">
                            <div className="hover:bg-gray-500 pl-2">Padoki</div>
                        </Link>
                        <Link href="/dashboard/trening">
                            <div className="hover:bg-gray-500 pl-2">Treningi</div>
                        </Link>
        
                        <Link href="/dashboard/notes">
                            <div className="hover:bg-gray-500 pl-2">Wiadomości</div>
                        </Link>
                        <Link href="/dashboard/zadania">
                            <div className="hover:bg-gray-500 whitespace-break-spaces pl-2">Moje zadania</div>
                        </Link>
                        </ProtectedSectionMenu>

                        {/* Sekcja dostępna dla właściciela koni */}
                        <ProtectedSectionMenu requiredRole="wlasciciel_koni">
                        {/* link do podstrony do widoku dla wlasciciela koni */}
                        <Link href="/wlasciciel_konia">
                            <div className="hover:bg-gray-500 pl-2">Home</div>
                        </Link>
                        <Link href="/wlasciciel_konia/moje_konie">
                            <div className="hover:bg-gray-500 pl-2">Moje konie</div>
                        </Link>
                        <Link href="/wlasciciel_konia/zarzadzaj_wlasciciel">
                        <div className="hover:bg-gray-500 pl-2">Zarządzaj końmi</div>
                        </Link>
                        <Link href="/wlasciciel_konia/treningi">
                            <div className="hover:bg-gray-500 pl-2">Treningi</div>
                        </Link>
                        <Link href="/dashboard/notes">
                            <div className="hover:bg-gray-500 pl-2">Wiadomości</div>
                        </Link>
                        </ProtectedSectionMenu>
                       
                        
                    </div>

                    {/* Sekcja główna, która renderuje aktualną stronę */}
                    <div className="w-11/12 mt-10">
                        {/* Tutaj umieść komponent, który będzie wyświetlany w zależności od URL */}
                        {children}
                    </div>
                </div>
                <div className="w-full h-fit p-4 text-center border-t-2 border-zinc-200 font-bold italic text-lg text-zinc-700 bg-gradient-to-t from-white bg-gray-400 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-t-2 dark:border-gray-600 dark:text-white">
                    <div>© All rights reserved</div>
                </div>
                </UserProvider>
            </body>
        </html>
    );
}

