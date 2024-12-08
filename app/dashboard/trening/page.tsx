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
import '@/boxtabela.css';


export default function page() {

    return (
        <main className="flex flex-col gap-8 items-center text-black  dark:text-zinc-500  justify-between ">


            <div
                className="content-center  w-11/12 grid grid-cols-1 gap-10 bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white p-6 rounded-xl shadow-lg text-justify text-lg font-medium items-center ">


                <h1 className="text-3xl dark:text-white text-center font-bold">Tygodniowy plan treningowy</h1>
                <div className="bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white p-6 rounded-xl shadow-lg text-justify text-lg font-medium flex items-center">
                    <TreningTabela/>
                </div>

            </div>

            <div
                className="content-center w-11/12 grid grid-cols-1 gap-10 bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white p-6 rounded-xl shadow-lg text-justify text-lg font-medium items-center">

                <h1 className="text-3xl dark:text-white text-center font-bold">Zmień plan treningowy</h1>
                <div
                    className="bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white p-6 rounded-xl shadow-lg text-justify text-lg font-medium flex items-center">
                    <EditableTable/>

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