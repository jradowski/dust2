"use client"
import React, { useState } from 'react';
import { supabase } from '@/supabaseClient2';
import { useUser } from '@/UserContext';
import '@/globals.css'
import '@/admin_board.css'


const AdminPanel: React.FC = () => {
  const { user } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('pracownik'); // Domyślna rola
  const [position, setPosition] = useState(''); // Dodatkowa kolumna 'position'
  const [message, setMessage] = useState('');

  const handleRoleChange = (selectedRole: string) => {
    setRole(selectedRole);
    
    // Automatyczne uzupełnienie pozycji dla właścicieli
    if (selectedRole === 'wlasciciel_stajni' || selectedRole === 'wlasciciel_koni') {
      setPosition(selectedRole);
    } else {
      setPosition(''); // Czyści 'position', jeśli użytkownik wybiera rolę 'pracownik'
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // 1. Stworzenie użytkownika w systemie autoryzacji
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setMessage(`Błąd tworzenia użytkownika: ${authError.message}`);
      return;
    }

    // 2. Dodanie użytkownika do tabeli employees
    if (authData.user) {
      const { data, error } = await supabase.from('employees').insert([
        {
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          uprawnienia: role,
          position: position || role, // Przypisujemy pozycję
        },
      ]);

      if (error) {
        setMessage(`Błąd dodawania do tabeli employees: ${error.message}`);
      } else {
        setMessage(`Użytkownik ${firstName} ${lastName} został pomyślnie dodany.`);
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setRole('pracownik');
        setPosition('');
      }
    }
  };

  return (
      <div className="flex flex-col text-xl mt-6 p-10 bg-white rounded-lg shadow-md dark:bg-gray-800">


        <form onSubmit={handleCreateUser} className="flex flex-col text-2xl gap-4">
          <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="admin_input"
              required
          />
          <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Hasło"
              className="admin_input"
              required
          />
          <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Imię"
              className="admin_input"
              required
          />
          <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nazwisko"
              className="admin_input"
              required
          />
          <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="admin_select"
          >
            <option value="pracownik">Pracownik</option>
            <option value="wlasciciel_koni">Właściciel koni</option>
            <option value="wlasciciel_stajni">Właściciel stajni</option>
          </select>

          {/* Wybór pozycji tylko dla roli "pracownik" */}
          {role === 'pracownik' && (
              <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="admin_select"
                  required
              >
                <option value="">Wybierz pozycję</option>
                <option value="stajenny">Stajenny</option>
                <option value="luzak">Luzak</option>
                <option value="jezdziec">Jeździec</option>
              </select>
          )}

          <div className="items-center">
            <button
                type="submit"
                className="px-6 py-2 w-fit text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white"
            >
              Stwórz użytkownika
            </button>
          </div>
        </form>
        {message && <div className="mt-4 text-lg text-center">{message}</div>}
      </div>
  );
};

export default AdminPanel;
