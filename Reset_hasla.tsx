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
    <div>
      <h2>Resetowanie hasła użytkownika</h2>
      <input
        type="email"
        value={selectedEmail}
        onChange={(e) => setSelectedEmail(e.target.value)}
        placeholder="Adres e-mail użytkownika"
        className="border p-2 mb-2"
      />
      <button
        onClick={handleResetPassword}
        disabled={isResetting || !selectedEmail}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {isResetting ? 'Resetowanie...' : 'Wyślij link do resetu hasła'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPasswordInterface;
