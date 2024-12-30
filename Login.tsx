"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/supabaseClient.js';
import '@/globals.css';

const Login: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>(''); // Stan do przechowywania błędów
    const router = useRouter();

    // Mapa błędów do tłumaczenia na język polski
    const errorMessages: { [key: string]: string } = {
        'Invalid login credentials': 'Niepoprawne dane logowania.',
        'Invalid email address': 'Niepoprawny adres e-mail.',
        'Password is required': 'Hasło jest wymagane.',
        'Email is required': 'Adres e-mail jest wymagany.',
        'Network request failed': 'Błąd połączenia z siecią.',
        'missing email or phone': 'Niekompletne dane.',
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Zerowanie błędu przed próbą logowania
        setError('');
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // Tłumaczenie błędu na polski
            const errorMessage = errorMessages[error.message] || 'Niepoprawne dane logowania.';
            setError(errorMessage); // Ustawienie przetłumaczonego błędu
            console.error('Error logging in:', error.message);
        } else {
            // Pobranie uprawnień użytkownika z bazy danych
            const { data: userData, error: userError } = await supabase
                .from('employees')  // lub odpowiednia tabela
                .select('uprawnienia')
                .eq('id', data.user.id)
                .single();

            if (userError) {
                console.error('Error fetching user data:', userError.message);
                return;
            }

            // Sprawdzenie uprawnień
            if (userData?.uprawnienia === 'wlasciciel_koni') {
                // Przekierowanie na stronę /wlasciciel_konia, jeśli użytkownik ma uprawnienia 'wlasciciel_koni'
                router.push('/wlasciciel_konia');
            } else {
                // Przekierowanie na stronę /dashboard dla innych użytkowników
                router.push('/dashboard');
            }

            console.log('User logged in:', data.user);
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
            <div className="text-transparent text-center font-bold text-2xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                <h1>Logowanie do Stable Assistant</h1>
            </div>
            <div className="flex flex-col text-xl mt-6 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <div className="text-left leading-10">
                    <form onSubmit={handleLogin}>
                        <label>
                            Email:
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="custom-input"
                            />
                        </label>
                        <br />
                        <label>
                            Hasło:
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="custom-input"
                            />
                        </label>
                        <br />
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>} {/* Wyświetlanie błędu */}
                        <div className="flex flex-row gap-4 mt-6 mb-2">
                            <button type="submit"
                                className="px-6 py-2 w-full text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white">
                                Zaloguj
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
