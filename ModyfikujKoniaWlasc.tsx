"use client";
import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient.js';
import 'reactjs-popup/dist/index.css'

const ModyfikujKonia: React.FC = () => {
    const [horses, setHorses] = useState<{ id: number; imie: string }[]>([]);
    const [selectedHorseId, setSelectedHorseId] = useState<number | null>(null);
    const [selectedHorseData, setSelectedHorseData] = useState<any>(null);
    const [message, setMessage] = useState<string>('');

    // Pobierz ID zalogowanego użytkownika
    useEffect(() => {
        const fetchHorsesForOwner = async () => {
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError) {
                console.error('Błąd podczas uzyskiwania sesji:', sessionError);
                setMessage('Nie udało się pobrać sesji użytkownika.');
                return;
            }

            const userId = session?.user?.id;

            if (!userId) {
                setMessage('Nie znaleziono zalogowanego użytkownika.');
                return;
            }

            try {
                // Pobierz konie, których właścicielem jest zalogowany użytkownik
                const { data, error } = await supabase
                    .from('horse')
                    .select('id, imie')
                    .eq('wlasc_id', userId);

                if (error) {
                    console.error('Błąd przy pobieraniu koni:', error);
                    setMessage('Wystąpił błąd przy pobieraniu listy koni.');
                } else {
                    setHorses(data);
                }
            } catch (error) {
                console.error('Nieoczekiwany błąd:', error);
                setMessage('Wystąpił błąd podczas pobierania koni.');
            }
        };

        fetchHorsesForOwner();
    }, []);

    const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const horseId = Number(event.target.value);
        setSelectedHorseId(horseId);

        const { data: horseData, error } = await supabase
            .from('horse')
            .select('*')
            .eq('id', horseId)
            .single();

        if (error) {
            console.error('Błąd przy pobieraniu danych konia:', error);
            setMessage('Wystąpił błąd przy pobieraniu danych konia do modyfikacji.');
        } else {
            setSelectedHorseData(horseData);
        }
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedHorseData) {
            setMessage('Proszę wybrać konia do modyfikacji.');
            return;
        }

        const { id, ...updatedFields } = selectedHorseData;

        const { error } = await supabase
            .from('horse')
            .update(updatedFields)
            .eq('id', id);

        if (error) {
            console.error('Błąd przy aktualizacji konia:', error);
            setMessage('Wystąpił błąd przy aktualizacji danych konia.');
        } else {
            setMessage('Dane konia zostały zaktualizowane.');
        }
    };

    const renderForm = () => {
        if (!selectedHorseData) return null;

        return (
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label htmlFor="imie">Imię konia:</label>
                    <input
                        className="custom-input"
                        type="text"
                        id="imie"
                        name="imie"
                        value={selectedHorseData.imie}
                        onChange={(e) => setSelectedHorseData({...selectedHorseData, imie: e.target.value})}
                        required
                    />

                </div>


                <div>
                    <label htmlFor="data_urodzenia">Data urodzenia:</label>
                    <input
                        className="custom-input"
                        type="date"
                        id="data_urodzenia"
                        name="data_urodzenia"
                        value={selectedHorseData.data_urodzenia}
                        onChange={(e) => setSelectedHorseData({...selectedHorseData, data_urodzenia: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="plec">Płeć:</label>
                    <select
                        className="custom-select"
                        id="plec"
                        name="plec"
                        value={selectedHorseData.plec}
                        onChange={(e) => setSelectedHorseData({...selectedHorseData, plec: e.target.value})}
                        required
                    >
                        <option value="">Wybierz</option>
                        <option value="wałach">wałach</option>
                        <option value="ogier">ogier</option>
                        <option value="klacz">klacz</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="id_wlasciciela">ID właściciela:</label>
                    <input
                        className="custom-input"
                        type="text"
                        id="id_wlasciciela"
                        name="id_wlasciciela"
                        value={selectedHorseData.id_wlasciciela}
                        onChange={(e) => setSelectedHorseData({...selectedHorseData, id_wlasciciela: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="wlasciciel">Właściciel:</label>
                    <input
                        className="custom-input"
                        type="text"
                        id="wlasciciel"
                        name="wlasciciel"
                        value={selectedHorseData.wlasciciel}
                        onChange={(e) => setSelectedHorseData({...selectedHorseData, wlasciciel: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <div className="text-2xl my-2">Rodowód:</div>
                    <label htmlFor="v">Imie ojca:</label>
                    <input
                        className="custom-input"
                        type="text"
                        id="v"
                        name="v"
                        value={selectedHorseData.v}
                        onChange={(e) => setSelectedHorseData({...selectedHorseData, v: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="m">Imie matki:</label>
                    <input
                        className="custom-input"
                        type="text"
                        id="m"
                        name="m"
                        value={selectedHorseData.m}
                        onChange={(e) => setSelectedHorseData({...selectedHorseData, m: e.target.value})}
                        required
                    />

                    <label htmlFor="mv">/ </label>
                    <input
                        className="custom-input"
                        type="text"
                        id="mv"
                        name="mv"
                        value={selectedHorseData.mv}
                        onChange={(e) => setSelectedHorseData({...selectedHorseData, mv: e.target.value})}
                        required
                    />
                </div>
                <label htmlFor="kowal">Ostatnia wizyta kowala:</label>
                <input
                    className="custom-input"
                    type="date"
                    id="kowal"
                    name="kowal"
                    value={selectedHorseData.kowal}
                    onChange={(e) => setSelectedHorseData({...selectedHorseData, kowal: e.target.value})}
                    required
                />
                <br></br>
                <div className="text-2xl my-2">Programowanie diety</div>
                <div>
                    <label htmlFor="ilosc_posilkow">Ilość posiłków:</label>
                    <select
                        className="custom-select"
                        id="ilosc_posilkow"
                        name="ilosc_posilkow"
                        value={selectedHorseData.ilosc_posilkow}
                        onChange={(e) => setSelectedHorseData({...selectedHorseData, ilosc_posilkow: e.target.value})}
                        required
                    >
                        <option value="">Wybierz</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="wielkosc_posilku">Ilość miarek na posiłek:</label>
                    <select
                        className="custom-select"
                        id="wielkosc_posilku"
                        name="wielkosc_posilku"
                        value={selectedHorseData.wielkosc_posilku}
                        onChange={(e) => setSelectedHorseData({...selectedHorseData, wielkosc_posilku: e.target.value})}
                        required
                    >
                        <option value="">Wybierz</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="posilek">Skład posiłku:</label>
                    <input
                        className="custom-input"
                        type="text"
                        id="posilek"
                        name="posilek"
                        value={selectedHorseData.posilek}
                        onChange={(e) => setSelectedHorseData({...selectedHorseData, posilek: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="nr_boksu">Nr boksu:</label>
                    <input
                        className="custom-input"
                        type="text"
                        id="nr_boksu"
                        name="nr_boksu"
                        value={selectedHorseData.nr_boksu}
                        onChange={(e) => setSelectedHorseData({...selectedHorseData, nr_boksu: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="nr_padoku">Nr padoku:</label>
                    <input
                        className="custom-input"
                        type="text"
                        id="nr_padoku"
                        name="nr_padoku"
                        value={selectedHorseData.nr_padoku}
                        onChange={(e) => setSelectedHorseData({...selectedHorseData, nr_padoku: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="nr_treningowy">Nr treningowy:</label>
                    <input
                        className="custom-input"
                        type="text"
                        id="nr_treningowy"
                        name="nr_treningowy"
                        value={selectedHorseData.nr_treningowy || ''}
                        onChange={(e) => setSelectedHorseData({...selectedHorseData, nr_treningowy: e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="nr_hodowlany">Nr hodowlany:</label>
                    <input
                        className="custom-input"
                        type="text"
                        id="nr_hodowlany"
                        name="nr_hodowlany"
                        value={selectedHorseData.nr_hodowlany || ''}
                        onChange={(e) => setSelectedHorseData({...selectedHorseData, nr_hodowlany: e.target.value})}
                    />
                </div>
                <br/>
                <button type="submit"
                        className="px-6 py-2 w-fit text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white">Zapisz
                    zmiany
                </button>
            </form>
        );
    };

    return (
        <div>
        <div>
                <label htmlFor="horse">Wybierz konia do modyfikacji:</label>
                <select
                    className="custom-select"
                    id="horse"
                    name="horse"
                    value={selectedHorseId || ''}
                    onChange={handleSelectChange}
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
            {renderForm()}
            {message && <p>{message}</p>}
        </div>
    );
};

export default ModyfikujKonia;
