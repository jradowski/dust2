"use client";
import { useRef } from "react";
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
            <div className="w-11/12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-8 px-6 rounded-xl shadow-lg relative">
                <div className="text-center font-bold text-2xl mb-6">
                    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                        Galeria
                    </h1>
                </div>

                {/* Strzałka w lewo */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-blue-500 hover:bg-blue-700 rounded-lg p-2 mx-10"
                >
                    &lt;
                </button>

                <div
                    ref={galleryRef}
                    className="flex gap-6 overflow-x-hidden scroll-snap-x snap-mandatory"
                    style={{ scrollBehavior: "smooth" }}
                >
                    {["third", "12", "3", "fifth", "fourth", "second", "stable", "6", "2"].map(
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

                {/* Strzałka w prawo */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-blue-500 hover:bg-blue-700 rounded-lg p-2 mx-10"
                >
                    &gt;
                </button>
            </div>

            <hr className="border-t-2 border-zinc-300 dark:border-gray-700 w-11/12" />

            {/* Sekcja kontaktowa */}
            <div className="w-10/12">
                <div className="text-transparent text-center font-bold text-2xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                    <h1>Skontaktuj się z nami:</h1>
                </div>
                <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
                    <Komentarze />
                </div>
            </div>
        </main>
    );
}
