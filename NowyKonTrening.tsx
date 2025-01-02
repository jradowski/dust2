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
  const [selectedHorse, setSelectedHorse] = useState<number | null>(null); // Nowe pole do wyboru konia
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

  // Obsługa zmiany jeźdźca lub luzaka w tabeli
  const handleChange = (id: number, column: string, value: string) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.nr_konia === id ? { ...record, [column]: value } : record
      )
    );
  };
  
  // Funkcja do dodania nowego konia do treningu
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
      // Po dodaniu nowego konia do treningu, resetujemy formularz
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

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2>Dodaj nowego konia do treningu</h2>
        {/* Wybór konia */}
        <select
          value={selectedHorse || ""}
          onChange={(e) => setSelectedHorse(Number(e.target.value))}
          className="w-full px-2 py-1 border rounded mb-2"
        >
          <option value="">Wybierz konia</option>
          {horses.map((horse) => (
            <option key={horse.id} value={horse.id}>
              {horse.imie}
            </option>
          ))}
        </select>
        {/* Formularz dla nowego konia */}
        {selectedHorse && (
          <div>
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
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* Imię Konia */}
                  <td className="border border-gray-300 px-4 py-2">{horses.find(horse => horse.id === selectedHorse)?.imie}</td>
                  {/* Jeździec */}
                  <td className="border border-gray-300 px-4 py-2">
                    <select
                      value={newRecord.id_jezdzca}
                      onChange={(e) => setNewRecord({ ...newRecord, id_jezdzca: e.target.value })}
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
                  {/* Luzak */}
                  <td className="border border-gray-300 px-4 py-2">
                    <select
                      value={newRecord.luzak_id}
                      onChange={(e) => setNewRecord({ ...newRecord, luzak_id: e.target.value })}
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
                  {/* Dni tygodnia */}
                  {["poniedzialek", "wtorek", "sroda", "czwartek", "piatek", "sobota", "niedziela"].map(
                    (day) => (
                      <td key={day} className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          value={newRecord[day as keyof TreningData] || ""}
                          onChange={(e) => setNewRecord({ ...newRecord, [day]: e.target.value })}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                    )
                  )}
                </tr>
              </tbody>
            </table>
            <br></br>
            <button
              onClick={handleAddNewHorse}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Dodaj konia do treningu
            </button>
          </div>
        )}
      </div>

     
    </div>
  );
};

export default EditableTable;
