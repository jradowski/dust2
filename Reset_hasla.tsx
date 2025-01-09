"use client"
import React, { useState } from 'react';
import  supabase  from '@/supabaseClient';
import { UserProvider } from '@/UserContext';
import ProtectedSection from '@/ProtectedSection';

const ResetPasswordInterface: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = useState<string>('');
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleResetPassword = async () => {
    setIsResetting(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(selectedEmail);
      if (error) {
        setMessage(`Błąd: ${error.message}`);
      } else {
        setMessage('Link do resetowania hasła został wysłany na adres e-mail użytkownika.');
      }
    } catch (error) {
      console.error('Wystąpił błąd podczas resetowania hasła:', error);
      setMessage('Wystąpił błąd podczas resetowania hasła.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
  <UserProvider>
  <ProtectedSection requiredRole="wlasciciel_stajni">
      <div className="flex flex-col text-center text-xl mt-6 p-10 bg-white rounded-lg shadow-md dark:bg-gray-800">

        <div className="text-2xl">

          <input
              type="email"
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              placeholder="Adres e-mail użytkownika"
              className="admin_input2"
          />

          <div className="">
            <button
                onClick={handleResetPassword}
                disabled={isResetting || !selectedEmail}
                className="px-6 py-2 w-fit text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white mt-2"
            >
              {isResetting ? 'Resetowanie...' : 'Wyślij link do resetu hasła'}
            </button>
          </div>
        </div>
        {message && <p>{message}</p>}
      </div>
      </ProtectedSection>
      </UserProvider>
  );
};

export default ResetPasswordInterface;
