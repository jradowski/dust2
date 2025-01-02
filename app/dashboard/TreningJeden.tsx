"use client";
import React, { useEffect, useState } from 'react';
import supabase from '@/supabaseClient.js';

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
  const [jezdziec, setJezdziec] = useState<string>('');
  const [luzak, setLuzak] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      // Pobieranie danych z tabeli 'trening' (bez id_jezdzca i luzak_id)
      let { data: treningData, error: treningError } = await supabase
        .from('trening')
        .select('poniedzialek, wtorek, sroda, czwartek, piatek, sobota, niedziela, id_jezdzca, luzak_id')
        .eq('nr_konia', horseIdT);

      if (treningError) {
        console.error(treningError);
        setLoading(false);
        return;
      }

      if (treningData && treningData.length > 0) {
        // Pobieranie nazw kolumn z pierwszego wiersza danych, wykluczamy 'id_jezdzca' oraz 'luzak_id'
        const filteredColumns = Object.keys(treningData[0]).filter(
          (column) => column !== 'id_jezdzca' && column !== 'luzak_id'
        );
        setColumns(filteredColumns);
        setData(treningData);

        const idJezdzca = treningData[0].id_jezdzca;
        const idLuzaka = treningData[0].luzak_id;

        // Pobieranie danych jeźdźca i luzaka
        let { data: employeesData, error: employeesError } = await supabase
          .from('employees')
          .select('id, first_name, last_name')
          .in('id', [idJezdzca, idLuzaka]);

        if (employeesError) {
          console.error(employeesError);
        } else {
          // Przypisanie imienia i nazwiska jeźdźca i luzaka
          const jezdziecData = employeesData?.find((emp) => emp.id === idJezdzca);
          const luzakData = employeesData?.find((emp) => emp.id === idLuzaka);

          setJezdziec(
            jezdziecData ? `${jezdziecData.first_name} ${jezdziecData.last_name}` : 'Nieznany jeździec'
          );
          setLuzak(
            luzakData ? `${luzakData.first_name} ${luzakData.last_name}` : 'Nieznany luzak'
          );
        }
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
      <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700 rounded-xl">
        <thead className="bg-blue-600">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white dark:bg-gray-800">
              {columns.map((column) => (
                <td
                  key={column}
                  className="px-4 py-2 text-gray-800 dark:text-gray-200 whitespace-normal break-words max-w-xs"
                >
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Wyświetlanie danych jeźdźca i luzaka poniżej tabeli */}
      <div className="mt-4">
        <p className="text-lg font-semibold">Jeździec: {jezdziec}</p>
        <p className="text-lg font-semibold">Luzak: {luzak}</p>
      </div>
    </div>
  );
};

export default TreningJeden;
