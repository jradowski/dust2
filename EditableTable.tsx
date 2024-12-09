"use client";
import React, { useEffect, useState } from "react";
import supabase from "@/supabaseClient.js";

type TreningData = {
  nr_konia: number;
  imie: string;
  [key: string]: any;
};

const EditableTable: React.FC = () => {
  const [suggestions, setSuggestions] = useState<TreningData[]>([]);
  const [value, setValue] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<TreningData | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const { data, error } = await supabase
            .from("trening")
            .select(
                "nr_konia, imie, poniedzialek, wtorek, sroda, czwartek, piatek, sobota, niedziela, jezdziec, luzak"
            )
            .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          setColumns(Object.keys(data[0]));
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching columns:", error);
        setLoading(false);
      }
    };

    fetchColumns();
  }, []);

  const fetchSuggestions = async (value: string) => {
    try {
      const { data, error } = await supabase
          .from("trening")
          .select(
              "nr_konia, imie, poniedzialek, wtorek, sroda, czwartek, piatek, sobota, niedziela, jezdziec, luzak"
          )
          .ilike("imie", `%${value}%`);

      if (error) throw error;

      setSuggestions(data || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue(value);
    fetchSuggestions(value);
  };

  const handleSelect = (record: TreningData) => {
    setSelectedRecord(record);
    setValue(record.imie);
    setSuggestions([]);
  };

  const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      column: string
  ) => {
    if (selectedRecord) {
      setSelectedRecord({ ...selectedRecord, [column]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (selectedRecord) {
      try {
        const { nr_konia, ...updatedData } = selectedRecord;

        const { error } = await supabase
            .from("trening")
            .update(updatedData)
            .eq("nr_konia", nr_konia);

        if (error) throw error;

        alert("Record updated successfully!");
      } catch (error) {
        console.error("Error updating record:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="p-4 sm:p-2">
        <input
            className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Imię konia"
        />
        {suggestions.length > 0 && (
            <ul className="mt-2 bg-white border border-gray-300 rounded-lg max-h-48 overflow-y-auto text-sm">
              {suggestions.map((suggestion) => (
                  <li
                      key={suggestion.nr_konia}
                      onClick={() => handleSelect(suggestion)}
                      className="px-4 text-black py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {suggestion.imie}
                  </li>
              ))}
            </ul>
        )}
        {selectedRecord && (
            <div className="mt-4">
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                {columns.map((column) => (
                    <div
                        key={column}
                        className="flex flex-col text-black sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.33%-0.5rem)] gap-2"
                    >
                      <label
                          htmlFor={column}
                          className="text-sm font-medium text-black text-gray-700 dark:text-gray-300"
                      >
                        {column}:
                      </label>
                      <input
                          id={column}
                          type="text"
                          value={selectedRecord[column]}
                          onChange={(e) => handleInputChange(e, column)}
                          className="w-full px-2 py-1 text-sm border text-black border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-300"
                      />
                    </div>
                ))}
              </div>
              <button
                  className="mt-4 px-4 py-2 w-full sm:w-auto text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
                  onClick={handleSave}
              >
                Zapisz
              </button>
            </div>
        )}
      </div>
  );
};

export default EditableTable;
