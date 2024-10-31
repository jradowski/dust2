'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import  supabase  from '@/supabaseClient';
import 'reactjs-popup/dist/index.css'

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  // Wczytanie tokenu z URL po zamontowaniu komponentu
  useEffect(() => {
    const url = new URL(window.location.href);
    const tokenFromUrl = url.searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setMessage("Token resetowania hasła jest nieprawidłowy lub wygasł.");
    }
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async () => {
    if (!newPassword) {
      setMessage("Wprowadź nowe hasło");
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setMessage('Błąd resetowania hasła: ' + error.message);
    } else {
      setMessage('Hasło zostało zresetowane pomyślnie!');
      router.push('/login'); // Przekierowanie po sukcesie resetowania
    }

    setLoading(false);
  };

  return (
    <div className="reset-password-container">
      <h2>Resetowanie hasła</h2>
      {token ? (
        <>
          <input 
            type="password"
            value={newPassword}
            onChange={handlePasswordChange}
            placeholder="Nowe hasło"
            className="border p-2 rounded mb-2"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            {loading ? "Resetowanie..." : "Zresetuj hasło"}
          </button>
        </>
      ) : (
        <p className="text-red-500 mt-2">{message}</p>
      )}
    </div>
  );
};

export default ResetPassword;
