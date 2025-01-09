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


export default function page() {

    return (
        <main className="flex flex-col items-center gap-16 text-black  dark:text-zinc-500  justify-between ">


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
                className="xl:w-3/5 content-center   grid grid-cols-1 gap-10 bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white p-6 rounded-xl shadow-lg text-justify text-lg font-medium items-center ">

                <h1 className="text-3xl dark:text-white text-center font-bold">Parkur</h1>
                
                <Link href="/moj_parkur">
                <button
                    className="px-6 py-3 bg-white text-blue-600 rounded-full shadow-lg hover:bg-gray-100 font-semibold text-center">
                    Kliknij i zaprojektuj swój parkur lub skorzystaj z gotowych wzorców
                </button>
                </Link>
                

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