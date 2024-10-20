"use client";
import React, { useState, useEffect } from 'react';
import supabase from '@/supabaseClient.js';
import 'reactjs-popup/dist/index.css';

const MessageSender: React.FC = () => {
    const [messageContent, setMessageContent] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);
    const [recipientId, setRecipientId] = useState<string>('');
    const [users, setUsers] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch the current user
    useEffect(() => {
        const getCurrentUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Błąd podczas pobierania użytkownika:', error);
                setError('Błąd podczas pobierania użytkownika');
            } else if (data.user) {
                setUserId(data.user.id);
            }
        };

        getCurrentUser();
    }, []);

    // Fetch the list of users from Supabase
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data, error } = await supabase.auth.admin.listUsers();
                if (error) throw error;
                setUsers(data?.users || []);
            } catch (error) {
                setError('Błąd podczas pobierania użytkowników: ' + (error as Error).message);
            }
        };

        fetchUsers();
    }, []);

    const sendMessage = async () => {
        if (!userId || !recipientId || !messageContent) {
            setError('Wypełnij wszystkie pola');
            return;
        }

        const { error } = await supabase
            .from('messages')
            .insert([{ sender_id: userId, receiver_id: recipientId, content: messageContent }]);

        if (error) {
            console.error('Błąd podczas wysyłania wiadomości:', error);
            setError('Błąd podczas wysyłania wiadomości');
        } else {
            console.log('Wiadomość wysłana pomyślnie');
            setMessageContent('');
            setRecipientId('');
            setError(null);
        }
    };

    return (
        <div>
            <h2>Wyślij wiadomość</h2>

            {/* Dropdown with users */}
            <select
                className="custom-select"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
            >
                <option value="">Wybierz odbiorcę</option>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>
                        {user.email}
                    </option>
                ))}
            </select>
            <br />

            {/* Message content input */}
            <textarea
                className="custom-textarea"
                placeholder="Treść wiadomości"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
            /><br />

            {/* Send button */}
            <button className="custom-button" onClick={sendMessage}>
                Wyślij
            </button>

            {/* Error message */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default MessageSender;
