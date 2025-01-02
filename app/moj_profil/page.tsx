"use client";
import React, { useState, useEffect } from 'react';
import  supabase  from '@/supabaseClient'; // Import Supabase Client
import { useUser } from '@/UserContext'; // Import kontekstu użytkownika
import '@/admin_board.css';


const MyProfile = () => {
    const { user } = useUser(); // Pobranie danych użytkownika z kontekstu
    const [email, setEmail] = useState(user?.email || '');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [profile, setProfile] = useState<any>({});
    const [lastSignIn, setLastSignIn] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setError('');
            return;
        }

        const fetchProfile = async () => {
            try {
                // Pobierz dane użytkownika z tabeli employees
                const { data: employeeData, error: employeeError } = await supabase
                    .from('employees')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (employeeError) {
                    console.error("Błąd przy pobieraniu danych użytkownika:", employeeError);
                    setError("Wystąpił błąd przy pobieraniu danych użytkownika.");
                } else {
                    setProfile(employeeData);
                }

                // Pobierz ostatnie logowanie z tabeli auth.users
                
            } catch (err) {
                console.error("Błąd:", err);
            }
        };

        fetchProfile();
    }, [user]);
    // Zmiana hasła
    const handlePasswordChange = async () => {
        if (!newPassword) {
            setError('Wprowadź nowe hasło');
            return;
        }
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) setError(error.message);
        else setSuccess('Hasło zostało zmienione');
    };

    // Zmiana emaila
    const handleEmailChange = async () => {
        if (!email) {
            setError('Wprowadź nowy email');
            return;
        }
        const { error } = await supabase.auth.updateUser({
            email: email,
        });
        if (error) setError(error.message);
        else setSuccess('Email został zmieniony');
    };

    // Usunięcie konta
    const handleDeleteAccount = async () => {
        const confirmed = confirm("Czy na pewno chcesz usunąć konto? Tej operacji nie można cofnąć.");
        if (!confirmed) return;

        const { error } = await supabase.from('employees').delete().eq('id', user?.id);
        if (error) {
            setError("Wystąpił problem przy usuwaniu konta");
            return;
        }
        await supabase.auth.signOut(); // Wylogowanie użytkownika po usunięciu konta
        setSuccess("Konto zostało usunięte. Zostałeś wylogowany");
    };

    if (!user) {
        return <div className="text-red-500">{error}</div>; // Wyświetlenie błędu, jeśli użytkownik nie jest zalogowany
    }
    const positionMap: { [key: string]: string } = {
        'wlasciciel_koni': 'Właściciel koni',
        'wlasciciel_stajni': 'Właściciel stajni',
        'luzak': 'Luzak',
        'jezdziec': 'Jeździec',
        'stajenny': 'Stajenny',
    };
    
    const displayPosition = positionMap[profile.position] || profile.position;
    
    return (
        <div className="grid grid-cols-1 place-items-center gap-10 p-4 text-center">
            <div className="text-center font-bold text-4xl p-2">
                <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                    Mój profil
                </h1>
            </div>
            {/* Podgląd danych użytkownika */}
            <div
                className="w-10/12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                <div
                    className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <h2 className="font-semibold text-3xl">Twoje dane</h2>
                    <div className="text-xl p-2">
                        <p>Imię i nazwisko: {profile.first_name} {profile.last_name}</p>
                        <p>Stanowisko: {displayPosition || 'Nie podano'}</p>
                        {/*<p>Status konta: {profile.status || 'Aktywne'}</p>*/}
                    </div>
                </div>
            </div>

            {/* Sekcja Zmiany Emaila */}
            <div
                className="w-10/12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">

                <div
                    className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <div className="mt-2 mb-2">
                        <label htmlFor="email"
                               className="text-transparent font-bold text-3xl p-4 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                            Nowy email</label>
                    </div>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="custom-input"
                    />
                    <button
                        onClick={handleEmailChange}
                        className="px-6 py-2 w-fit text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white mt-2 mb-2">
                        Zmień email
                    </button>
                </div>
            </div>

            {/* Sekcja Zmiany Hasła */}
            <div
                className="w-10/12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                <div
                    className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <div className="mt-2 mb-2">
                        <label htmlFor="newPassword"
                               className="text-transparent font-bold text-3xl p-4 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                            Nowe hasło</label>
                    </div>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="custom-input"
                    />
                    <button
                        onClick={handlePasswordChange}
                        className="px-6 py-2 w-fit text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white mt-2 mb-2">
                        Zmień hasło
                    </button>
                </div>
            </div>

            {/* Sekcja Usunięcia Konta */}
            <div
                className="w-fit bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">

                <div className="text-center font-bold text-2xl mb-6">
                    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                        Usuwanie konta
                    </h1>
                </div>
                <button
                    onClick={handleDeleteAccount}
                    className="px-6 py-2 w-fit text-black bg-blue-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-red-600 dark:focus:ring-blue-700 dark:text-white mt-2 mb-2 ">
                    Usuń konto
                </button>
            </div>

            {/* Komunikaty o błędach i sukcesach */}
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {success && <div className="text-green-500 mt-2">{success}</div>}
        </div>
    );
};

export default MyProfile;
