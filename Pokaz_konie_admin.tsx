"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient2';
import { useUser } from '@/UserContext';
import '@/admin_board.css';
import '@/globals.css';

interface Horse {
  id: number;
  imie: string;
  wlasc_id: string;
}

interface Owner {
  id: string;
  first_name: string;
  last_name: string;
}

const AdminPanel: React.FC = () => {
  const { user } = useUser();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [horsesByOwner, setHorsesByOwner] = useState<{ [ownerId: string]: Horse[] }>({});
  const [expandedOwners, setExpandedOwners] = useState<{ [ownerId: string]: boolean }>({});

  useEffect(() => {
    fetchOwnersAndHorses();
  }, []);

  const fetchOwnersAndHorses = async () => {
    try {
      // Pobranie listy właścicieli koni
      const { data: ownerData, error: ownerError } = await supabase
        .from('employees')
        .select('id, first_name, last_name')
        .eq('uprawnienia', 'wlasciciel_koni');
      if (ownerError) throw ownerError;

      setOwners(ownerData || []);

      // Pobranie koni przypisanych do właścicieli
      const { data: horseData, error: horseError } = await supabase
        .from('horse')
        .select('id, imie, wlasc_id');
      if (horseError) throw horseError;

      // Grupowanie koni po `wlasc_id`
      const horsesGroupedByOwner = horseData?.reduce((acc: { [ownerId: string]: Horse[] }, horse: Horse) => {
        if (!acc[horse.wlasc_id]) acc[horse.wlasc_id] = [];
        acc[horse.wlasc_id].push(horse);
        return acc;
      }, {});

      setHorsesByOwner(horsesGroupedByOwner || {});
    } catch (error) {
      console.error("Błąd przy pobieraniu danych:", error);
    }
  };

  const toggleOwnerHorses = (ownerId: string) => {
    setExpandedOwners((prevExpandedOwners) => ({
      ...prevExpandedOwners,
      [ownerId]: !prevExpandedOwners[ownerId],
    }));
  };

  return (
    <div className="text-center bg-white border-r-2 border-b-2 border-zinc-200 p-5 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-r-2 dark:border-gray-600  ">
      <h2 className="text-2xl font-bold mb-4 p-4 border-b-2 border-zinc-200 dark:border-b-2 dark:border-gray-600 ">Właściciele koni w stajni</h2>
      <div className="space-y-4">
        {owners.map((owner) => (
          <div key={owner.id} className="border p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">
                {owner.first_name} {owner.last_name}
              </span>
              <button
                onClick={() => toggleOwnerHorses(owner.id)}
                className="admin_button"
              >
                {expandedOwners[owner.id] ? 'Ukryj konie' : 'Pokaż konie'}
              </button>
            </div>
            {expandedOwners[owner.id] && (
              <ul className="mt-2 pl-4 list-disc">
                {horsesByOwner[owner.id] && horsesByOwner[owner.id].length > 0 ? (
                  horsesByOwner[owner.id].map((horse) => (
                    <li key={horse.id} className="text-gray-700">
                      {horse.imie}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">Brak przypisanych koni</li>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
