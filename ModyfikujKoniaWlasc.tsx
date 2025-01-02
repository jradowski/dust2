"use client";
import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';

const ModyfikujKonia: React.FC = () => {
  const [horses, setHorses] = useState<{ id: number; imie: string; wlasc_id: number | null; image_url: string | null; v: string | null; m: string | null; mv: string | null; kowal: string | null; ilosc_posilkow: string | null; wielkosc_posilku: string | null; posilek: string | null; boks_id: number | null; padok_id: number | null }[]>([]);
  const [owners, setOwners] = useState<{ id: number; first_name: string; last_name: string }[]>([]);
  const [selectedHorseId, setSelectedHorseId] = useState<number | null>(null);
  const [selectedHorseData, setSelectedHorseData] = useState<any>(null);
  const [message, setMessage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch userId of the logged-in user
  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };

    fetchUserId();
  }, []);

  // Fetch horses and owners data
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return; // If no user is logged in, do not fetch data

      try {
        const { data: horseData, error: horseError } = await supabase.from('horse').select('*').eq('wlasc_id', userId); // Fetch horses owned by the logged-in user
        if (horseError) throw horseError;
        setHorses(horseData);

        const { data: ownerData, error: ownerError } = await supabase
          .from('employees')
          .select('id, first_name, last_name')
          .in('position', ['wlasciciel_koni', 'wlasciciel_stajni']); // Fetch owners
        if (ownerError) throw ownerError;
        setOwners(ownerData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Wystąpił błąd przy pobieraniu danych.');
      }
    };
    fetchData();
  }, [userId]);

  // Handle horse selection change
  const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const horseId = Number(event.target.value);
    setSelectedHorseId(horseId);

    try {
      const { data: horseData, error } = await supabase.from('horse').select('*').eq('id', horseId).single();
      if (error) throw error;
      setSelectedHorseData(horseData);
    } catch (error) {
      console.error('Error fetching horse data:', error);
      setMessage('Wystąpił błąd przy pobieraniu danych konia.');
    }
  };

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedHorseId) {
      setMessage("Proszę wybrać zdjęcie i konia.");
      return;
    }

    setImageFile(file);

    try {
      const filePath = `zdjecia/${selectedHorseId}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("zdjecia")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("zdjecia")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Nie udało się uzyskać publicznego URL dla przesłanego zdjęcia.");
      }

      const imageUrl = publicUrlData.publicUrl;

      // Update horse's image_url in the database
      const { error: updateError } = await supabase
        .from("horse")
        .update({ image_url: imageUrl })
        .eq("id", selectedHorseId);

      if (updateError) {
        throw updateError;
      }

      setMessage('Zdjęcie zostało przesłane i zaktualizowane.');
      setSelectedHorseData((prev: any) => ({ ...prev, image_url: imageUrl }));
    } catch (error) {
      console.error('Błąd przy przesyłaniu zdjęcia:', error);
      setMessage('Wystąpił błąd przy przesyłaniu zdjęcia.');
    }
  };

  // Handle form submission
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedHorseData) {
      setMessage('Proszę wybrać konia do modyfikacji.');
      return;
    }

    const { id, ...updatedFields } = selectedHorseData;

    try {
      const { data, error } = await supabase.from('horse').update(updatedFields).eq('id', id);
      if (error) throw error;
      setMessage('Dane konia zostały zaktualizowane.');
    } catch (error) {
      console.error('Error updating horse:', error);
      setMessage('Wystąpił błąd przy aktualizacji danych konia.');
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="horse">Wybierz konia do modyfikacji:</label>
        <select
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

      {selectedHorseData && (
        <form onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="imie">Imię konia:</label>
            <input
              type="text"
              id="imie"
              name="imie"
              value={selectedHorseData.imie}
              onChange={(e) => setSelectedHorseData({ ...selectedHorseData, imie: e.target.value })}
              required
            />
          </div>

          {/* Wybór właściciela */}
          <div>
            <label htmlFor="owner">Właściciel konia:</label>
            <select
              className="custom-select"
              id="owner"
              name="owner"
              value={selectedHorseData.wlasc_id || ''}
              onChange={(e) => setSelectedHorseData({ ...selectedHorseData, wlasc_id: Number(e.target.value) })}
              required
            >
              <option value="">Wybierz właściciela</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.first_name} {owner.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="nr_boksu">Nr boksu:</label>
            <input
              type="text"
              id="nr_boksu"
              name="nr_boksu"
              value={selectedHorseData.nr_boksu}
              onChange={(e) => setSelectedHorseData({ ...selectedHorseData, nr_boksu: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="nr_boksu">Nr padoku:</label>
            <input
              type="text"
              id="nr_padoku"
              name="nr_padoku"
              value={selectedHorseData.nr_padoku}
              onChange={(e) => setSelectedHorseData({ ...selectedHorseData, nr_padoku: e.target.value })}
              required
            />
          </div>

          {/* Rodowód */}
          <div>
            <div className="text-2xl my-2">Rodowód:</div>
            <label htmlFor="v">Imię ojca:</label>
            <input
              className="custom-input"
              type="text"
              id="v"
              name="v"
              value={selectedHorseData.v}
              onChange={(e) => setSelectedHorseData({ ...selectedHorseData, v: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="m">Imię matki:</label>
            <input
              className="custom-input"
              type="text"
              id="m"
              name="m"
              value={selectedHorseData.m}
              onChange={(e) => setSelectedHorseData({ ...selectedHorseData, m: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="mv">Imię matki ojca:</label>
            <input
              className="custom-input"
              type="text"
              id="mv"
              name="mv"
              value={selectedHorseData.mv}
              onChange={(e) => setSelectedHorseData({ ...selectedHorseData, mv: e.target.value })}
            />
          </div>

          {/* Kowal */}
          <div>
            <label htmlFor="kowal">Ostatnia wizyta kowala:</label>
            <input
              className="custom-input"
              type="date"
              id="kowal"
              name="kowal"
              value={selectedHorseData.kowal}
              onChange={(e) => setSelectedHorseData({ ...selectedHorseData, kowal: e.target.value })}
            />
            <label htmlFor="kowal">Następna wizyta kowala:</label>
            <input
              className="custom-input"
              type="date"
              id="nastepna_wizyta"
              name="kowal"
              value={selectedHorseData.nastepna_wizyta}
              onChange={(e) => setSelectedHorseData({ ...selectedHorseData, nastepna_wizyta: e.target.value })}
            />
            <label htmlFor="kowal">Ostatnie szczepienie:</label>
            <input
              className="custom-input"
              type="date"
              id="szczepienie"
              name="szczepienie"
              value={selectedHorseData.szczepienie}
              onChange={(e) => setSelectedHorseData({ ...selectedHorseData, szczepienie: e.target.value })}
            />
          </div>

          {/* Programowanie diety */}
          <div className="text-2xl my-2">Programowanie diety</div>
          <div>
            <label htmlFor="ilosc_posilkow">Ilość posiłków:</label>
            <select
              className="custom-select"
              id="ilosc_posilkow"
              name="ilosc_posilkow"
              value={selectedHorseData.ilosc_posilkow}
              onChange={(e) => setSelectedHorseData({ ...selectedHorseData, ilosc_posilkow: e.target.value })}
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
              onChange={(e) => setSelectedHorseData({ ...selectedHorseData, wielkosc_posilku: e.target.value })}
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
              onChange={(e) => setSelectedHorseData({ ...selectedHorseData, posilek: e.target.value })}
            />
          </div>

          {/* Upload Image Section */}
          <div>
            <label htmlFor="imageUpload">Dodaj zdjęcie:</label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          {selectedHorseData.image_url && (
            <div>
              <p>Aktualne zdjęcie:</p>
              <img src={selectedHorseData.image_url} alt="Zdjęcie konia" width="200" />
            </div>
          )}

          <button type="submit">Zapisz zmiany</button>
        </form>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default ModyfikujKonia;
