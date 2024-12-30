'use client';
import Link from "next/link";
import ProtectedSectionMenu from "@/ProtectedSectionMenu";
import { useState, useContext, useEffect } from "react";
import { useUser } from "@/UserContext"; // Importujemy hook, aby używać kontekstu



const Menu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, loading } = useUser(); // Zbieramy dane użytkownika i stan ładowania z kontekstu

    // Jeśli dane użytkownika jeszcze się ładowane, nie renderuj menu
    if (loading) {
      return null; // lub spinner/komunikat o ładowaniu
    }

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="relative text-center font-bold bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 shadow-md sticky top-0 z-50">
            <div className="flex justify-between text-center items-center p-4 md:hidden">
                <div className="text-lg font-bold">Menu</div>
                <button
                    onClick={toggleMenu}
                    className="text-gray-800 dark:text-gray-100 focus:outline-none"
                >
                    {isMenuOpen ? "✖" : "☰"}
                </button>
            </div>

            <div
                className={`absolute w-full bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 shadow-lg transform transition-transform duration-300 ${
                    isMenuOpen ? "block" : "hidden"
                } md:relative md:block`}
            >
                <ProtectedSectionMenu requiredRole="wlasciciel_stajni">
                    <div className="flex flex-col justify-center md:flex-row gap-4 p-2">
                        <Link href="/dashboard" className="hover:underline">Stajnia</Link>
                        <Link href="/dashboard/boxes" className="hover:underline">Boksy</Link>
                        <Link href="/dashboard/padoki" className="hover:underline">Padoki</Link>
                        <Link href="/dashboard/trening" className="hover:underline">Treningi</Link>
                        <Link href="/dashboard/harmonogram" className="hover:underline">Zarządzanie pracownikami</Link>
                        <Link href="/zarzadzanie" className="hover:underline">Zarządzanie stajnią</Link>
                        <Link href="/kowal" className="hover:underline">Wizyta kowala</Link>
                        <Link href="/zarzadzanie_kontami" className="hover:underline">Panel administracyjny</Link>
                        <Link href="/dashboard/notes" className="hover:underline">Wiadomości</Link>
                        <Link href="/moj_profil" className="hover:underline">Mój profil</Link>
                    </div>
                </ProtectedSectionMenu>

                <ProtectedSectionMenu requiredRole="pracownik">
                    <div className="flex flex-col justify-center md:flex-row gap-4 p-2">
                        <Link href="/dashboard" className="hover:underline">Stajnia</Link>
                        <Link href="/dashboard/boxes" className="hover:underline">Boksy</Link>
                        <Link href="/dashboard/padoki" className="hover:underline">Padoki</Link>
                        <Link href="/dashboard/trening" className="hover:underline">Treningi</Link>
                        <Link href="/dashboard/zadania" className="hover:underline">Moje zadania</Link>
                        <Link href="/dashboard/notes" className="hover:underline">Wiadomości</Link>
                        <Link href="/moj_profil" className="hover:underline">Mój profil</Link>
                    </div>
                </ProtectedSectionMenu>

                <ProtectedSectionMenu requiredRole="wlasciciel_koni">
                    <div className="flex flex-col justify-center md:flex-row gap-4 p-2">
                        <Link href="/wlasciciel_konia" className="hover:underline">Home</Link>
                        <Link href="/wlasciciel_konia/moje_konie" className="hover:underline">Moje konie</Link>
                        <Link href="/wlasciciel_konia/zarzadzaj_wlasciciel" className="hover:underline">Zarządzaj końmi</Link>
                        <Link href="/wlasciciel_konia/treningi" className="hover:underline">Treningi</Link>
                        <Link href="/dashboard/notes" className="hover:underline">Wiadomości</Link>
                        <Link href="/moj_profil" className="hover:underline">Mój profil</Link>
                    </div>
                </ProtectedSectionMenu>
            </div>
        </nav>
    );
};

export default Menu;
