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
    id: number;        // ID treningu
    nr_konia: number;  // ID konia
    data_treningu: string; // Data treningu
    [key: string]: any; // Inne pola
};

const TreningTable: React.FC = () => {
    const [columns, setColumns] = useState<string[]>([]);
    const [data, setData] = useState<TreningData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Pobranie ID zalogowanego użytkownika
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id;

            if (!userId) {
                console.error('Nie znaleziono zalogowanego użytkownika.');
                setLoading(false);
                return;
            }

            // 1. Pobranie koni należących do zalogowanego użytkownika
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

            // 2. Pobranie treningów dla koni
            const horseIds = horses.map(horse => horse.id); // Tablica ID koni
            const { data: treningi, error: treningError } = await supabase
                .from('trening')
                .select('*')
                .in('nr_konia', horseIds); // Filtrujemy treningi po ID koni

            if (treningError) {
                console.error('Błąd przy pobieraniu treningów:', treningError);
                setLoading(false);
                return;
            }

            if (treningi && treningi.length > 0) {
                // Ustalamy kolumny na podstawie pierwszego wiersza
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
        <table>
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column} className="table-header">
                            {column}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((column) => (
                            <td key={column} className="table-cell">
                                {row[column]?.toString() || ''}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TreningTable;
