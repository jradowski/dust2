"use client";
import React, { useState, useEffect } from 'react';
import supabase from '@/supabaseClient.js';
import 'reactjs-popup/dist/index.css';

const MessageSender: React.FC = () => {
    const [messageContent, setMessageContent] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);
    const [recipientId, setRecipientId] = useState<string>('');
    const [employees, setEmployees] = useState<any[]>([]);
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

    // Fetch the list of employees from Supabase
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const { data, error } = await supabase
                    .from('employees')
                    .select('id, first_name, last_name');
                
                if (error) throw error;

                setEmployees(data || []);
            } catch (error) {
                setError('Błąd podczas pobierania pracowników: ' + (error as Error).message);
            }
        };

        fetchEmployees();
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

            {/* Dropdown with employees' names */}
            <div >
                <select
                    className="custom-select"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                >
                    <option value="">Wybierz odbiorcę</option>
                    {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                            {employee.first_name} {employee.last_name}
                        </option>
                    ))}
                </select>
            </div>
            <br/>

            {/* Message content input */}
            <textarea
                className="custom-textarea"
                placeholder="Treść wiadomości"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
            /><br/>

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
