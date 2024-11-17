"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import 'reactjs-popup/dist/index.css';
import supabase from '@/supabaseClient.js';
import Image from 'next/image';

// Typy danych dla koni (Horse)
interface Horse {
    imie: string;
    image_url: string;
}

const fetchDataForBox = async (boxNumber: number): Promise<Horse> => {
    const { data, error } = await supabase
        .from('horse')
        .select('*')
        .eq('nr_boksu', boxNumber)
        .single();

    // Zwracamy "wolny" jeśli brak konia w boksie lub wystąpił błąd
    return error || !data ? { imie: 'wolny', image_url: '' } : data;
};

const Page: React.FC = () => {
    const [horses, setHorses] = useState<Horse[]>([]); // Przechowujemy dane koni
    const boxNumbers: number[] = [1, 2, 3, 4, 5]; // Numery boksów

    // Pobieranie danych w momencie załadowania komponentu
    useEffect(() => {
        const fetchHorses = async () => {
            try {
                // Uruchamiamy zapytania równolegle
                const horsesData = await Promise.all(boxNumbers.map((boxNumber) => fetchDataForBox(boxNumber)));
                setHorses(horsesData); // Zapisujemy dane do stanu
            } catch (error) {
                console.error("Error fetching horses:", error);
            }
        };

        fetchHorses();
    }, []);

    return (
        <main className=" flex flex-col min-h-screen p-24 justify-between">
            {/* Kontener z siatką, 2 kolumny w jednym rzędzie */}
            <div className="grid grid-cols-3 gap-5 text-center lg:mb-0 lg:w-full lg:text-left">
                {horses.map((horse, index) => (
                    <Link href={`/dashboard/boxes/Box${index + 1}`} key={index}>
                        <div className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium flex items-center">

                            <h2 className="mb-3 pr-10 text-6xl font-bold">
                                {index + 1}{" "}
                            </h2>

                            <div className="flex-shrink-0 w-36 h-36 mr-4">
                                {horse.image_url ? (
                                    <Image
                                        src={horse.image_url}
                                        alt={`Zdjęcie konia ${horse.imie}`}
                                        width={200}
                                        height={200}
                                        className="rounded-lg object-cover aspect-square drop-shadow-lg dark:drop-shadow-lg" // Zmienione na 'rounded-lg'
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 rounded-lg"/> // Zmienione na 'rounded-lg'
                                )}
                            </div>
                            <div className="flex flex-row ">

                                <div>
                                    <p className="mb-3 px-2 text-4xl font-semibold ">
                                        {horse.imie}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
};

export default Page;
