"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import 'reactjs-popup/dist/index.css';
import supabase from '@/supabaseClient.js';
import TreningJeden from '@/app/dashboard/TreningJeden';
import Notatkoa from '@/Notatkoa';
import '@/boxtabela.css';

const Home = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true); // Rozpoczynanie ładowania
    const { data, error } = await supabase
      .from('horse')
      .select('*')
      .eq('nr_boksu', 5)
      .single();

    if (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      return;
    }

    // Pobieramy dane właściciela na podstawie wlasc_id
    const { data: ownerData, error: ownerError } = await supabase
      .from('employees')
      .select('first_name, last_name')
      .eq('id', data.wlasc_id)
      .single();

    if (ownerError) {
      console.error('Error fetching owner data:', ownerError);
      setLoading(false);
      return;
    }

    // Łączenie danych konia z danymi właściciela
    const ownerFullName = ownerData ? `${ownerData.first_name} ${ownerData.last_name}` : 'Brak danych';

    // Aktualizacja stanu z danymi konia oraz właściciela
    setData({
      ...data,
      wlasciciel: ownerFullName, // Dodanie pełnego imienia i nazwiska właściciela
    });

    setLoading(false); // Zakończenie ładowania
  };

  useEffect(() => {
    fetchData(); // Wywołanie fetchData przy pierwszym renderze
    const interval = setInterval(fetchData, 60000); // Odświeżanie danych co 60 sekund

    // Czyścimy interwał po zakończeniu działania komponentu
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Wyświetlanie komunikatu ładowania
  }

  if (!data) {
    return <div>No data found.</div>; // Obsługa przypadku, gdy dane są puste lub nie znalezione
  }

  const zdj = data.image_url ? data.image_url : "/Kolorado.jpg"; // Jeśli brak obrazka, użyj domyślnego

  return (
    <main className="flex xl:px-96 p-6 flex-col items-center">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 rounded-tl-xl mb-10 bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900  sm:p-6 rounded-xl shadow-lg text-justify text-base md:text-lg font-medium">
        <div className="flex flex-col gap-5">
          <h1 className="text-center text-2xl md:text-3xl pb-5 font-bold">
            {data.imie}
          </h1>
          <div>
            <Image
              className="rounded-2xl aspect-square object-cover shadow-2xl"
              src={zdj}
              alt="Kolorado KG"
              width={400}
              height={200}
            />
          </div>
          <div className="mt-2 pl-2 md:pl-5">
            <h1 className="text-xl md:text-2xl">Dieta:</h1>
            <h2 className="text-opacity-50 text-lg md:text-xl">
              Ilość: {data.wielkosc_posilku} miarki
            </h2>
            <h2 className="text-opacity-50 text-lg md:text-xl">
              Skład: {data.posilek}
            </h2>
          </div>
        </div>

        <div className="border-l-0 md:border-l-2 pl-0 md:pl-5 border-gray-600">
          <ul>
            <h2 className="font-semibold text-xl md:text-2xl">Data urodzenia:</h2>
            <li className="text-lg md:text-xl pb-3">{data.data_urodzenia}</li>
            <h2 className="font-semibold text-xl md:text-2xl">Płeć:</h2>
            <li className="text-lg md:text-xl pb-3">{data.plec}</li>
            <h2 className="font-semibold text-xl md:text-2xl">Rasa:</h2>
            <li className="text-lg md:text-xl pb-3">Polski Koń Sportowy</li>
            <h2 className="font-semibold text-xl md:text-2xl">Właściciel:</h2>
            <li className="text-lg md:text-xl pb-3">{data.wlasciciel}</li>
            <h2 className="font-semibold text-xl md:text-2xl">Ojciec:</h2>
            <li className="text-lg md:text-xl pb-3">{data.v}</li>
            <h2 className="font-semibold text-xl md:text-2xl">Matka(& oj.Matki):</h2>
            <li className="text-lg md:text-xl pb-3">{data.m}/ {data.mv}</li>
          </ul>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 mb-10 md:grid-cols-2 bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-xl shadow-lg text-justify text-base md:text-lg font-medium">
        <div className="border-r-0 md:border-r-2 border-gray-600 pr-0 md:pr-5">
          <h1 className="text-xl md:text-2xl">Ostatnia wizyta kowala:</h1>
          <h2 className="text-opacity-50 text-lg md:text-xl">{data.kowal}</h2>
        </div>
        <div className="mt-4 md:mt-0 md:pl-5">
          <h1 className="text-xl md:text-2xl">Ostatnie szczepienie:</h1>
          <h2 className="text-opacity-50 text-lg md:text-xl">{data.szczepienie}</h2>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 gap-10 bg-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-xl shadow-lg text-justify text-base md:text-lg font-medium">
        <div>
          <h1 className="text-lg md:text-xl font-bold">Plan treningowy:</h1>
          <h2 className="text-base md:text-lg">
            <TreningJeden horseIdT={data.nr_treningowy} />
          </h2>
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold">Notatka:</h1>
          <div>
            <Notatkoa horseId={data.id} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
