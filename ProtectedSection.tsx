import React from 'react';
import { useUser } from './UserContext'; // Import kontekstu użytkownika

interface ProtectedSectionProps {
  requiredRole: string;
  children: React.ReactNode;
}

const ProtectedSection: React.FC<ProtectedSectionProps> = ({ requiredRole, children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return ;
  }

  if (user && user.uprawnienia === requiredRole) {
    return <>{children}</>;
  }

  return <div>Nie masz uprawnień do tej sekcji.</div>;
};

export default ProtectedSection;