"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Komentarze from "@/Komentarze";

export default function AutoScrollingGallery() {
    const galleryRef = useRef<HTMLDivElement | null>(null);

    const scroll = (direction: "left" | "right") => {
        if (galleryRef.current) {
            const scrollAmount = galleryRef.current.clientWidth;
            galleryRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <main className="grid place-items-center gap-12 text-zinc-700 dark:text-white pb-6 pt-8">
            {/* Hero section */}
            <div className="text-center text-black py-12 bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white w-full">
                <h1 className="lg:text-4xl sm:text-3xl font-bold mb-4">
                    Stable Assistant – Zarządzanie Stajnią Jeszcze Nigdy Nie Było Tak Proste!
                </h1>
                <p className="lg:text-lg sm:text-sm mb-6">
                    Dołącz do użytkowników, którzy uprościli swoje codzienne zadania dzięki naszej aplikacji.
                </p>
                <button
                    className="px-6 py-3 bg-white text-blue-600 rounded-full shadow-lg hover:bg-gray-100 font-semibold">
                    Wypróbuj za darmo
                </button>
            </div>

            {/* Benefits section */}
            <div className="w-10/12 grid gap-8 lg:grid-cols-3">
                {[
                    {icon: "/images/schedule.png", title: "Planowanie", text: "Twórz harmonogramy opieki nad końmi."},
                    {icon: "/images/tasks.png", title: "Zarządzanie", text: "Przydzielaj zadania personelowi."},
                    {icon: "/images/analytics.png", title: "Kontrola", text: "Monitoruj terminy weterynaryjne."},
                ].map(({icon, title, text}, idx) => (
                    <div
                        key={idx}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center text-center"
                    >
                        <Image src={icon} alt={title} width={80} height={80} className="dark:invert"/>
                        <h2 className="text-xl font-bold mt-4 ">{title}</h2>
                        <p className="text-sm mt-2">{text}</p>
                    </div>
                ))}
            </div>


            {/* Gallery */}
            <div
                className="w-11/12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-8 px-6 rounded-xl shadow-lg relative">
                <div className="text-center font-bold text-2xl mb-6">
                    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                        Zobacz w akcji
                    </h1>
                </div>

                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-blue-500 hover:bg-blue-700 rounded-lg p-2 mx-10"
                >
                    &lt;
                </button>

                <div
                    ref={galleryRef}
                    className="flex gap-6 overflow-x-hidden scroll-snap-x snap-mandatory"
                    style={{scrollBehavior: "smooth"}}
                >
                    {["third", "zdj2", "3", "fifth", "zdj1", "second", "stable", "6", "2"].map(
                        (img, index) => (
                            <div
                                key={index}
                                className="snap-center flex-shrink-0 w-full max-w-screen-md mx-auto p-2 rounded-lg"
                            >
                                <div className="aspect-video overflow-hidden rounded-lg shadow-lg">
                                    <Image
                                        src={`/images/${img}.jpg`}
                                        alt={`Zdjęcie ${index + 1}`}
                                        width={1920}
                                        height={1080}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                        )
                    )}
                </div>

                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-blue-500 hover:bg-blue-700 rounded-lg p-2 mx-10"
                >
                    &gt;
                </button>
            </div>


            <div
                className="w-11/12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-8 px-6 rounded-xl shadow-lg relative">
                <div className=" text-center font-bold text-2xl mb-6">
                    <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">Opinie
                        naszych użytkowników</h2>
                    <Komentarze/>
                </div>
            </div>


            {/*
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-full py-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Gotowy na lepsze zarządzanie?</h2>
                <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold shadow-lg hover:bg-gray-100">
                    Zacznij za darmo już teraz
                </button>
            </div>
            */}
        </main>
    );
}
