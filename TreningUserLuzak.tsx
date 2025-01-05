"use client";
import React, { useEffect, useState } from 'react'
import supabase from '@/supabaseClient.js'
import '@/globals.css';
import '@/tabela.css'

type TreningData = {
  [key: string]: any; // General typing for columns
};

const TreningUserLuzak: React.FC = () => {
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<TreningData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null); // State for the user ID
  const [horses, setHorses] = useState<any[]>([]); // State for horse data

  // Fetch logged-in user from Supabase
  const getCurrentUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error);
    } else if (data.user) {
      console.log("Logged in user:", data.user);
      setUserId(data.user.id); // Set the user ID when found
    } else {
      console.log("No logged-in user.");
      setLoading(false);
    }
  };

  // Fetch horse data from the database
  const fetchHorses = async () => {
    const { data, error } = await supabase
      .from('horse')
      .select('id, imie'); // Fetch the horse id and name

    if (error) {
      console.error('Error fetching horses:', error);
    } else {
      setHorses(data || []);
    }
  };

  // Fetch training data after the user ID is set
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return; // Exit if userId is null

      let { data, error } = await supabase
          .from('trening')
          .select('poniedzialek, wtorek, sroda, czwartek, piatek, sobota, niedziela, nr_konia')
          .eq('luzak_id', userId);

      if (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        // Get column names from the first row, excluding 'nr_konia'
        setColumns(Object.keys(data[0]).filter(column => column !== 'nr_konia'));
        setData(data);
      }

      setLoading(false);
    };

    getCurrentUser(); // Call getCurrentUser before fetching data
    fetchHorses(); // Fetch horse data
    fetchData(); // Fetch data only if userId is available
  }, [userId]); // Trigger the effect when userId changes

  if (loading) {
    return <div>Loading data...</div>;
  }

  // Helper function to get horse name by ID
  const getHorseName = (horseId: number) => {
    const horse = horses.find((h) => h.id === horseId);
    return horse ? horse.imie : 'Unknown Horse';
  };

  return (
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700 rounded-xl">
          <thead className="bg-blue-600 text-black dark:text-white">
          <tr>
            <th  className="px-4 py-2 text-left border border-gray-300 text-black dark:text-white">Imię Konia</th>
            {/* First column is Horse Name */}
            {columns.map((column) => (
                <th key={column} className="border border-gray-300 px-4 py-2">{column}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-white dark:bg-gray-800">
                {/* Display Horse Name in the first column */}
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200 whitespace-normal break-words max-w-xs">
                  {getHorseName(row.nr_konia)} {/* Map nr_konia to horse name */}
                </td>
                {columns.map((column) => (
                    <td key={column} className="px-4 py-2 text-gray-800 dark:text-gray-200 whitespace-normal break-words max-w-xs">{row[column]}</td>
                ))}
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default TreningUserLuzak;
