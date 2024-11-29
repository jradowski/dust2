"use client";
import React, { useEffect, useState } from 'react';
import supabase from '@/supabaseClient';
import '@/tabela.css';

type TreningData = {
  nr_konia: number;
  imie: string;
  [key: string]: any;
};

const EditableTable: React.FC = () => {
  const [suggestions, setSuggestions] = useState<TreningData[]>([]);
  const [value, setValue] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<TreningData | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;  // Bezpieczne przypisanie
  
      setUserId(userId);  // Teraz mamy pewność, że przekazujemy tylko string lub null
    };
  
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        let { data, error } = await supabase.from('trening').select('nr_konia, imie, poniedzialek, wtorek, sroda, czwartek, piatek, sobota, niedziela, jezdziec, luzak')
        .limit(1);
        if (error) throw error;
        if (data && data.length > 0) setColumns(Object.keys(data[0]));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching columns:', error);
        setLoading(false);
      }
    };

    fetchColumns();
  }, []);

  const fetchSuggestions = async (value: string) => {
    if (!userId) return; // Jeśli użytkownik nie jest zalogowany, zakończ funkcję

    try {
      const { data: horses, error: horsesError } = await supabase
        .from('horse')
        .select('id, imie')
        .eq('wlasc_id', userId);

      if (horsesError) throw horsesError;

      const horseIds = horses.map((horse) => horse.id);

      let { data: treningi, error: treningiError } = await supabase
        .from('trening')
        .select('nr_konia, imie, poniedzialek, wtorek, sroda, czwartek, piatek, sobota, niedziela, jezdziec, luzak')
        .in('nr_konia', horseIds)
        .ilike('imie', `%${value}%`);

      if (treningiError) throw treningiError;

      setSuggestions(treningi || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, column: string) => {
    if (selectedRecord) {
      setSelectedRecord({ ...selectedRecord, [column]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (selectedRecord) {
      try {
        const { nr_konia, ...updatedData } = selectedRecord;
        let { error } = await supabase
          .from('trening')
          .update(updatedData)
          .eq('nr_konia', nr_konia);

        if (error) throw error;

        alert('Record updated successfully!');
      } catch (error) {
        console.error('Error updating record:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
        className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">

      <input
        className="custom-select"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Type 'imie'"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion) => (
            <li key={suggestion.nr_konia} onClick={() => handleSelect(suggestion)}>
              {suggestion.imie}
            </li>
          ))}
        </ul>
      )}
      {selectedRecord && (
        <div>
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {columns.map((column) => (
                  <td key={column}>
                    <input
                      type="text"
                      value={selectedRecord[column]}
                      onChange={(e) => handleInputChange(e, column)}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <button
              className="px-6 py-2 w-fit text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white mt-2 mb-2"
              onClick={handleSave}>
            Zapisz
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableTable;
