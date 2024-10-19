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
      <div className="flex flex-col gap-4 text-center lg:w-full lg:text-left">
        {boxes.map((box) => (
          <Link key={box.nr_boksu} href={`/dashboard/boxes/Box${box.nr_boksu}`}>
            <div
              className="group rounded-tl-xl text-2xl mx-2 bg-white border-r-2 border-b-2 border-zinc-200 p-5 
                dark:bg-gradient-to-b dark:from-zinc-800 dark:border-gray-600"
            >
              <h2 className="mb-3 text-2xl font-semibold">
                {box.nr_boksu}{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  -&gt;
                </span>
              </h2>
              <p className="m-0 max-w-[30ch] text-base opacity-50">
                {box.imie}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
