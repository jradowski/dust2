"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient2';
import { UserProvider } from '@/UserContext';
import ProtectedSection from '@/ProtectedSection';
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
  <UserProvider>
  <ProtectedSection requiredRole="wlasciciel_stajni">
      <div className="flex flex-col text-center text-xl mt-6 p-10 bg-white rounded-lg shadow-md dark:bg-gray-800">

        <div className="mb-4 text-2xl">
          <label className="block text-lg font-semibold mb-2">Wybierz użytkownika:</label>
          <select
              value={selectedUser || ''}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="admin_select"
          >
            <option value="">Wybierz użytkownika</option>
            {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name} - {employee.position}
                </option>
            ))}
          </select>
        </div>

        <div className="text-2xl">
          <button
              onClick={handleDeleteUser}
              className="px-6 py-2 w-fit text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white"
          >
            Usuń użytkownika
          </button>
        </div>

        {message && <div className="mt-4 text-lg text-center">{message}</div>}
      </div>
        </ProtectedSection>
        </UserProvider>
  );
};

export default DeleteUser;
