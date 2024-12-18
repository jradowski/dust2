"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import supabase from '@/supabaseClient';
import Image from "next/image";

// Definiowanie typu danych dla boksu
interface Box {
  nr_boksu: number;
  imie: string;
  wlasc_id: string;
  image_url?: string; // Dodanie image_url jako opcjonalnej właściwości
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
      <main className="flex flex-col p-4 sm:p-6 md:p-8 lg:p-24 justify-between">
        <div
            className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-center lg:mb-0 lg:w-full lg:text-left">
          {boxes.map((box) => (
              <Link key={box.nr_boksu} href={`/dashboard/boxes/Box${box.nr_boksu}`}>
                <div
                    className="bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg text-justify text-lg font-medium flex flex-col items-center md:flex-row">
                  <h2 className="mb-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                    {box.nr_boksu}{" "}
                  </h2>
                  <div className="flex-shrink-0 w-36 h-36 my-3 ml-2 md:my-0 md:mr-4">
                    {box.image_url ? (
                        <Image
                            src={box.image_url}
                            alt={`Zdjęcie konia ${box.imie}`}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover aspect-square drop-shadow-lg dark:drop-shadow-lg"
                        />
                    ) : (
                        <div className=" w-full h-full bg-gray-300 rounded-lg" />
                    )}

                  </div>

                  <div className="text-center md:text-left">
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
                      {box.imie}
                    </p>
                  </div>
                </div>
              </Link>
          ))}
        </div>
      </main>
  );
}
