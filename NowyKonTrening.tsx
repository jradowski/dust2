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
  const [selectedHorse, setSelectedHorse] = useState<number | null>(null);
  const [newRecord, setNewRecord] = useState<TreningData>({
    nr_konia: 0,
    id_jezdzca: "",
    luzak_id: "",
    poniedzialek: "",
    wtorek: "",
    sroda: "",
    czwartek: "",
    piatek: "",
    sobota: "",
    niedziela: "",
  });

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

  const handleAddNewHorse = async () => {
    if (selectedHorse === null) {
      alert("Proszę wybrać konia.");
      return;
    }

    const newTrening = { ...newRecord, nr_konia: selectedHorse };

    try {
      const { error } = await supabase.from("trening").insert([newTrening]);

      if (error) throw error;
      alert("Nowy koń został dodany do treningu!");
      setNewRecord({
        nr_konia: 0,
        id_jezdzca: "",
        luzak_id: "",
        poniedzialek: "",
        wtorek: "",
        sroda: "",
        czwartek: "",
        piatek: "",
        sobota: "",
        niedziela: "",
      });
      setSelectedHorse(null);
    } catch (error) {
      console.error("Błąd podczas dodawania nowego konia:", error);
      alert("Nie udało się dodać nowego konia.");
    }
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

  return (
      <div className="p-4">
        <div className="mb-4">
          <h2 className="mb-4">Dodaj nowego konia do treningu</h2>
          <div className="flex flex-col space-y-4">
            <select
                value={selectedHorse || ""}
                onChange={(e) => setSelectedHorse(Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-black"
            >
              <option value="">Wybierz konia</option>
              {horses.map((horse) => (
                  <option key={horse.id} value={horse.id}>
                    {horse.imie}
                  </option>
              ))}
            </select>

            {selectedHorse && (
                <div className="flex flex-col space-y-4">
                  <label className="flex flex-col">
                    Jeździec:
                    <select
                        value={newRecord.id_jezdzca}
                        onChange={(e) =>
                            setNewRecord({ ...newRecord, id_jezdzca: e.target.value })
                        }
                        className="w-full px-2 py-1 border rounded text-black"
                    >
                      <option value="">Wybierz jeźdźca</option>
                      {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.first_name} {employee.last_name}
                          </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col">
                    Luzak:
                    <select
                        value={newRecord.luzak_id}
                        onChange={(e) =>
                            setNewRecord({ ...newRecord, luzak_id: e.target.value })
                        }
                        className="w-full px-2 py-1 border rounded text-black"
                    >
                      <option value="">Wybierz luzaka</option>
                      {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.first_name} {employee.last_name}
                          </option>
                      ))}
                    </select>
                  </label>

                  {[
                    "poniedzialek",
                    "wtorek",
                    "sroda",
                    "czwartek",
                    "piatek",
                    "sobota",
                    "niedziela",
                  ].map((day) => (
                      <label key={day} className="flex flex-col">
                        {day.charAt(0).toUpperCase() + day.slice(1)}:
                        <input
                            type="text"
                            value={newRecord[day as keyof TreningData] || ""}
                            onChange={(e) =>
                                setNewRecord({ ...newRecord, [day]: e.target.value })
                            }
                            className="w-full px-2 py-1 border rounded text-black"
                        />
                      </label>
                  ))}

                  <button
                      onClick={handleAddNewHorse}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Dodaj konia do treningu
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default EditableTable;
