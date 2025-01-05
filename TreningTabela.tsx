"use client";
import React, { useEffect, useState } from "react";
import supabase from "@/supabaseClient.js";

// Definicja typu dla danych z tabeli trening
type TreningData = {
  nr_konia: number;
  id_jezdzca: string;
  luzak_id: string;
  poniedzialek: string;
  wtorek: string;
  sroda: string;
  czwartek: string;
  piatek: string;
  sobota: string;
  niedziela: string;
};

const ReadOnlyTable: React.FC = () => {
  const [records, setRecords] = useState<TreningData[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [horses, setHorses] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pobieranie danych z tabeli trening
        const { data: treningData, error: treningError } = await supabase
          .from("trening")
          .select("*");
        if (treningError) throw treningError;

        // Pobieranie danych z tabeli employees
        const { data: employeesData, error: employeesError } = await supabase
          .from("employees")
          .select("id, first_name, last_name");
        if (employeesError) throw employeesError;

        // Pobieranie danych z tabeli horses
        const { data: horsesData, error: horsesError } = await supabase
          .from("horse")
          .select("id, imie");
        if (horsesError) throw horsesError;

        setRecords(treningData || []);
        setEmployees(employeesData || []);
        setHorses(horsesData || []);
      } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700 rounded-xl">
        <thead className="bg-blue-600">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Imię Konia</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Poniedziałek</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Wtorek</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Środa</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Czwartek</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Piątek</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Sobota</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Niedziela</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const horse = horses.find((horse) => horse.id === record.nr_konia);
            return (
              <tr key={record.nr_konia} className="bg-white dark:bg-gray-800">
                {/* Imię Konia */}
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200 whitespace-normal break-words max-w-xs">
                  {horse ? horse.imie : "Brak imienia"}
                </td>
                {/* Dni tygodnia */}
                {["poniedzialek", "wtorek", "sroda", "czwartek", "piatek", "sobota", "niedziela"].map(
                  (day) => (
                    <td key={day} className="px-4 py-2 text-gray-800 dark:text-gray-200 whitespace-normal break-words max-w-xs">
                      {/* Wyświetlanie wartości bez możliwości edycji */}
                      <span className="w-full px-2 py-1">{record[day as keyof TreningData] || "-"}</span>
                    </td>
                  )
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReadOnlyTable;
