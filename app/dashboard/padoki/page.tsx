"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import supabase from '@/supabaseClient.js';

// Funkcja do pobierania danych dla padoku
const fetchPadokData = async (padokNumber: number) => {
    try {
        const { data, error } = await supabase
            .from('horse')
            .select('*')
            .eq('nr_padoku', padokNumber)
            .single();

        if (error) {
            throw error;
        }

        // Sprawdź, czy dane są obecne i zawierają imię konia
        if (data && data.imie) {
            return data.imie; // Zwróć imię konia
        }

        // Jeśli brak konia, zwróć "wolny"
        return "wolny";
    } catch (error) {
        console.error('Error fetching data:', error);
        return "wolny"; // W przypadku błędu również zwróć "wolny"
    }
};

export default function Page() {
    const [padokData, setPadokData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Zastosowanie useEffect, by załadować dane równolegle
    useEffect(() => {
        const loadPadokData = async () => {
            setLoading(true);

            // Równoległe pobieranie danych dla wszystkich padoków (1-6)
            const padokNumbers = [1, 2, 3, 4, 5, 6];
            const data = await Promise.all(
                padokNumbers.map(padokNumber => fetchPadokData(padokNumber))
            );

            setPadokData(data);
            setLoading(false);
        };

        loadPadokData();
    }, []);

    if (loading) {
        return <div>Ładowanie...</div>;
    }

    return (
        <main className="flex min-h-screen font-sans flex-col items-center justify-between p-24">
            {/* Sekcja wyświetlająca grupy */}
            <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left">
                <Link href="/dashboard/boxes/Grupa1">
                    <div className="w-full rounded-lg border-2 border-transparent px-5 py-4 bg-gradient-to-t from-gray-300 border-gray-600 bg-gray-400 text-gray-800 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-2 dark:border-gray-600 dark:text-white">
                        <h2 className="mb-3 text-2xl font-semibold">
                            Grupa pierwsza
                        </h2>
                        <p className="m-0 max-w-[30ch] text-sm opacity-50">rano</p>
                    </div>
                </Link>
            </div>

            {/* Sekcja wyświetlająca padoki */}
            <div className="mb-32 gap-2 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left">
                {padokData.slice(0, 3).map((data, index) => (
                    <div key={index} className="group rounded-lg border-transparent px-5 py-4 border-2 bg-gradient-to-t from-gray-300 border-gray-600 bg-gray-400 text-gray-800 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-2 dark:border-gray-600 dark:text-white">
                        <h2 className="mb-3 text-2xl font-semibold">Padok nr {index + 1}</h2>
                        <p className="m-0 max-w-[30ch] text-sm opacity-50">{data}</p>
                    </div>
                ))}
            </div>

            {/* Sekcja wyświetlająca drugą grupę */}
            <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left">
                <Link href="/dashboard/boxes/Grupa2">
                    <div className="group rounded-lg border-2 border-transparent px-5 py-4 bg-gradient-to-t from-gray-300 border-gray-600 bg-gray-400 text-gray-800 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-2 dark:border-gray-600 dark:text-white">
                        <h2 className="mb-3 text-2xl font-semibold">
                            Grupa druga (ogiery)
                        </h2>
                        <p className="m-0 max-w-[30ch] text-sm opacity-50">po południu</p>
                    </div>
                </Link>
            </div>

            {/* Wyświetlanie kolejnych padoków */}
            <div className="mb-32 grid text-center gap-2 lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left">
                {padokData.slice(3).map((data, index) => (
                    <div key={index + 3} className="group rounded-lg border-transparent px-5 py-4 border-2 bg-gradient-to-t from-gray-300 border-gray-600 bg-gray-400 text-gray-800 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-2 dark:border-gray-600 dark:text-white">
                        <h2 className="mb-3 text-2xl font-semibold">Padok nr {index + 4}</h2>
                        <p className="m-0 max-w-[30ch] text-sm opacity-50">{data}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
