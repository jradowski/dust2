"use client";
import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient.js';
import { addWeeks, isSameWeek } from 'date-fns';

function Kowal() {
  const [records, setRecords] = useState<{ id: number; imie: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  // Funkcja pobierająca dane z Supabase
  const fetchRecords = async () => {
    try {
      // Pobieranie sesji i ID użytkownika
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const userId = session?.user?.id;

      if (!userId) {
        setError('Nie znaleziono zalogowanego użytkownika.');
        return;
      }

      // Pobranie koni, których właścicielem jest zalogowany użytkownik
      const { data, error } = await supabase
        .from('horse') // Nazwa tabeli
        .select('*') // Pobiera wszystkie kolumny
        .eq('wlasc_id', userId);

      if (error) throw error;

      // Filtruj rekordy, gdzie termin kowala + 16 tygodni to bieżący tydzień
      const currentWeekRecords = data.filter(record => {
        const recordDate = new Date(record.kowal); // kolumna "kowal"
        const futureDate = addWeeks(recordDate, 16); // Dodaj 16 tygodni
        return isSameWeek(futureDate, new Date()); // Sprawdź, czy to ten sam tydzień
      });

      setRecords(currentWeekRecords);
    } catch (error: any) {
      console.error(error);
      setError('Wystąpił błąd podczas pobierania danych.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="italic">
      <h1 className="font-bold">Termin kowala w tym tygodniu:</h1>

      {loading && <p>Ładowanie...</p>}
      {error && <p>{error}</p>}
      <ul>
        {records.map((record) => (
          <li key={record.id}>{record.imie}</li>
        ))}
      </ul>
    </div>
  );
}

export default Kowal;
