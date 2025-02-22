"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css'
import supabase from '@/supabaseClient.js';
import { useEffect, useState } from 'react';
import TreningTabelaWlasc from '@/TreningTabelaWlasc';
import EditableTableWlasc from '@/EditableTbleWlasc';
import '@/boxtabela.css';
import { UserProvider } from '@/UserContext';
import ProtectedSection from '@/ProtectedSection';

export default function page() {

    return (
        <main className="flex flex-col items-center gap-16 text-black  dark:text-zinc-500  justify-between ">
  <UserProvider>
  <ProtectedSection requiredRole="wlasciciel_koni">

            <div
                className=" text-center  w-10/12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">

                <h1
                    className="text-transparent  font-bold text-3xl p-4 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                    Tygodniowy plan treningu
                </h1>
                <div>
                    <TreningTabelaWlasc />
                </div>

            </div>


            <div
                className=" text-center w-10/12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">

                <h1
                    className="text-transparent  font-bold text-3xl p-4 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                    Zmień plan treningowy
                </h1>
                <div>
                    <EditableTableWlasc/>
                </div>

            </div>

            <div
               className=" text-center w-10/12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">

                <h1  className="text-transparent  font-bold text-3xl p-4 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">Parkour</h1>
                <div className="flex items-center justify-center  ">
                <Link href="/moj_parkur">
                <button
                    className="px-6 py-2 w-fit text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white">
                    Kliknij i zaprojektuj swój parkour lub skorzystaj z gotowych wzorców
                </button>
                </Link>
                </div>

            </div>


            {/* Uzupełnij kalendarz na kolejne 2 tygodnie:
        <div className="columns-2 font-mono border-b border-gray-300 bg-gradient-to-b from-zinc-200 px-5 py-4 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit rounded-3xl content-center m-20">
            <div>
            </div>

            <div>
                <h1 className="font-bold text-center text-2xl w-auto">

                </h1>

            </div>

        </div> */}


</ProtectedSection>
</UserProvider>
        </main>


    )
}