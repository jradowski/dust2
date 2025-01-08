"use client";
import React, { useEffect, useState } from "react";
import supabase from "@/supabaseClient.js";

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

const EditableForm: React.FC = () => {
  const [records, setRecords] = useState<TreningData[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [horses, setHorses] = useState<any[]>([]);
  const [selectedHorseId, setSelectedHorseId] = useState<number | null>(null);
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
        const { data: treningData } = await supabase.from("trening").select("*");
        const { data: employeesData } = await supabase
            .from("employees")
            .select("id, first_name, last_name");
        const { data: horsesData } = await supabase
            .from("horse")
            .select("id, imie, wlasc_id");

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

  const handleInputChange = (
      id: number,
      field: string,
      value: string
  ) => {
    setRecords((prev) =>
        prev.map((record) =>
            record.nr_konia === id ? { ...record, [field]: value } : record
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

  const handleHorseSelection = (value: string) => {
    setSelectedHorseId(value ? Number(value) : null);
  };

  return (
      <div className="w-full">
        <div className="mb-4">
          <select
              id="horseSelect"
              className="px-2 py-1 border rounded text-black"
              onChange={(e) => handleHorseSelection(e.target.value)}
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

        {selectedHorseId && (
            <div>
              {records.filter((record) => record.nr_konia === selectedHorseId).length === 0 ? (
                  <div className="text-red-500 font-bold">Koń jest poza treningiem</div>
              ) : (
                  <form className="space-y-4">
                    {records
                        .filter((record) => record.nr_konia === selectedHorseId)
                        .map((record) => (
                            <div key={record.nr_konia} className="space-y-2">
                              <div>
                                <label className="block text-sm font-medium">Jeździec</label>
                                <select
                                    value={record.id_jezdzca}
                                    onChange={(e) =>
                                        handleInputChange(record.nr_konia, "id_jezdzca", e.target.value)
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
                              </div>
                              <div>
                                <label className="block text-sm font-medium">Luzak</label>
                                <select
                                    value={record.luzak_id}
                                    onChange={(e) =>
                                        handleInputChange(record.nr_konia, "luzak_id", e.target.value)
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
                                  <div key={day}>
                                    <label className="block text-sm font-medium capitalize">
                                      {day}
                                    </label>
                                    <input
                                        type="text"
                                        value={record[day as keyof TreningData] || ""}
                                        onChange={(e) =>
                                            handleInputChange(record.nr_konia, day, e.target.value)
                                        }
                                        className="w-full px-2 py-1 border rounded"
                                    />
                                  </div>
                              ))}
                              <div>
                                <button
                                    type="button"
                                    onClick={() => handleSave(record)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                  Zapisz
                                </button>
                              </div>
                            </div>
                        ))}
                  </form>
              )}
            </div>
        )}
      </div>
  );
};

export default EditableForm;
