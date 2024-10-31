"use client";
import Image from 'next/image';
import Link from 'next/link';
import 'reactjs-popup/dist/index.css';
import supabase from '@/supabaseClient.js';
import React, { useState, useEffect } from 'react';
import styles from './Inbox.module.css'; // Stwórz plik CSS dla stylizacji

const Inbox: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getCurrentUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Błąd podczas pobierania użytkownika:', error);
                setError('Błąd podczas pobierania użytkownika');
            } else if (data.user) {
                setUserId(data.user.id || null);
            }
        };

        getCurrentUser();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!userId) return;

            // Pobierz wiadomości odbierane przez aktualnie zalogowanego użytkownika
            const { data: messagesData, error: messagesError } = await supabase
                .from('messages')
                .select('*')
                .eq('receiver_id', userId)
                .order('created_at', { ascending: false });

            if (messagesError) {
                console.error('Błąd podczas pobierania wiadomości:', messagesError);
                setError('Błąd podczas pobierania wiadomości');
                return;
            }

            // Pobierz nadawców wiadomości z tabeli employees
            const senderIds = messagesData.map((msg) => msg.sender_id);

            const { data: employeesData, error: employeesError } = await supabase
                .from('employees')
                .select('id, first_name, last_name')
                .in('id', senderIds);

            if (employeesError) {
                console.error('Błąd podczas pobierania nadawców:', employeesError);
                setError('Błąd podczas pobierania nadawców');
                return;
            }

            // Łączenie danych wiadomości z informacjami o nadawcach
            const messagesWithSenderInfo = messagesData.map((message) => {
                const sender = employeesData.find((emp) => emp.id === message.sender_id);
                return {
                    ...message,
                    sender_name: sender ? `${sender.first_name} ${sender.last_name}` : 'Nieznany nadawca',
                };
            });

            setMessages(messagesWithSenderInfo);
        };

        fetchMessages();
    }, [userId]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Skrzynka odbiorcza</h2>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.messageList}>
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <div key={message.id} className={styles.messageCard}>
                            <div className={styles.senderInfo}>
                                <Image
                                    src="/avatar.png" // Zamień na właściwą ścieżkę do avatara użytkownika, jeśli istnieje
                                    alt="Avatar"
                                    width={50}
                                    height={50}
                                    className={styles.avatar}
                                />
                                <div className="text-black">
                                    <p className={styles.senderName}>
                                        <strong>Od:</strong> {message.sender_name}
                                    </p>
                                    <p className={styles.timestamp}>
                                        {new Date(message.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className={styles.messageContent}>{message.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.noMessages}>Brak wiadomości</p>
                )}
            </div>
        </div>
    );
};

export default Inbox;
