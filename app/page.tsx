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

                        <div className=" font-sans text-center font-semibold justify-center w-72 p-2 text-xl border-b rounded-2xl border-gray-500 border-opacity-50 bg-gradient-to-b from-gray-400 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b dark:border-gray-600 dark:border-opacity-50 dark:text-white">
                            {userData==null && (

                                <button onClick={() => setPage('login')}>Logowanie</button>
                            )}


<<<<<<< HEAD
                <div
                    className=" rounded-tl-xl  text-2xl text-justify mx-2 bg-white border-r-2 border-b-2 border-zinc-200 p-5 font-sans dark:font-sans dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-r-2 dark:border-gray-600 ">
                    <h1>
                        Zarządzanie stajnią jeszcze nigdy nie było łatwiejsze dzięki Stable Assistant! Nasza
                        aplikacja
                        zapewnia kompleksowe narzędzia do efektywnego zarządzania
                        każdym aspektem stajni. Śledź harmonogramy karmienia, terminy weterynaryjne i szczepień,
                        zarządzaj zadaniami dla personelu oraz kontroluj zapasy - wszystko
                        w jednym miejscu. Niezależnie od tego, czy jesteś właścicielem stajni, trenerem czy
                        hodowcą,
                        Stable Assistant umożliwia sprawną organizację i oszczędność czasu.
                    </h1>
                </div>
                <div className="object-center">
                    <Image
                        className="drop-shadow-2xl object-fill rounded-tl-xl "
                        src="/images/1.jpg"
                        alt="zdjęcie"
                        width={2000}
                        height={1000}
                    ></Image>
                </div>
            </div>
            <hr className="border-t-2 border-zinc-200 dark:border-gray-600 w-11/12"/>

            <div
                className="bg-white border-zinc-200 dark:bg-zinc-800 border-y-2 w-full dark:border-gray-600 p-2 ">
                <div
                    className="text-center border-zinc-200 border-b-2 dark:border-gray-600 font-sans text-2xl font-bold">
                    <h1>Galeria</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 m-2 ">
                    <img src="/images/third.jpg" alt="Image 1"
                         className="w-64 h-auto aspect-square object-cover shadow-lg hover:scale-105 transition-transform duration-300"/>
                    <img src="/images/12.jpg" alt="Image 2"
                         className="w-64 h-auto aspect-square object-cover shadow-lg hover:scale-105 transition-transform duration-300"/>
                    <img src="/images/3.jpg" alt="Image 3"
                         className="w-64 h-auto aspect-square object-cover shadow-lg hover:scale-105 transition-transform duration-300"/>
                    <img src="/images/first.jpg" alt="Image 4"
                         className="w-64 h-auto aspect-square object-cover shadow-lg hover:scale-105 transition-transform duration-300"/>
                    <img src="/images/fifth.jpg" alt="Image 5"
                         className="w-64 h-auto aspect-square object-cover shadow-lg hover:scale-105 transition-transform duration-300"/>
                    <img src="/images/fourth.jpg" alt="Image 6"
                         className="w-64 h-auto aspect-square object-cover shadow-lg hover:scale-105 transition-transform duration-300"/>
                    <img src="/images/second.jpg" alt="Image 7"
                         className="w-64 h-auto aspect-square object-cover shadow-lg hover:scale-105 transition-transform duration-300"/>
                    <img src="/images/stable.jpg" alt="Image 8"
                         className="w-64 h-auto aspect-square object-cover shadow-lg hover:scale-105 transition-transform duration-600"/>
                </div>
            </div>

            <hr className="border-t-2 border-zinc-200 dark:border-gray-600 w-11/12"/>

            <div
                className="bg-white border-zinc-200 dark:bg-zinc-800 border-y-2 w-full dark:border-gray-600 p-2 ">
                <div
                    className="text-center border-zinc-200 border-b-2 dark:border-gray-600 font-sans text-2xl font-bold">
                    <h1>Zostaw komentarz</h1>
                </div>
                <div
                    className="content-center ml-8 w-auto grid grid-cols-1 gap-10 rounded-tl-xl  text-xl text-justify mb-10 bg-white  border-zinc-200 p-5 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2  dark:border-gray-600   ">
                    <div>
                        <h1 className="font-bold text-center text-2xl w-auto">
=======
                            <h1>{userName !== null ? `Witaj: ${userName}` : ''}</h1>
                            {userData && (
                                <button onClick={handleLogout}>Wyloguj</button>
                            )}
                        </div>
                    </div>
                );

        }
>>>>>>> c7fe553dbbf6ae65702a73e6a40e382ba15a66df

    };

    return <div>{renderPage()}</div>;
};

export default App;