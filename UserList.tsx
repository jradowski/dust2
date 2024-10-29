"use client";
import React, { useEffect, useState } from 'react';
import supabase from '@/supabaseClient.js';
import styles from '@/UserList.module.css'; // Importujemy CSS dla lepszej stylizacji

const UserList: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false); // Stan do kontroli rozwijania listy

    useEffect(() => {
        const fetchUsersWithEmployeeData = async () => {
            try {
                // Pobierz użytkowników
                const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();

                if (usersError) {
                    throw usersError;
                }

                const userIds = usersData?.users.map(user => user.id); // Pobierz wszystkie ID użytkowników

                if (userIds && userIds.length > 0) {
                    // Pobierz dane pracowników, których user_id pasuje do ID użytkowników
                    const { data: employeesData, error: employeesError } = await supabase
                        .from('employees')
                        .select('id, first_name, last_name')
                        .in('id', userIds); // Filtruj pracowników po user_id, które odpowiadają ID użytkowników

                    if (employeesError) {
                        throw employeesError;
                    }

                    // Mapuj dane użytkowników z danymi z tabeli employees
                    const usersWithEmployeeData = usersData?.users.map(user => {
                        const employee = employeesData?.find(emp => emp.id === user.id);
                        return {
                            ...user,
                            first_name: employee?.first_name || 'Brak imienia',
                            last_name: employee?.last_name || 'Brak nazwiska',
                        };
                    });

                    setUsers(usersWithEmployeeData || []);
                } else {
                    setUsers(usersData?.users || []);
                }
            } catch (error) {
                setError('Błąd podczas pobierania użytkowników: ' + (error as Error).message);
            }
        };

        fetchUsersWithEmployeeData();
    }, []);

    const toggleList = () => {
        setIsOpen(!isOpen); // Przełączanie stanu rozwijania
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title} onClick={toggleList}>
                Użytkownicy {isOpen ? '▲' : '▼'}
            </h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isOpen && (
                <ul className={styles.userList}>
                    {users.map(user => (
                        <li key={user.id} className={styles.userItem}>
                            {user.first_name} {user.last_name} <br /> (email: {user.email})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserList;
