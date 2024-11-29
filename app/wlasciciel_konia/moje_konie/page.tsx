"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import supabase from '@/supabaseClient';

// Definiowanie typu danych dla boksu
interface Box {
  nr_boksu: number;
  imie: string;
  wlasc_id: string;
}

export default function Page() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Funkcja pobierająca dane boksów dla zalogowanego użytkownika
  const fetchBoxesByOwner = async (userId: string) => {
    const { data, error } = await supabase
      .from('horse')
      .select('*')
      .eq('wlasc_id', userId); // Filtracja po ID właściciela

    if (error) {
      console.error('Błąd przy pobieraniu danych:', error);
      return [];
    }
    return data as Box[];
  };

  // Efekt pobierający dane po załadowaniu komponentu
  useEffect(() => {
    const loadBoxes = async () => {
      const { data: { session } } = await supabase.auth.getSession(); // Pobranie sesji
      const userId = session?.user?.id; // ID aktualnie zalogowanego użytkownika

      if (userId) {
        const fetchedBoxes = await fetchBoxesByOwner(userId);
        setBoxes(fetchedBoxes);
      }
      setLoading(false);
    };

    loadBoxes();
  }, []);

  if (loading) return <p>Ładowanie...</p>;
  if (boxes.length === 0) return <p>Brak boksów do wyświetlenia.</p>;

  return (
    <main className="min-h-full p-24">
      <div className="grid grid-cols-3 gap-5 text-center lg:mb-0 lg:w-full lg:text-left">
        {boxes.map((box) => (
          <Link key={box.nr_boksu} href={`/dashboard/boxes/Box${box.nr_boksu}`}>
            <div
              className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium flex items-center"
            >
              <h2 className="mb-3 pr-10 xl:text-4xl lg:text-3xl md:text-2xl sm:text-xl font-bold">
                {box.nr_boksu}{" "}

              </h2>
              <div className="flex flex-row ">

                <div>
                  <p className="mb-3 px-2 xl:text-4xl lg:text-3xl md:text-2xl sm:text-xl font-semibold ">
                    {box.imie}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
