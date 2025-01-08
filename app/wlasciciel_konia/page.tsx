'use client';
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import KowalWlasc from "@/KowalWlasc";
import SzczepienieWlasc from "@/SzczepienieWlasc";
import Kowal from "@/Kowal";
import Szczepienie from "@/Szczepienie";

// import  { useEffect } from 'react';
// import { useUser } from '@/UserContext';  
// useEffect(() => {
//     // Sprawdzamy, czy strona była już odświeżona
//     const hasRefreshed = sessionStorage.getItem('hasRefreshed');

//     if (!hasRefreshed) {
//         // Jeśli strona nie była jeszcze odświeżona, to ustawiamy flagę i wykonujemy przekierowanie
//         sessionStorage.setItem('hasRefreshed', 'true');
        
//         // Przekierowujemy użytkownika na tę samą stronę (wymusza to przeładowanie strony)
//         window.location.href = window.location.href;
//     }
// }, []);
export default function page() {
     
    return (
        <main className="flex flex-col items-center justify-between p-4 sm:p-6 lg:p-24">

            <div
                className="grid  sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 text-center  lg:w-full lg:text-left">
                <Link href="/wlasciciel_konia/moje_konie">
                    <div
                        className="bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium ">
                        <Image src="/images/box.png" alt="Box image" width={64} height={64} className="m-2 h-auto"/>
                        <h2 className="text-xl sm:text-2xl font-semibold">
                            Boksy
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"> -&gt; </span>
                        </h2>
                    </div>
                </Link>

                <Link href="/wlasciciel_konia/treningi">
                    <div
                        className="bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium">
                        <Image src="/images/padok2.png" alt="Padok image" width={64} height={64}
                               className="m-2 h-auto"/>
                        <h2 className="text-xl sm:text-2xl font-semibold">
                            Trening
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"> -&gt; </span>
                        </h2>
                    </div>
                </Link>

                <Link href="/wlasciciel_konia/zarzadzaj_wlasciciel">
                    <div
                        className="bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium">
                        <Image src="/images/train.png" alt="Train image" width={72} height={64} className="m-2 h-auto"/>
                        <h2 className="text-xl sm:text-2xl font-semibold">
                            Zarządzanie
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"> -&gt; </span>
                        </h2>
                    </div>
                </Link>
            </div>


            <div
                className="mt-10 bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium w-full">
                <div
                    className="flex flex-col md:flex-row items-center justify-center text-center md:text-left bg-transparent  rounded-tl-xl">
                    <h2 className="text-xl sm:text-2xl font-semibold">Przypominajka</h2>
                    <Image src="/images/blink.png" alt="Reminder image" width={64} height={64} className="m-2 h-auto"/>
                </div>

                <div
                    className="mt-10 bg-blue-300 drop-shadow-lg dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium w-full">
                    <div>
                        <h1 className="font-bold text-center text-xl sm:text-2xl w-auto">Kowal</h1>
                        <KowalWlasc/>
                    </div>
                    <hr className="border-t-2 border-zinc-200 dark:border-gray-600 my-8"/>
                    <div>
                        <h1 className="font-bold text-center text-xl sm:text-2xl w-auto">Szczepienie</h1>
                        <SzczepienieWlasc/>
                    </div>
                </div>
            </div>

        </main>
    )
}