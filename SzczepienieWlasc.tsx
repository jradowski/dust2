"use client";
import React, { useEffect, useState } from 'react';
import supabase from '@/supabaseClient.js';
import { addWeeks, isSameWeek } from 'date-fns';

function Szczepienie() {
    const [records, setRecords] = useState<{ id: number; imie: string; szczepienie: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRecords();
    }, []);

    // Funkcja pobierająca dane z Supabase
    const fetchRecords = async () => {
        try {
            // Pobranie sesji użytkownika
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id; // Id zalogowanego użytkownika

            if (!userId) {
                setError('Nie ma zalogowanego użytkownika.');
                setLoading(false);
                return;
            }

            // Pobranie koni właściciela
            const { data, error } = await supabase
                .from('horse') // Nazwa tabeli
                .select('*') // Pobiera wszystkie kolumny
                .eq('wlasc_id', userId); // Filtruje po id właściciela

            if (error) throw error;

            // Filtruj rekordy, gdzie szczepienie + 16 tygodni to obecny tydzień
            const currentWeekRecords = data.filter(record => {
                const recordDate = new Date(record.szczepienie); // Data szczepienia
                const futureDate = addWeeks(recordDate, 16);
                return isSameWeek(futureDate, new Date()); // Sprawdza, czy data jest w bieżącym tygodniu
            });

            setRecords(currentWeekRecords);
        } catch (error) {
            console.error(error);
            setError('Wystąpił błąd podczas pobierania danych.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="italic">
            <h1 className="font-bold">Termin szczepień na ten tydzień:</h1>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <ul>
                {records.map((record) => (
                    <li key={record.id}> {record.imie}</li>
                ))}
            </ul>
        </div>
    );
}

export default Szczepienie;
