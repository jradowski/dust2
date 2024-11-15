"use client";
import React, { useState } from "react";
import supabase from "@/supabaseClient.js";

const Komentarze: React.FC = () => {
    const [messageContent, setMessageContent] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [ocenaa, setOcenaa] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async () => {
        if (!userId || !messageContent) {
            setError('Wypełnij wszystkie pola');
            return;
        }

        const { error } = await supabase
            .from('komentarze')
            .insert([{ nick: userId, content: messageContent, ocena: ocenaa }]);

        if (error) {
            console.error('Błąd podczas wysyłania wiadomości:', error);
            setError('Błąd podczas wysyłania wiadomości');
        } else {
            console.log('Komentarz wysłano pomyślnie');
            setMessageContent(''); // Resetuj pole wiadomości
            setError(null); // Resetuj błędy
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Dodaj swój komentarz
            </h2>
            <input
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-blue-600"
                type="text"
                placeholder="Twoje imię i nazwisko"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <textarea
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-blue-600"
                placeholder="Treść wiadomości"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
            />
            {/* <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Twoja ocena (0-5)
                </label>
                <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-blue-600"
                    type="number"
                    min="0"
                    max="5"
                    placeholder="Ocena"
                    value={ocenaa}
                    onChange={(e) => setOcenaa(e.target.value)}
                />
            </div> */}
            <button
                className="px-6 py-2 text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white"
                onClick={sendMessage}
            >
                Wyślij
            </button>
            {error && (
                <p className="mt-4 text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Komentarze;
