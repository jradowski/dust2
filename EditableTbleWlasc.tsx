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

const EditableTable: React.FC = () => {
  const [records, setRecords] = useState<TreningData[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [horses, setHorses] = useState<any[]>([]);
  const [selectedHorseId, setSelectedHorseId] = useState<number | null>(null); // Nowa zmienna do przechowywania wybranego konia
  const [userId, setUserId] = useState<string | null>(null); // Zmienna do przechowywania id użytkownika

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
          .select("id, imie, wlasc_id");
        if (horsesError) throw horsesError;

        // Filtrujemy konie należące do zalogowanego użytkownika
        const filteredHorses = horsesData?.filter(
          (horse) => horse.wlasc_id === userId
        );
        setHorses(filteredHorses || []);
        setRecords(treningData || []);
        setEmployees(employeesData || []);
      } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Obsługa zmiany jeźdźca lub luzaka w tabeli
  const handleChange = (id: number, column: string, value: string) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.nr_konia === id ? { ...record, [column]: value } : record
      )
    );
  };

  const handleDeleteHorse = async (nrKonia: number) => {
    if (window.confirm("Czy na pewno chcesz usunąć tego konia z treningu?")) {
      try {
        const { error } = await supabase
          .from("trening")
          .delete()
          .eq("nr_konia", nrKonia);

        if (error) throw error;
        alert("Koń został usunięty z treningu!");
        // Po usunięciu konia z treningu, odświeżamy dane
        setRecords(records.filter((record) => record.nr_konia !== nrKonia));
      } catch (error) {
        console.error("Błąd podczas usuwania konia:", error);
        alert("Nie udało się usunąć konia.");
      }
    }
  };

  // Zapisanie zmian do bazy danych
  const handleSave = async (record: TreningData) => {
    try {
      const { nr_konia, id_jezdzca, luzak_id, ...days } = record;

      const { error } = await supabase
        .from("trening")
        .update({ id_jezdzca, luzak_id, ...days })
        .eq("nr_konia", nr_konia);

      if (error) throw error;
      alert("Zapisano zmiany!");
    } catch (error) {
      console.error("Błąd podczas zapisywania danych:", error);
      alert("Nie udało się zapisać zmian.");
    }
  };

  const handleHorseSelection = (horseId: number) => {
    setSelectedHorseId(horseId);
  };

  return (
    <div className="p-4">
      {/* Selekcja konia */}
      <div className="mb-4">
        <label htmlFor="horseSelect" className="block text-sm font-medium">
          Wybierz konia
        </label>
        <select
          id="horseSelect"
          className="w-full px-4 py-2 border rounded"
          onChange={(e) => handleHorseSelection(Number(e.target.value))}
          value={selectedHorseId || ""}
        >
          <option value="">Wybierz konia</option>
          {horses.map((horse) => (
            <option key={horse.id} value={horse.id}>
              {horse.imie}
            </option>
          ))}
        </select>
      </div>

      {/* Tylko po wybraniu konia, tabela się pojawia */}
      {selectedHorseId && (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Imię Konia</th>
              <th className="border border-gray-300 px-4 py-2">Jeździec</th>
              <th className="border border-gray-300 px-4 py-2">Luzak</th>
              <th className="border border-gray-300 px-4 py-2">Poniedziałek</th>
              <th className="border border-gray-300 px-4 py-2">Wtorek</th>
              <th className="border border-gray-300 px-4 py-2">Środa</th>
              <th className="border border-gray-300 px-4 py-2">Czwartek</th>
              <th className="border border-gray-300 px-4 py-2">Piątek</th>
              <th className="border border-gray-300 px-4 py-2">Sobota</th>
              <th className="border border-gray-300 px-4 py-2">Niedziela</th>
              <th className="border border-gray-300 px-4 py-2">Akcja</th>
            </tr>
          </thead>
          <tbody>
            {records
              .filter((record) => record.nr_konia === selectedHorseId)
              .map((record) => {
                const horse = horses.find((horse) => horse.id === record.nr_konia);
                return (
                  <tr key={record.nr_konia}>
                    <td className="border border-gray-300 px-4 py-2">
                      {horse ? horse.imie : "Brak imienia"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <select
                        value={record.id_jezdzca}
                        onChange={(e) =>
                          handleChange(record.nr_konia, "id_jezdzca", e.target.value)
                        }
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option value="">Wybierz jeźdźca</option>
                        {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.first_name} {employee.last_name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <select
                        value={record.luzak_id}
                        onChange={(e) =>
                          handleChange(record.nr_konia, "luzak_id", e.target.value)
                        }
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option value="">Wybierz luzaka</option>
                        {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.first_name} {employee.last_name}
                          </option>
                        ))}
                      </select>
                    </td>
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
                        <input
                          type="text"
                          value={record[day as keyof TreningData] || ""}
                          onChange={(e) =>
                            handleChange(record.nr_konia, day, e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                    ))}
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleSave(record)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Zapisz
                      </button>
                      <button
                        onClick={() => handleDeleteHorse(record.nr_konia)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                      >
                        Usuń
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EditableTable;
