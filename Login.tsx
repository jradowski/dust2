"use client";
import Image from 'next/image';
import Link from 'next/link';
import 'reactjs-popup/dist/index.css';
import supabase from '@/supabaseClient.js';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/globals.css';

const Login: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Error logging in:', error.message);
        } else {
            console.log('User logged in:', data.user);
            router.push('/dashboard'); // Przekierowanie do /dashboard po pomyślnym zalogowaniu
        }
    };

    return (
        <div className="flex items-center justify-center mt-6">
            <div
                className="font-sans text-center font-semibold justify-center w-fit p-2 px-4 text-xl border-b rounded-2xl border-gray-500 border-opacity-50 bg-gradient-to-b from-gray-400 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-2 dark:border-gray-600  dark:text-white">
                <h1 className="text-2xl">Logowanie</h1>
                <hr className="border-t-2 border-zinc-200 mt-2  mb-2 dark:border-gray-600 w-full"/>
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
                    <br/>
                    <label>
                        Hasło:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="custom-input"
                        />
                    </label>
                    <br/>
                    <div className="mb-2"></div>

                    <button type="submit" className="log-button">Zaloguj</button>
                </form>

                <hr className="border-t-2 border-zinc-200 mt-2  mb-2 dark:border-gray-600 w-full"/>

                <button onClick={() => onNavigate('signup')} className="log-button">Załóż konto</button>
            </div>
        </div>
    );
};

export default Login;
