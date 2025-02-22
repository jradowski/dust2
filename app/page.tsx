"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Komentarze from "@/Komentarze";
import Link from "next/link";
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
        <main className="grid place-items-center gap-12 text-zinc-700 dark:text-white pt-8">
            {/* Hero section */}
            <div
                className="text-center text-black py-12 bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white w-full">
                <h1 className="lg:text-4xl sm:text-3xl font-bold mb-4 p-2">
                    Stable Assistant </h1>
                <h2 className="lg:text-2xl sm:text-2xl font-bold mb-4 p-2">
                    Zarządzanie Stajnią Jeszcze Nigdy Nie Było Tak Proste!<br></br>
                    Wszystko to możliwe bez wychodzenia z domu!
                </h2>

                <p className="lg:text-lg sm:text-sm my-6">
                    Dołącz do użytkowników, którzy uprościli swoje codzienne zadania dzięki naszej aplikacji!
                </p>
                <Link href="/home">
                    <button
                        className="px-6 py-3 bg-white text-blue-600 rounded-full shadow-lg hover:bg-gray-100 font-semibold">
                        Jesteś użytkownikiem?
                        Zaloguj się już teraz!
                    </button>
                </Link>
            </div>

            {/* Benefits section */}
            <div className="w-10/12 grid gap-8 lg:grid-cols-3 ">
                {[
                    {
                        icon: "/images/schedule.png",
                        title: "Planowanie",
                        text: "Miej pełną kontrolę nad opieką twoimi końmi."
                    },
                    {
                        icon: "/images/tasks.png",
                        title: "Zarządzanie",
                        text: "Zarządzaj personelem, twórz harmonogramy i przydzielaj zadania pracownikom."
                    },
                    {
                        icon: "/images/analytics.png",
                        title: "Kontrola",
                        text: "Monitoruj terminy weterynaryjne, plany treningowe koni i wiele więcej."
                    },
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

                    </h1>
                </div>

                <div
                    ref={galleryRef}
                    className="flex gap-6 overflow-x-auto scroll-snap-x  "
                >
                    {["third", "3", "zdj1", "second", "stable", "6", "2"].map(
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
            </div>


            <div
                className="w-11/12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-8 px-6 rounded-xl shadow-lg relative">
                <div className=" text-center font-bold text-2xl mb-6">
                    <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
                        Podziel się z nami swoją opinią!</h2>
                    <Komentarze/>
                </div>
            </div>


            <div
                className="bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white w-full py-8 text-center">
                <h1 className="lg:text-4xl sm:text-3xl font-bold  p-2">
                    Sprawdź też wersję mobilną!
                </h1>
                <p className="lg:text-lg sm:text-sm mb-6">
                    Dla twojej wygody zarządzaj stajnią z swojego telefonu już teraz z dowolnego miejsca.
                </p>

                <div className="grid place-items-center w-full">
                    <Image src="/images/kodqr.png" alt={"kod qr"} width={150} height={150}
                           className="rounded-xl shadow-lg"/>
                </div>

            </div>

        </main>
    );
}