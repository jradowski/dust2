'use client';
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UserProvider } from '@/UserContext';
import ProtectedSection from '@/ProtectedSection'; // Jeśli używasz tego komponentu
import { useUser } from '@/UserContext';
import write from '@/write.png';

export default function page() {
    return (
        <main className=" items-center justify-between p-4">
        <UserProvider>
        <ProtectedSection requiredRole="wlasciciel_stajni"> 
            <div className="mb-32 flex flex-col gap-4 text-center lg:mb-0 lg:w-full  lg:grid-cols-3 lg:text-left">



                <Link href="/zarzadzanie/modboksy">
                    <div
                        className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium flex items-center">

                        <img src="/images/mod.png" alt="Image 1"
                             className="w-14 m-2 h-auto"/>

                        <h2 className="mb-3 text-2xl font-semibold">
                            Modyfikacja konia{" "}
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
                            </span>
                        </h2>
                    </div>
                </Link>

                <Link href="/zarzadzanie/modkonie">
                    <div
                        className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium flex items-center">

                        <img src="/images/plus.png" alt="Image 1"
                             className="w-14 m-2 h-auto"/>

                        <h2 className="mb-3 text-2xl font-semibold">
                            Dodaj konia{" "}
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
                        </h2>
                    </div>
                </Link>


                <Link href="/zarzadzanie/zapasowy">
                    <div
                        className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium flex items-center">

                        <img src="/images/minus.png" alt="Image 1"
                             className="w-14 m-2 h-auto"/>

                        <h2 className="mb-3 text-2xl font-semibold">
                            Usuń konia{" "}
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
                        </h2>
                    </div>
                </Link>
                <Link href="/zarzadzanie/modtrening">
                    <div
                        className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium flex items-center">
                        <img src="/images/train.png" alt="Image 1"
                             className="w-14 m-2 h-auto"/>

                        <h2 className="mb-3 text-2xl font-semibold">
                            Zmiana treningu{" "}
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
                        </h2>

                    </div>
                </Link>


            </div>


        </ProtectedSection>
        </UserProvider>
        </main>
    )
}