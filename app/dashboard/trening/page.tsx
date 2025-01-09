"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css'
import supabase from '@/supabaseClient.js';
import { useEffect, useState } from 'react';
import TreningTabela from '@/TreningTabela';
import EditableTable from '@/EditableTable';
import { UserProvider } from '@/UserContext';
import ProtectedSectionMenu from '@/ProtectedSectionMenu';

export default function page() {

    return (
        <main className="flex flex-col items-center justify-between gap-10 p-4 sm:p-6 md:p-8 lg:p-24">


            <div
                className="xl:w-3/5 content-center   grid grid-cols-1 gap-10 bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white p-6 rounded-xl shadow-lg text-justify text-lg font-medium items-center ">


                <h1 className="text-3xl dark:text-white text-center font-bold">Tygodniowy plan treningowy</h1>
                <div className="bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white p-6 rounded-xl shadow-lg text-justify text-lg font-medium flex items-center justify-center    ">
                    <TreningTabela/>
                </div>

            </div>
            <UserProvider>
            <ProtectedSectionMenu requiredRole="wlasciciel_stajni">  
            <div
                className="xl:w-3/5 content-center grid grid-cols-1 gap-10 bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white p-6 rounded-xl shadow-lg text-justify text-lg font-medium items-center">
                    
                <h1 className="  text-3xl dark:text-white text-center font-bold">Zmień plan treningowy</h1>
                <div
                    className="bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white text-center p-6 rounded-xl shadow-lg text-lg font-medium flex items-center justify-center">
                    <EditableTable/>
                </div>

            
            </div>
            </ProtectedSectionMenu>
            </UserProvider>
            <UserProvider>
            <ProtectedSectionMenu requiredRole="pracownik">  
            <div
                className="xl:w-3/5 content-center grid grid-cols-1 gap-10 bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white p-6 rounded-xl shadow-lg text-justify text-lg font-medium items-center">
                    
                <h1 className="  text-3xl dark:text-white text-center font-bold">Zmień plan treningowy</h1>
                <div
                    className="bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white text-center p-6 rounded-xl shadow-lg text-lg font-medium flex items-center justify-center">
                    <EditableTable/>
                </div>

            
            </div>
            </ProtectedSectionMenu>
            </UserProvider>
            <div
                className="xl:w-3/5 content-center   grid grid-cols-1 gap-10 bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white p-6 rounded-xl shadow-lg text-justify text-lg font-medium items-center ">

                <h1 className="text-3xl dark:text-white text-center font-bold">Parkour</h1>
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


        </main>


    )
}