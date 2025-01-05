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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) return;

        // Pobieranie danych z tabeli trening
        const { data: treningData, error: treningError } = await supabase
          .from("trening")
          .select("*")
          .in(
            "nr_konia",
            (
              await supabase
                .from("horse")
                .select("id")
                .eq("wlasc_id", userId)
            ).data?.map((horse) => horse.id) || []
          );

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
  }, [userId]);

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-blue-600">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Imię Konia</th>
            <th className="border border-gray-300 px-4 py-2">Poniedziałek</th>
            <th className="border border-gray-300 px-4 py-2">Wtorek</th>
            <th className="border border-gray-300 px-4 py-2">Środa</th>
            <th className="border border-gray-300 px-4 py-2">Czwartek</th>
            <th className="border border-gray-300 px-4 py-2">Piątek</th>
            <th className="border border-gray-300 px-4 py-2">Sobota</th>
            <th className="border border-gray-300 px-4 py-2">Niedziela</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const horse = horses.find((horse) => horse.id === record.nr_konia);
            return (
              <tr key={record.nr_konia}>
                {/* Imię Konia */}
                <td className="border border-gray-300 px-4 py-2">
                  {horse ? horse.imie : "Brak imienia"}
                </td>
                {/* Dni tygodnia */}
                {[
                  "poniedzialek",
                  "wtorek",
                  "sroda",
                  "czwartek",
                  "piatek",
                  "sobota",
                  "niedziela",
                ].map((day) => (
                  <td key={day} className="border border-gray-300 px-4 py-2">
                    <span className="w-full px-2 py-1">
                      {record[day as keyof TreningData] || "-"}
                    </span>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReadOnlyTable;
