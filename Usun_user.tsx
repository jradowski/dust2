"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient2';

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  position: string;
}

const DeleteUser: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase.from('employees').select('id, first_name, last_name, position');
      if (error) throw error;

      setEmployees(data || []);
    } catch (error) {
      console.error('Błąd przy pobieraniu pracowników:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) {
      setMessage('Proszę wybrać użytkownika do usunięcia.');
      return;
    }

    try {
      const { error } = await supabase.from('employees').delete().eq('id', selectedUser);
      if (error) throw error;

      setMessage('Użytkownik został usunięty.');
      setSelectedUser(null);
      fetchEmployees(); // Aktualizacja listy po usunięciu
    } catch (error) {
      console.error('Błąd przy usuwaniu użytkownika:', error);
      setMessage('Błąd przy usuwaniu użytkownika.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Usuń użytkownika</h2>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Wybierz użytkownika:</label>
        <select
          value={selectedUser || ''}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="">-- Wybierz użytkownika --</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.first_name} {employee.last_name} - {employee.position}
            </option>
          ))}
        </select>
      </div>

    <button
         onClick={handleDeleteUser}
         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
         >
        Usuń użytkownika
    </button>

      {message && <div className="mt-4 text-lg text-center">{message}</div>}
    </div>
  );
};

export default DeleteUser;
