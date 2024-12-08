"use client";
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import 'reactjs-popup/dist/index.css'
import supabase from '@/supabaseClient.js'
import { useEffect, useState } from 'react'
//import './tabela.css'; // Importowanie pliku CSS



interface TreningJedenProps {
    horseIdT: number; // ID konia
}

type TreningData = {
    [key: string]: any; // Typowanie ogólne dla kolumn
};

const TreningJeden: React.FC<TreningJedenProps> = ({ horseIdT }) => {
    const [columns, setColumns] = useState<string[]>([]);
    const [data, setData] = useState<TreningData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Pobieranie danych z tabeli 'trening'
            let { data, error } = await supabase
                .from('trening')
                .select('imie, poniedzialek, wtorek, sroda, czwartek, piatek, sobota, niedziela, jezdziec, luzak')
                .eq('nr_konia',  horseIdT);


            if (error) {
                console.error(error);
                setLoading(false);
                return;
            }

            if (data && data.length > 0) {
                // Pobieranie nazw kolumn z pierwszego wiersza danych
                setColumns(Object.keys(data[0]));
                setData(data);
            }

            setLoading(false);
        };

        fetchData();
    }, [horseIdT]);

    if (loading) {
        return <div>Ładowanie danych...</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table
                className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700 rounded-xl">
                <thead className="bg-blue-600">
                <tr>

                    {columns.map((column) => (
                        <th key={column}
                            className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{column}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="bg-white dark:bg-gray-800">
                        {columns.map((column) => (
                            <td key={column}
                                className="px-4 py-2 text-gray-800 dark:text-gray-200 whitespace-normal break-words max-w-xs">{row[column]} </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
            );
            };

            export default TreningJeden;