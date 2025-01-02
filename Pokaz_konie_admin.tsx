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
        .in('uprawnienia', ['wlasciciel_koni', 'wlasciciel_stajni']);
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
      <div className="flex flex-col text-center text-xl mt-6 p-10 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="space-y-4">
          {owners.map((owner) => (
              <div key={owner.id} className="border p-4 rounded-lg shadow">
                <div className="flex items-center justify-between ">
              <span className="font-semibold text-xl">
                {owner.first_name} {owner.last_name}
              </span>
                  <button
                      onClick={() => toggleOwnerHorses(owner.id)}
                      className="px-6 py-2 w-fit text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white"
                  >
                    {expandedOwners[owner.id] ? 'Ukryj konie' : 'Pokaż konie'}
                  </button>

                </div>


                {expandedOwners[owner.id] && (
                    <ul className=" text-lg mt-2 pl-4 list-disc italic">
                      {horsesByOwner[owner.id] && horsesByOwner[owner.id].length > 0 ? (
                          horsesByOwner[owner.id].map((horse) => (

                              <li key={horse.id} className="text-zinc-700 dark:text-white ">
                                {horse.imie}
                              </li>
                          ))
                      ) : (
                          <li className="text-zinc-700 dark:text-white">Brak przypisanych koni</li>
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
