import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext'; // Import kontekstu użytkownika

interface ProtectedSectionProps {
  requiredRole: string;
  children: React.ReactNode;
}

const ProtectedSection: React.FC<ProtectedSectionProps> = ({ requiredRole, children }) => {
  const { user, loading } = useUser();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Nasłuchujemy na zmianę stanu użytkownika i aktualizujemy stan uprawnień
  useEffect(() => {
    if (!loading) {
      if (user && user.uprawnienia === requiredRole) {
        setHasPermission(true);
      } else {
        setHasPermission(false);
      }
    }
  }, [user, loading, requiredRole]); // Zmieniamy stan, kiedy zmienia się użytkownik lub role

  if (loading) {
    return ; // Możesz dodać komponent ładowania
  }

  if (hasPermission === null) {
    return null; // Zwracamy nic, dopóki nie wiemy, czy użytkownik ma uprawnienia
  }

  if (hasPermission) {
    return <>{children}</>;
  }

  return ;
};

export default ProtectedSection;
