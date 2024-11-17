"use client"
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import supabase from '@/supabaseClient.js';

export default function KowalVisits() {
    const [konie, setKonie] = useState<any[]>([]); // Lista koni
    const [selectedKonie, setSelectedKonie] = useState<any[]>([]); // Wybrane konie
    const [kowalData, setKowalData] = useState<Date | null>(null); // Data ostatniej wizyty kowala
    const [nastepnaWizyta, setNastepnaWizyta] = useState<Date | null>(null); // Data następnej wizyty kowala
    const [kowalImie, setKowalImie] = useState<string>(''); // Imię i nazwisko kowala
    const [notatka, setNotatka] = useState<string>(''); // Notatki z wizyty
    const [kartotekaWizyt, setKartotekaWizyt] = useState<any[]>([]); // Kartoteka wizyt kowala
    const [loading, setLoading] = useState<boolean>(true);

    // Pobieranie danych o koniach i wizytach kowala
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // Pobieranie danych o koniach
            const { data, error } = await supabase
                .from('horse')
                .select('*');

            if (error) {
                console.error(error);
            } else {
                setKonie(data);
            }

            // Pobieranie danych o wizytach kowala
            const { data: wizytyData, error: wizytyError } = await supabase
                .from('kowal_wizyty')
                .select('*');

            if (wizytyError) {
                console.error(wizytyError);
            } else {
                setKartotekaWizyt(wizytyData);
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    const handleKowalVisit = async () => {
        if (!kowalData || selectedKonie.length === 0 || !kowalImie) {
            alert("Proszę wybrać konie, datę wizyty kowala oraz podać imię i nazwisko kowala.");
            return;
        }

        const formattedKowalData = format(kowalData, 'yyyy-MM-dd');
        const formattedNastepnaWizyta = format(nastepnaWizyta || new Date(new Date().setMonth(new Date().getMonth() + 2)), 'yyyy-MM-dd'); // domyślnie 8 tygodni od teraz

        // Aktualizacja danych o koniu (kolumna kowal i nastepna_wizyta)
        const updates = selectedKonie.map(async (końId: number) => {
            const { error } = await supabase
                .from('horse')
                .update({
                    kowal: formattedKowalData,
                    nastepna_wizyta: formattedNastepnaWizyta
                })
                .eq('id', końId);

            if (error) {
                console.error(`Błąd aktualizacji konia ${końId}:`, error);
            }
        });

        await Promise.all(updates);

        // Zapisanie wizyty kowala do kartoteki wizyt
        const kartoteka = {
            data_wizyty: formattedKowalData,
            kowal: kowalImie,
            notatka: notatka,
            konie: selectedKonie,
            nastepna_wizyta: formattedNastepnaWizyta
        };

        const { error } = await supabase
            .from('kowal_wizyty')
            .insert([kartoteka]);

        if (error) {
            console.error("Błąd zapisania wizyty kowala:", error);
        } else {
            alert("Wizyta kowala została zapisana.");
            setKartotekaWizyt(prev => [...prev, kartoteka]);
        }
    };

    // Zaznaczanie koni
    const toggleKonie = (końId: number) => {
        setSelectedKonie(prevState => {
            if (prevState.includes(końId)) {
                return prevState.filter(id => id !== końId); // Odznaczanie konia
            } else {
                return [...prevState, końId]; // Zaznaczanie konia
            }
        });
    };

    // Funkcja pomocnicza do pobierania imion koni po ich ID
    const getImionaKoni = (koniIds: number[]) => {
        return konie
            .filter(koń => koniIds.includes(koń.id))
            .map(koń => koń.imie)
            .join(', ');
    };

    // Toggle for showing details
    const [expandedVisitId, setExpandedVisitId] = useState<number | null>(null);

    const toggleDetails = (id: number) => {
        if (expandedVisitId === id) {
            setExpandedVisitId(null);
        } else {
            setExpandedVisitId(id);
        }
    };

    if (loading) {
        return <div>Ładowanie danych...</div>;
    }

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-2xl mb-4">Wizyta Kowala</h1>

            {/* Formularz z wyborem koni */}
            <div className="mb-4">
                <h2>Wybierz konie, które zostały zrobione:</h2>
                <div className="grid grid-cols-2 gap-4">
                    {konie.map((koń) => (
                        <label key={koń.id} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedKonie.includes(koń.id)}
                                onChange={() => toggleKonie(koń.id)}
                            />
                            <span className="ml-2">{koń.imie}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Imię i nazwisko kowala */}
            <div className="mb-4">
                <label className="block">Imię i nazwisko kowala:</label>
                <input
                    type="text"
                    value={kowalImie}
                    onChange={(e) => setKowalImie(e.target.value)}
                    className="border border-gray-300 p-2 w-full"
                    placeholder="Wpisz imię i nazwisko kowala"
                />
            </div>

            {/* Data wizyty kowala */}
            <div className="mb-4">
                <label className="block">Data wizyty kowala:</label>
                <input
                    type="date"
                    onChange={(e) => setKowalData(new Date(e.target.value))}
                    value={kowalData ? format(kowalData, 'yyyy-MM-dd') : ''}
                    className="border border-gray-300 p-2 w-full"
                />
            </div>

            {/* Data następnej wizyty kowala */}
            <div className="mb-4">
                <label className="block">Data następnej wizyty kowala:</label>
                <input
                    type="date"
                    onChange={(e) => setNastepnaWizyta(new Date(e.target.value))}
                    value={nastepnaWizyta ? format(nastepnaWizyta, 'yyyy-MM-dd') : ''}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="border border-gray-300 p-2 w-full"
                />
            </div>

            {/* Notatka z wizyty */}
            <div className="mb-4">
                <label className="block">Notatki z wizyty:</label>
                <textarea
                    value={notatka}
                    onChange={(e) => setNotatka(e.target.value)}
                    className="border border-gray-300 p-2 w-full"
                    placeholder="Wpisz notatki dotyczące wizyty kowala"
                />
            </div>

            {/* Przycisk zapisu wizyty kowala */}
            <button
                onClick={handleKowalVisit}
                className="bg-blue-500 text-white py-2 px-4 rounded"
            >
                Zapisz wizytę kowala
            </button>

            {/* Kartoteka wizyt kowala */}
            <div className="mt-8 w-full">
                <h2 className="text-xl mb-4">Kartoteka Wizyt Kowala</h2>
                <div className="space-y-4">
                    {kartotekaWizyt.map((wizyt, index) => (
                        <div key={index} className="border p-4 rounded-md">
                            <div
                                className="flex justify-between cursor-pointer"
                                onClick={() => toggleDetails(wizyt.id)}
                            >
                                <div>
                                    <strong>{format(new Date(wizyt.data_wizyty), 'yyyy-MM-dd')}</strong> - {wizyt.kowal}
                                </div>
                                <div>{expandedVisitId === wizyt.id ? '▼' : '►'}</div>
                            </div>
                            {expandedVisitId === wizyt.id && (
                                <div className="mt-2">
                                    <p><strong>Konie:</strong> {getImionaKoni(wizyt.konie)}</p>
                                    <p><strong>Notatka:</strong> {wizyt.notatka}</p>
                                    <p><strong>Następna wizyta:</strong> {format(new Date(wizyt.nastepna_wizyta), 'yyyy-MM-dd')}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
