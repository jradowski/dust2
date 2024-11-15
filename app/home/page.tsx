import Image from "next/image";
import Komentarze from "@/Komentarze";
import React from "react";

export default function Page() {
    return (
        <main className="grid place-items-center gap-12 font-sans mt-16 text-zinc-700 dark:text-white pb-6 pt-8">
            {/* Sekcja z tekstem i obrazem */}
            <div className="flex flex-col lg:flex-row w-10/12 gap-8 items-center">
                <Image
                    className="rounded-xl shadow-lg object-cover"
                    src="/images/2.jpg"
                    alt="Zdjęcie"
                    width={600}
                    height={400}
                />
                <div className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium">
                    <h1>
                        Zarządzanie stajnią jeszcze nigdy nie było łatwiejsze dzięki Stable Assistant! Nasza
                        aplikacja zapewnia kompleksowe narzędzia do efektywnego zarządzania każdym aspektem
                        stajni. Śledź harmonogramy karmienia, terminy weterynaryjne i szczepień, zarządzaj
                        zadaniami dla personelu oraz kontroluj zapasy - wszystko w jednym miejscu.
                        Niezależnie od tego, czy jesteś właścicielem stajni, trenerem czy hodowcą, Stable
                        Assistant umożliwia sprawną organizację i oszczędność czasu.
                    </h1>
                </div>
            </div>

            <hr className="border-t-2 border-zinc-300 dark:border-gray-700 w-11/12" />

            {/* Kolejna sekcja z tekstem i obrazem */}
            <div className="flex flex-col lg:flex-row-reverse w-10/12 gap-8 items-center">
                <Image
                    className="rounded-xl shadow-lg object-cover"
                    src="/images/1.jpg"
                    alt="Zdjęcie"
                    width={600}
                    height={400}
                />
                <div className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium">
                    <h1>
                        Zarządzanie stajnią jeszcze nigdy nie było łatwiejsze dzięki Stable Assistant! Nasza
                        aplikacja zapewnia kompleksowe narzędzia do efektywnego zarządzania każdym aspektem
                        stajni. Śledź harmonogramy karmienia, terminy weterynaryjne i szczepień, zarządzaj
                        zadaniami dla personelu oraz kontroluj zapasy - wszystko w jednym miejscu.
                    </h1>
                </div>
            </div>

            <hr className="border-t-2 border-zinc-300 dark:border-gray-700 w-11/12" />

            {/* Sekcja galerii */}
            <div className="w-10/12">
                <div className="text-center font-bold text-2xl mb-6">
                    <h1>Galeria</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {["third", "12", "3", "first", "fifth", "fourth", "second", "stable"].map((img, index) => (
                        <Image
                            key={index}
                            src={`/images/${img}.jpg`}
                            alt={`Zdjęcie ${index + 1}`}
                            width={300}
                            height={300}
                            className="rounded-lg shadow-lg object-cover hover:scale-105 transition-transform duration-300"
                        />
                    ))}
                </div>
            </div>

            <hr className="border-t-2 border-zinc-300 dark:border-gray-700 w-11/12" />

            {/* Sekcja kontaktowa */}
            <div className="w-10/12">
                <div className="text-center font-bold text-2xl mb-6">
                    <h1>Skontaktuj się z nami:</h1>
                </div>
                <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                    <Komentarze />
                </div>
            </div>
        </main>
    );
}
