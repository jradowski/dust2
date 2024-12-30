'use client';
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import KowalWlasc from "@/KowalWlasc";
import SzczepienieWlasc from "@/SzczepienieWlasc";
import Kowal from "@/Kowal";
import Szczepienie from "@/Szczepienie";

import  { useEffect } from 'react';
import { useUser } from '@/UserContext';  

export default function page() {
     useEffect(() => {
            // Sprawdzamy, czy strona była już odświeżona
            const hasRefreshed = sessionStorage.getItem('hasRefreshed');
    
            if (!hasRefreshed) {
                // Jeśli strona nie była jeszcze odświeżona, to ustawiamy flagę i wykonujemy przekierowanie
                sessionStorage.setItem('hasRefreshed', 'true');
                
                // Przekierowujemy użytkownika na tę samą stronę (wymusza to przeładowanie strony)
                window.location.href = window.location.href;
            }
        }, []);
    return (
        <main className=" items-center justify-between p-24">

            <div
                className=" flex flex-col gap-4  text-center lg:w-full  lg:grid-cols-3 lg:text-left">

                <Link href="/wlasciciel_konia/moje_konie">
                    <div
                        className=" bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium">
                        <img src="/images/box.png" alt="Image 1"
                             className="w-16 m-2 h-auto"/>

                        <h2 className="text-2xl font-semibold">
                            Moje konie{" "}
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
                        </h2>

                    </div>
                </Link>

                <Link href="/wlasciciel_konia/treningi">
                    <div
                        className=" bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium">
                        <img src="/images/box.png" alt="Image 1"
                             className="w-16 m-2 h-auto"/>

                        <h2 className="text-2xl font-semibold">
                            Trening moich koni{" "}
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
                        </h2>

                    </div>
                </Link>

    <Link href="/wlasciciel_konia/zarzadzaj_wlasciciel">
                    <div
                        className=" bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium">
                        <img src="/images/box.png" alt="Image 1"
                             className="w-16 m-2 h-auto"/>

                        <h2 className="text-2xl font-semibold">
                            Zarządzaj moimi końmi{" "}
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
                        </h2>

                    </div>
                </Link>


            </div>


            <div className="w-11/12  border-t-1 border-gray-600"></div>
            <div
                className="mt-20 bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium"
            >
                <div
                    className=" flex flex-row rounded-tl-xl  text-2xl items-center justify-center t mx-2 bg-transparent p-5  ">

                    <h2 className="text-2xl font-semibold">
                        Przypominajka
                    </h2>

                    <img src="/images/blink.png" alt="Image 1"
                         className="w-16 m-2 h-auto"/>

                </div>

                <div>
                    <h1 className="font-bold text-center text-2xl w-auto">

                    </h1>
                    <KowalWlasc/>
                </div>
                <hr className="border-t-2 border-zinc-200 dark:border-gray-600 lg:w-full my-16 "/>
                <div>
                    <h1 className="font-bold text-center text-2xl w-auto">

                    </h1>
                    <SzczepienieWlasc/>
                </div>
                <hr className="border-t-2 border-zinc-200 dark:border-gray-600 lg:w-full my-16 "/>
                <div>
                    <h1 className="font-bold text-center text-2xl w-auto">

                    </h1>
                    Termin płatnośći
                </div>


            </div>

        </main>
    )
}