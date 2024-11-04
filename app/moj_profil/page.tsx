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
            setError('Nie jesteś zalogowany.');
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
                const { data: authData, error: authError } = await supabase
                    .from('auth.users')
                    .select('last_sign_in_at')
                    .eq('id', user.id)
                    .single();

                if (authError) {
                    console.error("Błąd przy pobieraniu ostatniego logowania:", authError);
                    setError("Wystąpił błąd przy pobieraniu terminu ostatniego logowania.");
                } else {
                    setLastSignIn(authData?.last_sign_in_at || 'Brak informacji');
                }
            } catch (err) {
                console.error("Błąd:", err);
                setError("Wystąpił nieoczekiwany błąd.");
            }
        };

        fetchProfile();
    }, [user]);
    // Zmiana hasła
    const handlePasswordChange = async () => {
        if (!newPassword) {
            setError('Wprowadź nowe hasło.');
            return;
        }
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) setError(error.message);
        else setSuccess('Hasło zostało zmienione.');
    };

    // Zmiana emaila
    const handleEmailChange = async () => {
        if (!email) {
            setError('Wprowadź nowy email.');
            return;
        }
        const { error } = await supabase.auth.updateUser({
            email: email,
        });
        if (error) setError(error.message);
        else setSuccess('Email został zmieniony.');
    };

    // Usunięcie konta
    const handleDeleteAccount = async () => {
        const confirmed = confirm("Czy na pewno chcesz usunąć konto? Tej operacji nie można cofnąć.");
        if (!confirmed) return;

        const { error } = await supabase.from('employees').delete().eq('id', user?.id);
        if (error) {
            setError("Wystąpił problem przy usuwaniu konta.");
            return;
        }
        await supabase.auth.signOut(); // Wylogowanie użytkownika po usunięciu konta
        setSuccess("Konto zostało usunięte. Zostałeś wylogowany.");
    };

    if (!user) {
        return <div className="text-red-500">{error}</div>; // Wyświetlenie błędu, jeśli użytkownik nie jest zalogowany
    }

    return (
        <div className="my-profile-container p-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Mój Profil</h1>
             {/* Podgląd danych użytkownika */}
             <div className="  text-center text-2xl bg-white border-r-2 border-b-2 border-zinc-200 p-5 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-r-2 dark:border-gray-600 ">
             <h2 className="font-semibold">Twoje dane</h2>
                <p>Imię i nazwisko: {profile.first_name} {profile.last_name}</p>
                <p>Stanowisko: {profile.position || 'Nie podano'}</p>
                <p>Status konta: {profile.status || 'Aktywne'}</p>
                <p>Ostatnie logowanie: {lastSignIn || 'Brak informacji'}</p>
            </div>

            {/* Sekcja Zmiany Emaila */}
            <div className="my-4">
                <label htmlFor="email" className="block font-semibold">Nowy email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="custom-input"
                />
                <button
                    onClick={handleEmailChange}
                    className="admin_button"
                >
                    Zmień email
                </button>
            </div>

            {/* Sekcja Zmiany Hasła */}
            <div className="my-4">
                <label htmlFor="newPassword" className="block font-semibold">Nowe hasło:</label>
                <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="custom-input"
                />
                <button
                    onClick={handlePasswordChange}
                    className="admin_button"
                >
                    Zmień hasło
                </button>
            </div>

            {/* Sekcja Usunięcia Konta */}
            <div className="my-4">
                <button
                    onClick={handleDeleteAccount}
                    className="alert-button"
                >
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
