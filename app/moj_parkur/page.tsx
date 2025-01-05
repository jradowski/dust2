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
import PlanParkuru from '@/PlanParkuru';

export default function page() {

    return (
        <main className="flex flex-col items-center gap-16 text-black  dark:text-zinc-500  justify-between ">


            <div
                className=" text-center  w-10/12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">

                
            <PlanParkuru />




            </div>


        </main>


    )
}