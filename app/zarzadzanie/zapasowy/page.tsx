import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import 'reactjs-popup/dist/index.css'
import supabase from '@/supabaseClient.js';
import UserForm from '@/UserForm';
import UsunWiersz from '@/UsunWiersz';
import ModyfikujKonia from '@/ModyfikujKonia';
import Kowal from '@/Kowal';
import Szczepienie from '@/Szczepienie';
import MessageSender from '@/MessageSender';
import NotePad from '@/NotePad';
import Inbox from '@/Inbox';
import UserList from '@/UserList';



const Home = async () => {

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-4">

            <div
                className="bg-gradient-to-b text-center from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                <div
                    className="text-transparent text-center font-bold text-2xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                    <h1>Usuń konia z bazy</h1>
                </div>

                <div className="flex flex-col text-xl mt-6 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <h1 className="font-bold text-black text-center text-2xl w-auto">
                    </h1>
                    <UsunWiersz/>
                </div>

            </div>

        </main>


    )
}

export default Home;