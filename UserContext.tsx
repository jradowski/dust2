'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient2'; // Upewnij się, że masz poprawny import

interface User {
  id: string;
  email: string;
  uprawnienia: string; // Dodaj uprawnienia
}

interface UserContextProps {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Funkcja do pobierania użytkownika
    const fetchUser = async () => {
      const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user:', userError);
        setLoading(false);
        return;
      }

      if (supabaseUser) {
        const { data: employeesData, error: employeesError } = await supabase
          .from('employees')
          .select('uprawnienia')
          .eq('id', supabaseUser.id) // Upewnij się, że id pasuje
          .single();

        if (employeesError) {
          console.error('Error fetching user permissions:', employeesError);
          setLoading(false);
          return;
        }

        // Przypisz dane użytkownika
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          uprawnienia: employeesData.uprawnienia, // Zbieramy uprawnienia
        });
      }

      setLoading(false);
    };

    // Nasłuchujemy na zmiany autentykacji
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Jeśli sesja istnieje, pobieramy dane użytkownika
        fetchUser();
      } else {
        // Jeśli sesja została zakończona, resetujemy stan
        setUser(null);
        setLoading(false);
      }
    });

    // Na początku pobieramy dane użytkownika
    fetchUser();

    // Cleanup listener przy odmontowywaniu komponentu
    return () => {
      authListener.data.subscription.unsubscribe(); // Zakończenie subskrypcji
    };
  }, []); // Uruchamiane raz na początek

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
