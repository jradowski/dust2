"use client";
import Image from 'next/image';
import Link from 'next/link';
import 'reactjs-popup/dist/index.css';
import supabase from '@/supabaseClient.js';
import React, { useState, useEffect } from 'react';
import styles from './Inbox.module.css'; // Stwórz plik CSS dla stylizacji

const Inbox: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false); // Do rozwinięcia wiadomości
    const [filter, setFilter] = useState({
        sender: '',
        startDate: '',
        endDate: ''
    });

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
            setFilteredMessages(messagesWithSenderInfo);
        };

        fetchMessages();
    }, [userId]);

    useEffect(() => {
        // Filtrowanie wiadomości
        const filterMessages = () => {
            let filtered = messages;

            if (filter.sender) {
                filtered = filtered.filter((msg) =>
                    msg.sender_name.toLowerCase().includes(filter.sender.toLowerCase())
                );
            }

            if (filter.startDate) {
                filtered = filtered.filter((msg) => new Date(msg.created_at) >= new Date(filter.startDate));
            }

            if (filter.endDate) {
                filtered = filtered.filter((msg) => new Date(msg.created_at) <= new Date(filter.endDate));
            }

            setFilteredMessages(filtered);
        };

        filterMessages();
    }, [filter, messages]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilter((prev) => ({ ...prev, [name]: value }));
    };

    // Funkcja do resetowania filtrów
    const resetFilters = () => {
        setFilter({
            sender: '',
            startDate: '',
            endDate: ''
        });
    };

    return (
        <div className="flex flex-col text-xl mt-6 p-10 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className={styles.container}>
                {error && <p className={styles.error}>{error}</p>}

                {/* Filtracja */}
                <div className={styles.filterSection}>
                    <label>
                        Adresat:
                        <input
                            type="text"
                            name="sender"
                            value={filter.sender}
                            onChange={handleFilterChange}
                            className="custom-input"
                        />
                    </label>
                    <label>
                        Data początkowa:
                        <input
                            type="date"
                            name="startDate"
                            value={filter.startDate}
                            onChange={handleFilterChange}
                            className="custom-input"
                        />
                    </label>
                    <label>
                        Data końcowa:
                        <input
                            type="date"
                            name="endDate"
                            value={filter.endDate}
                            onChange={handleFilterChange}
                            className="custom-input"
                        />
                    </label>
                    {/* Przycisk resetowania filtrów */}
                    <button
                        onClick={resetFilters}
                        className={styles.resetButton}
                    >
                        Resetuj filtry
                    </button>
                </div>

                {/* Wyświetlanie wiadomości */}
                <div className={styles.messageList}>
                    {filteredMessages.length > 0 ? (
                        <>
                            {filteredMessages.slice(0, isExpanded ? filteredMessages.length : 3).map((message) => (
                                <div key={message.id} className={styles.messageCard}>
                                    <div className={styles.senderInfo}>
                                        <Image
                                            src="/avatar.png"
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
                            ))}
                            {!isExpanded && (
                                <button
                                    onClick={() => setIsExpanded(true)}
                                    className="w-full bg-blue-500 p-2 rounded text-white"
                                >
                                    Rozwiń
                                </button>
                            )}
                        </>
                    ) : (
                        <p className={styles.noMessages}>Brak wiadomości</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inbox;
