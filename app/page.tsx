"use client";
import 'reactjs-popup/dist/index.css'
import React, { useEffect, useState } from 'react';
import supabase from '@/supabaseClient.js';
import SignUp from '@/SingUp';
import Login from '@/Login';
import Wylogowany from '@/Wylogowany';


const App: React.FC = () => {
    const [page, setPage] = useState<string>('home');
    const [userData, setUserData] = useState<any>(null);
    const [userName, setUserName] = useState<string | null>(null); // Ustawienie domyślne na null

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();

                if (error) {
                    throw error;
                }

                if (data) {
                    setUserData(data);
                    setUserName(data.user?.email || null); // Ustawienie userName na email użytkownika lub null, jeśli email nie jest zdefiniowany
                }
            } catch (error) {
                console.error('Error fetching user:');
                // Obsługa błędów
            }
        };

        fetchUser();
    }, []);
    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                throw error;
            }

            setUserData(null); // Wyczyść dane użytkownika po wylogowaniu
            window.location.reload();
        } catch (error) {
            console.error('Error signing out:');
            // Obsługa błędów wylogowania
        }
    };
    const renderPage = () => {
        switch (page) {
            case 'signup':
                return <SignUp onNavigate={setPage} />;
            case 'login':
                return <Login onNavigate={setPage} />;
            case 'wylogowany':
                return <Wylogowany onNavigate={setPage} userData={userData} />;
            default:
                return (
                    <div className="flex items-center justify-center mt-6">

                        {userData==null && (

                            <Login onNavigate={setPage}/>
                        )}

                        {userData && (
                            <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                                <div
                                    className=" bg-gradient-to-b justify-items-center from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">

                                    <div className="text-2xl p-2">
                                        <h1>{userName !== null ? ` ${userName}` : ''}</h1>
                                    </div>

                                    <button onClick={handleLogout}
                                            className="px-6 py-2 text-xl w-fit drop-shadow-lg text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white dark:drop-shadow-lg">Wyloguj
                                    </button>
                                </div>
                            </div>

                        )}
                    </div>

                );

        }

    };

    return <div>{renderPage()}</div>;
};

export default App;