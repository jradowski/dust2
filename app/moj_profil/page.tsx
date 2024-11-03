"use client";
import React, { useState, useEffect } from 'react';
import  supabase  from '@/supabaseClient'; // Import Supabase Client
import { useUser } from '@/UserContext'; // Import kontekstu użytkownika

const MyProfile = () => {
    const { user } = useUser(); // Pobranie danych użytkownika z kontekstu
    const [email, setEmail] = useState(user?.email || '');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Sprawdzamy, czy użytkownik jest zalogowany
        if (!user) {
            setError('');
        }
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
        <div className="my-profile-container p-4">
            <h1 className="text-2xl font-bold">Mój Profil</h1>
            
            {/* Sekcja Zmiany Emaila */}
            <div className="my-4">
                <label htmlFor="email" className="block font-semibold">Nowy email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                />
                <button
                    onClick={handleEmailChange}
                    className=""
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
                    className="border px-2 py-1 rounded w-full"
                />
                <button
                    onClick={handlePasswordChange}
                    className=""
                >
                    Zmień hasło
                </button>
            </div>

            {/* Sekcja Usunięcia Konta */}
            <div className="my-4">
                <button
                    onClick={handleDeleteAccount}
                    className=""
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
