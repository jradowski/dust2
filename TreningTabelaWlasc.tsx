"use client";
import React, { useEffect, useState } from 'react';
import supabase from '@/supabaseClient';
import '@/globals.css';
import '@/boxtabela.css';
import '@/tabela.css';

type HorseData = {
    id: number;      // ID konia
    wlasc_id: string; // ID właściciela
    imie: string;    // Imię konia
};

type TreningData = {
    nr_konia: number;  // ID konia
    imie: string;      // Imię konia
    poniedzialek: any;
    wtorek: any;
    sroda: any;
    czwartek: any;
    piatek: any;
    sobota: any;
    niedziela: any;
    jezdziec: any;
    luzak: any;
    [key: string]: any; // Inne pola
};

const TreningTable: React.FC = () => {
    const [columns, setColumns] = useState<string[]>([]);
    const [data, setData] = useState<TreningData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id;

            if (!userId) {
                console.error('Nie znaleziono zalogowanego użytkownika.');
                setLoading(false);
                return;
            }

            const { data: horses, error: horseError } = await supabase
                .from('horse')
                .select('*')
                .eq('wlasc_id', userId);

            if (horseError) {
                console.error('Błąd przy pobieraniu koni:', horseError);
                setLoading(false);
                return;
            }

            if (!horses || horses.length === 0) {
                console.log('Brak koni dla zalogowanego użytkownika.');
                setLoading(false);
                return;
            }

            const horseIds = horses.map(horse => horse.id);
            const { data: treningi, error: treningError } = await supabase
                .from('trening')
                .select('nr_konia, imie, poniedzialek, wtorek, sroda, czwartek, piatek, sobota, niedziela, jezdziec, luzak')
                .in('nr_konia', horseIds);

            if (treningError) {
                console.error('Błąd przy pobieraniu treningów:', treningError);
                setLoading(false);
                return;
            }

            if (treningi && treningi.length > 0) {
                setColumns(Object.keys(treningi[0]));
                setData(treningi);
            } else {
                console.log('Brak treningów dla Twoich koni.');
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Ładowanie danych...</div>;
    }

    if (data.length === 0) {
        return <div>Brak dostępnych treningów dla Twoich koni.</div>;
    }

    return (

            <div
                className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700 rounded-xl">
                    <thead className="bg-blue-600">
                    <tr>
                        {columns.map((column) => (
                            <th key={column}  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{column}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="bg-white dark:bg-gray-800">
                            {columns.map((column) => (
                                <td key={column} className="px-4 py-2 text-gray-800 dark:text-gray-200 whitespace-normal break-words max-w-xs">
                                    {row[column]?.toString() || ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
    );
};

export default TreningTable;
