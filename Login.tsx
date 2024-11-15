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

            <div className="flex flex-row mt-6 font-sans text-center font-semibold justify-center w-fit p-2 px-4 text-2xl rounded-2xl bg-gray-400 drop-shadow-md text-black dark:bg-zinc-800 dark:drop-shadow-md  dark:text-white">

                <div className="flex flex-col p-5  ">

                    <div className="w-11/12">
                        <h1 className="text-3xl font-bold leading-10">Logowanie do Stable Assistant</h1>
                    </div>
                    <div className="text-left leading-10">
                        <form onSubmit={handleLogin}>
                            <label >
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
                            <div className="flex flex-row gap-4 mt-6 mb-2">

                                <button type="submit" className="custom-button dark:text-white dark:bg-gray-700">Zaloguj</button>
                                <button onClick={() => onNavigate('signup')} className="custom-button dark:text-white dark:bg-gray-700">Załóż konto</button>
                            </div>
                        </form>
                    </div>
                </div>



            </div>

    );
};

export default Login;
