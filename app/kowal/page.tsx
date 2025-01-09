"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import supabase from "@/supabaseClient.js";
import { UserProvider } from '@/UserContext';
import ProtectedSection from '@/ProtectedSection';
export default function KowalVisits() {
  const [konie, setKonie] = useState<any[]>([]); // Lista koni
  const [selectedKonie, setSelectedKonie] = useState<any[]>([]); // Wybrane konie
  const [kowalData, setKowalData] = useState<Date | null>(null); // Data ostatniej wizyty kowala
  const [nastepnaWizyta, setNastepnaWizyta] = useState<Date | null>(null); // Data następnej wizyty kowala
  const [kowalImie, setKowalImie] = useState<string>(""); // Imię i nazwisko kowala
  const [notatka, setNotatka] = useState<string>(""); // Notatki z wizyty
  const [kartotekaWizyt, setKartotekaWizyt] = useState<any[]>([]); // Kartoteka wizyt kowala
  const [loading, setLoading] = useState<boolean>(true);

  // Dane dla filtrów
  const [filteredKartoteka, setFilteredKartoteka] = useState<any[]>([]); // Po filtrowaniu wizyt
  const [kowalFilter, setKowalFilter] = useState<string>(""); // Filtr kowala (zmiana na string, nie null)
  const [dataOd, setDataOd] = useState<Date | null>(null); // Data od
  const [dataDo, setDataDo] = useState<Date | null>(null); // Data do
  const [końFilter, setKońFilter] = useState<string>(""); // Filtr po imieniu konia

  // Pobieranie danych o koniach i wizytach kowala
  const fetchData = async () => {
    setLoading(true);

    try {
      // Pobieranie danych o koniach
      const { data, error } = await supabase.from("horse").select("*");
      if (error) {
        console.error("Błąd pobierania koni:", error);
        setLoading(false);
        return;
      } else {
        setKonie(data);
      }

      // Pobieranie danych o wizytach kowala
      const { data: wizytyData, error: wizytyError } = await supabase
        .from("kowal_wizyty")
        .select("*");

      if (wizytyError) {
        console.error("Błąd pobierania wizyt kowala:", wizytyError);
        setLoading(false);
        return;
      } else {
        setKartotekaWizyt(wizytyData);
        setFilteredKartoteka(wizytyData); // Początkowo wszystkie wizyty
      }

      setLoading(false); // Po zakończeniu pobierania danych ustawiamy loading na false

    } catch (error) {
      console.error("Wystąpił błąd przy pobieraniu danych:", error);
      setLoading(false); // W razie błędu również zmieniamy loading na false
    }
  };

  // Filtracja wizyt
  useEffect(() => {
    let filteredData = kartotekaWizyt;

    // Filtr po kowalu
    if (kowalFilter) {
      filteredData = filteredData.filter(
        (wizyt) => wizyt.kowal && wizyt.kowal.toLowerCase().includes(kowalFilter.toLowerCase())
      );
    }

    // Filtr po dacie
    if (dataOd) {
      filteredData = filteredData.filter(
        (wizyt) => new Date(wizyt.data_wizyty) >= dataOd
      );
    }
    if (dataDo) {
      filteredData = filteredData.filter(
        (wizyt) => new Date(wizyt.data_wizyty) <= dataDo
      );
    }

    // Filtr po imieniu konia
    if (końFilter) {
      filteredData = filteredData.filter((wizyt) =>
        wizyt.konie.some((końId: number) => {
          const koń = konie.find((koń) => koń.id === końId);
          return koń && koń.imie.toLowerCase().includes(końFilter.toLowerCase());
        })
      );
    }

    // Filtr po koniach użytkownika
    if (selectedKonie.length > 0) {
      filteredData = filteredData.filter((wizyt) =>
        wizyt.konie.some((końId: number) => selectedKonie.includes(końId))
      );
    }

    setFilteredKartoteka(filteredData); // Zaktualizowanie filtrów
  }, [kowalFilter, dataOd, dataDo, selectedKonie, kartotekaWizyt, końFilter, konie]);

  // Zaznaczanie koni
  const toggleKonie = (końId: number) => {
    setSelectedKonie((prevState) => {
      if (prevState.includes(końId)) {
        return prevState.filter((id) => id !== końId); // Odznaczanie konia
      } else {
        return [...prevState, końId]; // Zaznaczanie konia
      }
    });
  };

  // Funkcja pomocnicza do pobierania imion koni po ich ID
  const getImionaKoni = (koniIds: number[]) => {
    return konie
      .filter((koń) => koniIds.includes(koń.id))
      .map((koń) => koń.imie)
      .join(", ");
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

  const handleKowalVisit = async () => {
    // Walidacja danych
    if (!kowalImie || !kowalData || !nastepnaWizyta || !selectedKonie.length) {
      alert("Proszę wypełnić wszystkie dane.");
      return;
    }

    // Formatowanie dat
    const dataWizyty = format(kowalData, "yyyy-MM-dd");
    const nastepnaWizytaFormatted = format(nastepnaWizyta, "yyyy-MM-dd");

    // Przygotowanie danych do zapisania w bazie
    const { error } = await supabase
      .from("kowal_wizyty")
      .insert([{
        kowal: kowalImie,
        data_wizyty: dataWizyty,
        nastepna_wizyta: nastepnaWizytaFormatted,
        notatka: notatka,
        konie: selectedKonie,
      }]);

    if (error) {
      alert("Wystąpił błąd podczas zapisywania wizyty.");
      console.error(error);
      return;
    }

    // Po zapisaniu wizyty, aktualizujemy dane o koniach
    try {
      for (const końId of selectedKonie) {
        const { error: horseError } = await supabase
          .from("horse")
          .update({
            kowal: dataWizyty, // Aktualizujemy kowala
            nastepna_wizyta: nastepnaWizytaFormatted, // Aktualizujemy datę następnej wizyty
          })
          .eq("id", końId);

        if (horseError) {
          console.error(`Błąd podczas aktualizowania konia o ID ${końId}:`, horseError);
        }
      }
      alert("Wizyta kowala została zapisana i dane koni zaktualizowane.");
    } catch (error) {
      alert("Wystąpił błąd podczas aktualizowania danych koni.");
      console.error("Błąd aktualizacji danych koni:", error);
    }

    // Resetujemy formularz
    setKowalImie("");
    setKowalData(null);
    setNastepnaWizyta(null);
    setNotatka("");
    setSelectedKonie([]);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Ładowanie danych...</div>;
  }

  return (
    <UserProvider>
    <ProtectedSection requiredRole="wlasciciel_stajni">  
    <div className="flex flex-col gap-10 items-center p-6 xl:px-96">
      <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
        <div className="text-transparent text-center font-bold text-2xl mb-6 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-300 dark:to-blue-300">
          <h1>Wizyta kowala</h1>
        </div>

        <div className="flex flex-col text-xl mt-6 p-10 bg-white rounded-lg shadow-md dark:bg-gray-800">
          {/* Formularz z wyborem koni */}
          <div className="mb-4">
            <h2>Wybierz konie, które zostały podkute</h2>
            <div className="w-full grid grid-cols-2 gap-4 p-2 ">
              {konie.map((koń) => (
                <label key={koń.id} className="grid grid-cols-2 border p-2 rounded-md">
                  <span className="ml-2">{koń.imie}</span>
                  <input
                    type="checkbox"
                    checked={selectedKonie.includes(koń.id)}
                    onChange={() => toggleKonie(koń.id)}
                  />
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
              className="custom-input"
              placeholder="Wpisz imię i nazwisko kowala"
            />
          </div>

          {/* Data wizyty kowala */}
          <div className="mb-4">
            <label className="block">Data wizyty kowala:</label>
            <input
              type="date"
              onChange={(e) => setKowalData(new Date(e.target.value))}
              value={kowalData ? format(kowalData, "yyyy-MM-dd") : ""}
              className="custom-input"
            />
          </div>

          {/* Data następnej wizyty kowala */}
          <div className="mb-4">
            <label className="block">Data następnej wizyty kowala:</label>
            <input
              type="date"
              onChange={(e) => setNastepnaWizyta(new Date(e.target.value))}
              value={nastepnaWizyta ? format(nastepnaWizyta, "yyyy-MM-dd") : ""}
              min={format(new Date(), "yyyy-MM-dd")}
              className="custom-input"
            />
          </div>

          {/* Notatka z wizyty */}
          <div className="mb-4">
            <label className="block">Notatki z wizyty:</label>
            <textarea
              value={notatka}
              onChange={(e) => setNotatka(e.target.value)}
              className="custom-textarea"
              placeholder="Wpisz notatki dotyczące wizyty kowala"
            />
          </div>

          {/* Przycisk zapisu wizyty kowala */}
          <button
            onClick={handleKowalVisit}
            className="px-6 py-2 w-fit text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white"
          >
            Zapisz wizytę kowala
          </button>
        </div>
      </div>

      {/* Kartoteka wizyt kowala z filtrami */}
      <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg mt-6">
        <h2 className="text-2xl text-center mb-6 font-semibold">
          Kartoteka wizyt kowala
        </h2>

        {/* Formularz filtrów */}
        <div className="mb-6">
          <div className="flex flex-row gap-4">
            {/* Filtr po kowalu */}
            <input
              type="text"
              className="custom-input"
              placeholder="Filtruj po kowalu"
              value={kowalFilter}
              onChange={(e) => setKowalFilter(e.target.value)}
            />
            {/* Filtr po imieniu konia */}
            <input
              type="text"
              className="custom-input"
              placeholder="Filtruj po imieniu konia"
              value={końFilter}
              onChange={(e) => setKońFilter(e.target.value)}
            />
            
            {/* Filtr po dacie od */}
            od:
            <input
              type="date"
              className="custom-input"
              value={dataOd ? format(dataOd, "yyyy-MM-dd") : ""}
              onChange={(e) => setDataOd(new Date(e.target.value))}
            />
            {/* Filtr po dacie do */}
            do:
            <input
              type="date"
              className="custom-input"
              value={dataDo ? format(dataDo, "yyyy-MM-dd") : ""}
              onChange={(e) => setDataDo(new Date(e.target.value))}
            />
            
          </div>
        </div>

        {/* Wyświetlanie wyników wizyt */}
        <div>
          {filteredKartoteka.map((wizyt) => (
            <div key={wizyt.id} className="border-b-2 mb-4">
              <div
                className="flex justify-between cursor-pointer"
                onClick={() => toggleDetails(wizyt.id)}
              >
                <div>
                  <h2  className="font-bold">{wizyt.kowal}</h2>
                  <p>{"Konie: "}{getImionaKoni(wizyt.konie)}</p>
                  <p>
                    Data: {" "}
                    {format(new Date(wizyt.data_wizyty), "yyyy-MM-dd")} {" "} <br></br>
                    Następny termin: {" "}
                    {format(new Date(wizyt.nastepna_wizyta), "yyyy-MM-dd")}
                  </p>
                </div>
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => toggleDetails(wizyt.id)}
                >
                  {expandedVisitId === wizyt.id ? "Ukryj szczegóły" : "Pokaż szczegóły"}
                </button>
              </div>
              {expandedVisitId === wizyt.id && (
                <div className="p-4">
                  <p>Notatka: {wizyt.notatka}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </ProtectedSection>
    </UserProvider>
  );
}
