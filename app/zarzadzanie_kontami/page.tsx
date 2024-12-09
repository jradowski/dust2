import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Kowal from "@/Kowal";
import Szczepienie from "@/Szczepienie";
import Nowy_uz from "@/Nowy_uz"
import Pokaz from "@/Pokaz_konie_admin"
import Przypnij from "@/Przypnij_konia"
import Usun from "@/Usun_user"
import Reset from "@/Reset_hasla"
import '@/globals.css'


export default function page() {
    return (
        <main className="grid grid-cols-1 gap-10 items-center justify-between p-4">

                <div
                    className=" w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                        <div
                            className="text-transparent text-center font-bold text-3xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                                <h1>Stwórz nowego użytkownika</h1>
                        </div>

                        <Nowy_uz/>

                </div>
                <div
                    className=" w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                        <div
                            className="text-transparent text-center font-bold text-3xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                                <h1>Właściciele koni w stajni</h1>
                        </div>

                        <Pokaz/>

                </div>


                <div
                    className=" w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                        <div
                            className="text-transparent text-center font-bold text-3xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                                <h1>Przypisz konia do właściciela</h1>
                        </div>

                        <Przypnij/>

                </div>

                <div
                    className=" w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                        <div
                            className="text-transparent text-center font-bold text-3xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                                <h1>Usuń użytkownika</h1>
                        </div>

                        <Usun/>

                </div>

                <div
                    className=" w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                        <div
                            className="text-transparent text-center font-bold text-3xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                                <h1>Resetowanie hasła</h1>
                        </div>

                        <Reset/>

                </div>



        </main>
    )
}