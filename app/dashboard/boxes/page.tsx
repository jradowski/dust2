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
    const boxNumbers: number[] = [1, 2, 3, 4, 5,6,7,8,9,10]; // Numery boksów

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
        <main className="flex flex-col p-4 sm:p-6 md:p-8 lg:p-24 justify-between">
            {/* Kontener z siatką */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-center lg:mb-0 lg:w-full lg:text-left">
                {horses.map((horse, index) => (
                    <Link href={`/dashboard/boxes/Box${index + 1}`} key={index}>
                        <div className="bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium flex flex-col items-center md:flex-row">
                            <h2 className="mb-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                                {index + 1}
                            </h2>

                            <div className="flex-shrink-0 w-36 h-36 my-3 ml-2 md:my-0 md:mr-4">
                                {horse.image_url ? (
                                    <Image
                                        src={horse.image_url}
                                        alt={`Zdjęcie konia ${horse.imie}`}
                                        width={200}
                                        height={200}
                                        className="rounded-lg object-cover aspect-square drop-shadow-lg dark:drop-shadow-lg"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 rounded-lg"/>
                                )}
                             </div>
                            <div className="text-center md:text-left">
                                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
                                    {horse.imie}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>

    );
};

export default Page;
