"use client";
import React, { useEffect, useState } from 'react';
import supabase from '@/supabaseClient.js';
import styles from '@/UserList.module.css'; // Importujemy CSS dla lepszej stylizacji

const UserList: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false); // Stan do kontroli rozwijania listy

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data, error } = await supabase.auth.admin.listUsers();

                if (error) {
                    throw error;
                }

                setUsers(data?.users || []);
            } catch (error) {
                setError('Błąd podczas pobierania użytkowników: ' + (error as Error).message);
            }
        };

        fetchUsers();
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
                            {user.email} <br></br> (ID:{user.id})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserList;
