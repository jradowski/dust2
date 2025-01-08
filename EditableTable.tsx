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
  const [selectedHorseId, setSelectedHorseId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: treningData, error: treningError } = await supabase
            .from("trening")
            .select("*");
        if (treningError) throw treningError;

        const { data: employeesData, error: employeesError } = await supabase
            .from("employees")
            .select("id, first_name, last_name");
        if (employeesError) throw employeesError;

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

  const handleChange = (id: number, column: string, value: string) => {
    setRecords((prev) =>
        prev.map((record) =>
            record.nr_konia === id ? { ...record, [column]: value } : record
        )
    );
  };

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

  const filteredRecords = selectedHorseId
      ? records.filter((record) => record.nr_konia === selectedHorseId)
      : [];

  const selectedHorse = horses.find((horse) => horse.id === selectedHorseId);

  return (
      <div className="w-full">
        <div className="mb-4">
          <select
              value={selectedHorseId ?? ""}
              onChange={(e) => setSelectedHorseId(Number(e.target.value) || null)}
              className="px-2 py-1 border rounded text-black"
          >
            <option value="">Wybierz konia</option>
            {horses.map((horse) => (
                <option key={horse.id} value={horse.id}>
                  {horse.imie}
                </option>
            ))}
          </select>
        </div>

        {selectedHorseId && filteredRecords.length === 0 && (
            <div  className="text-red-500 font-bold">
              Koń {selectedHorse?.imie} jest poza treningiem.
            </div>
        )}

        {filteredRecords.length > 0 && (
            <form className="overflow-x-auto">
              {filteredRecords.map((record) => (
                  <div
                      key={record.nr_konia}
                      className="rounded-lg shadow-lg p-4 bg-transparent"
                  >
                    <div className="font-bold mb-2">
                      Koń: {selectedHorse?.imie || "Brak imienia"}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 font-medium">Jeździec:</label>
                      <select
                          value={record.id_jezdzca}
                          onChange={(e) =>
                              handleChange(record.nr_konia, "id_jezdzca", e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded bg-white text-black"
                      >
                        <option value="">Wybierz jeźdźca</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                              {employee.first_name} {employee.last_name}
                            </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 font-medium">Luzak:</label>
                      <select
                          value={record.luzak_id}
                          onChange={(e) =>
                              handleChange(record.nr_konia, "luzak_id", e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded bg-white text-black"
                      >
                        <option value="">Wybierz luzaka</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                              {employee.first_name} {employee.last_name}
                            </option>
                        ))}
                      </select>
                    </div>
                    {[
                      "poniedzialek",
                      "wtorek",
                      "sroda",
                      "czwartek",
                      "piatek",
                      "sobota",
                      "niedziela",
                    ].map((day) => (
                        <div key={day} className="mb-2">
                          <label className="block font-medium">
                            {day.charAt(0).toUpperCase() + day.slice(1)}:
                          </label>
                          <input
                              type="text"
                              value={record[day as keyof TreningData] || ""}
                              onChange={(e) =>
                                  handleChange(record.nr_konia, day, e.target.value)
                              }
                              className="w-full px-2 py-1 border rounded bg-white text-black"
                          />
                        </div>
                    ))}
                    <div className="flex gap-2 mt-4">
                      <button
                          type="button"
                          onClick={() => handleSave(record)}
                          className="flex-grow bg-blue-500 p-2 rounded text-white"
                      >
                        Zapisz
                      </button>
                    </div>
                  </div>
              ))}
            </form>
        )}
      </div>
  );
};

export default EditableTable;
