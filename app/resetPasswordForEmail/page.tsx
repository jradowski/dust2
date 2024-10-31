'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import  supabase  from '@/supabaseClient';
import 'reactjs-popup/dist/index.css'
const ResetPassword: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
  
    useEffect(() => {
      // Pobieranie tokenu z URL
      const url = new URL(window.location.href);
      const token = url.hash.split('=')[1];
      if (token) {
        setAccessToken(token);
      } else {
        setMessage("Token resetowania hasła jest nieprawidłowy lub wygasł.");
      }
    }, []);
  
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewPassword(e.target.value);
    };
  
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    };
  
    const handleSubmit = async () => {
      if (!email) {
        setMessage("Wprowadź swój adres e-mail.");
        return;
      }
      if (!newPassword) {
        setMessage("Wprowadź nowe hasło.");
        return;
      }
      if (!accessToken) {
        setMessage("Token resetowania hasła nie został znaleziony.");
        return;
      }
  
      setLoading(true);
  
      try {
        // Krok 1: Weryfikacja tokenu OTP z adresem e-mail
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email,
          token: accessToken,
          type: 'recovery',
        });
  
        if (verifyError) {
          setMessage('Błąd weryfikacji tokenu resetowania hasła: ' + verifyError.message);
          setLoading(false);
          return;
        }
  
        // Krok 2: Ustawienie nowego hasła użytkownika
        const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
  
        if (updateError) {
          setMessage('Błąd przy aktualizacji hasła: ' + updateError.message);
        } else {
          setMessage('Hasło zostało zresetowane pomyślnie! Proszę zalogować się ponownie.');
          router.push('/login');
        }
      } catch (error) {
        setMessage('Wystąpił nieoczekiwany błąd.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="reset-password-container">
        <h2>Resetowanie hasła</h2>
        {accessToken ? (
          <>
            <input 
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Twój e-mail"
              className="border p-2 rounded mb-2"
            />
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