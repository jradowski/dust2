"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient2';
import { useUser } from './UserContext';

interface Horse {
  id: number;
  imie: string;
  wlasc_id: string | null;
}

interface Owner {
  id: string;
  first_name: string;
  last_name: string;
}

const AssignHorses: React.FC = () => {
  const { user } = useUser();
  const [horses, setHorses] = useState<Horse[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [selectedHorse, setSelectedHorse] = useState<string | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchHorses();
    fetchOwners();
  }, []);

  const fetchHorses = async () => {
    try {
      const { data: horseData, error: horseError } = await supabase
        .from('horse')
        .select('id, imie, wlasc_id')
        .is('wlasc_id', null);
      if (horseError) throw horseError;

      setHorses(horseData || []);
    } catch (error) {
      console.error('Błąd przy pobieraniu koni:', error);
    }
  };

  const fetchOwners = async () => {
    try {
      const { data: ownerData, error: ownerError } = await supabase
        .from('employees')
        .select('id, first_name, last_name')
        .eq('uprawnienia', 'wlasciciel_koni');
      if (ownerError) throw ownerError;

      setOwners(ownerData || []);
    } catch (error) {
      console.error('Błąd przy pobieraniu właścicieli:', error);
    }
  };

  const handleAssignHorse = async () => {
    if (!selectedHorse || !selectedOwner) {
      setMessage('Proszę wybrać konia i właściciela.');
      return;
    }

    try {
      const { error } = await supabase
        .from('horse')
        .update({ wlasc_id: selectedOwner })
        .eq('id', selectedHorse);

      if (error) throw error;

      setMessage('Koń został przypisany do właściciela.');
      setSelectedHorse(null);
      setSelectedOwner(null);
      fetchHorses(); // Aktualizuj listę dostępnych koni
    } catch (error) {
      console.error('Błąd przy przypisywaniu konia:', error);
      setMessage('Błąd przy przypisywaniu konia.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Przypisanie Koni do Właścicieli</h2>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Wybierz konia:</label>
        <select
          value={selectedHorse || ''}
          onChange={(e) => setSelectedHorse(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="">-- Wybierz konia --</option>
          {horses.map((horse) => (
            <option key={horse.id} value={horse.id}>
              {horse.imie}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Wybierz właściciela konia:</label>
        <select
          value={selectedOwner || ''}
          onChange={(e) => setSelectedOwner(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="">-- Wybierz właściciela --</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.first_name} {owner.last_name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAssignHorse}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Przypisz konia
      </button>

      {message && <div className="mt-4 text-lg text-center">{message}</div>}
    </div>
  );
};

export default AssignHorses;
