"use client"
import React, { useState } from 'react';
import  supabase  from '@/supabaseClient';

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
    <div className="text-center bg-white border-r-2 border-b-2 border-zinc-200 p-5 dark:bg-gradient-to-b dark:from-zinc-800 dark:bg-zinc-800 dark:border-b-2 dark:border-r-2 dark:border-gray-600  ">
      <h2 className="text-2xl font-bold mb-4 p-4 border-b-2 border-zinc-200 dark:border-b-2 dark:border-gray-600 ">Resetowanie hasła użytkownika</h2>
        <div className="text-2xl">
            <input
                type="email"
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                placeholder="Adres e-mail użytkownika"
                className="admin_input2"
            />
            <button
                onClick={handleResetPassword}
                disabled={isResetting || !selectedEmail}
                className="admin_button"
            >
                {isResetting ? 'Resetowanie...' : 'Wyślij link do resetu hasła'}
            </button>
        </div>
        {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPasswordInterface;
