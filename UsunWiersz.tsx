"use client";
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import 'reactjs-popup/dist/index.css'
import supabase from '@/supabaseClient.js'
import { useEffect, useState } from 'react'
import '@/globals.css';


const UsunWiersz: React.FC = () => {
    const [horses, setHorses] = useState<{ id: number; imie: string }[]>([]);
    const [selectedHorseId, setSelectedHorseId] = useState<number | null>(null);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const fetchHorses = async () => {
            const { data, error } = await supabase
                .from('horse')
                .select('id, imie');

            if (error) {
                console.error('Error fetching horses:', error);
                setMessage('Wystąpił błąd przy pobieraniu listy koni.');
            } else {
                setHorses(data);
            }
        };

        fetchHorses();
    }, []);

    const handleDelete = async () => {
        if (selectedHorseId === null) {
            setMessage('Proszę wybrać konia.');
            return;
        }

        const { data, error } = await supabase
            .from('horse')
            .delete()
            .eq('id', selectedHorseId);

        if (error) {
            console.error('Error deleting horse:', error);
            setMessage('Wystąpił błąd przy usuwaniu rekordu.');
        } else {
            console.log('Deleted horse:', data);
            setMessage('Rekord został usunięty.');
            setHorses(horses.filter(horse => horse.id !== selectedHorseId));
            setSelectedHorseId(null);
        }
    };

    return (
        <div>
            <form onSubmit={(e) => { e.preventDefault(); handleDelete(); }}>
                <div >
                    <label htmlFor="horse" className="my-2">Wybierz konia do usunięcia<br></br></label>
                    <select
                        className="custom-select w-full"
                        id="horse"
                        name="horse"
                        value={selectedHorseId || ''}
                        onChange={(e) => setSelectedHorseId(Number(e.target.value))}
                        required
                    >
                        <option value="">Wybierz konia</option>
                        {horses.map((horse) => (
                            <option key={horse.id} value={horse.id}>
                                {horse.imie}
                            </option>
                        ))}
                    </select>
                </div>
                <br></br>
                <button className="px-6 py-2 w-fit text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white" type="submit">Usuń</button>

            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UsunWiersz;