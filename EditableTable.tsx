"use client";
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import 'reactjs-popup/dist/index.css'
import supabase from '@/supabaseClient.js'
import { useEffect, useState } from 'react'
import '@/admin_board.css'; // Importowanie pliku CSS

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

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        let { data, error } = await supabase
            .from('trening')
            .select('nr_konia, imie, poniedzialek, wtorek, sroda, czwartek, piatek, sobota, niedziela, jezdziec, luzak')
            .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          setColumns(Object.keys(data[0]));
          setLoading(false); // Zakończ ładowanie po uzyskaniu kolumn
        }
      } catch (error) {
        console.error('Error fetching columns:', error);
        setLoading(false); // Zakończ ładowanie w przypadku błędu
      }
    };

    fetchColumns();
  }, []);

  const fetchSuggestions = async (value: string) => {
    try {
      let { data, error } = await supabase
          .from('trening')
          .select('nr_konia, imie, poniedzialek, wtorek, sroda, czwartek, piatek, sobota, niedziela, jezdziec, luzak')
          .ilike('imie', `%${value}%`);

      if (error) throw error;

      setSuggestions(data || []);
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
        console.log('Updating record with id:', nr_konia);
        console.log('Updated data:', updatedData);

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
      <div >
        <input
            className="custom-select"
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Imię konia"
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
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700 rounded-xl">
                <thead className="bg-blue-600">
                <tr>
                  {columns.map((column) => (
                      <th key={column} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{column}</th>
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
              <button className="px-6 py-2 w-fit text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white mt-2" onClick={handleSave}>Zapisz</button>
            </div>
        )}
      </div>
  );
};

export default EditableTable;