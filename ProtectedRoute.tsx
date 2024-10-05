import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import  supabase  from '@/supabaseClient'; // Zakładam, że supabaseClient już istnieje i jest poprawnie skonfigurowany

interface User {
  id: string;
  email: string;
  uprawnienia: string; // Pole uprawnienia z tabeli employees
}

interface ProtectedRouteProps {
  requiredRole: string; // Wymagana rola do dostępu
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      // Pobierzemy aktualnie zalogowanego użytkownika z Supabase auth
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
        return;
      }

      // Jeśli użytkownik istnieje, pobierzemy uprawnienia z tabeli employees
      if (user) {
        const { data: employeeProfile, error: profileError } = await supabase
          .from('employees')
          .select('uprawnienia') // Zakładamy, że kolumna nazywa się 'uprawnienia'
          .eq('id', user.id) // Porównanie po ID użytkownika
          .single(); // Oczekujemy, że będzie tylko jeden wpis dla danego użytkownika

        if (profileError || !employeeProfile) {
          console.error("Error fetching employee profile:", profileError);
          setLoading(false);
          return;
        }

        // Ustawiamy dane użytkownika w stanie, w tym pobrane uprawnienia z tabeli employees
        setUser({
          id: user.id,
          email: user.email || '', // Zakładamy, że email zawsze będzie istniał
          uprawnienia: employeeProfile.uprawnienia, // Przypisujemy uprawnienia z employees
        });
      }
      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Sprawdzamy, czy użytkownik ma wymagane uprawnienia
  return user && user.uprawnienia === requiredRole ? (
    <Outlet /> // Pozwól na dalsze renderowanie komponentów wewnątrz ścieżki
  ) : (
    <Navigate to="/unauthorized" /> // Brak dostępu
  );
};

export default ProtectedRoute;