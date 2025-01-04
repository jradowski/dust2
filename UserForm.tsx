"use client";
import React, { useEffect, useState } from "react";
import supabase from "./supabaseClient";

const DodajKonia: React.FC = () => {
  const [owners, setOwners] = useState<{ id: string; first_name: string; last_name: string }[]>([]);
  const [formData, setFormData] = useState({
    imie: "",
    wlasc_id: null as string | null,
    image_url: null as string | null,
    nr_boksu: null as number | null,
    nr_padoku: null as number | null,
    plec: "",
    data_urodzenia: null as string | null,
    v: "",
    m: "",
    mv: "",
    kowal: null as string | null,
    nastepna_wizyta: null as string | null,
    szczepienie: null as string | null,
    ilosc_posilkow: null as number | null,
    wielkosc_posilku: null as number | null,
    posilek: "",
  });
  const [message, setMessage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const { data, error } = await supabase
          .from("employees")
          .select("id, first_name, last_name")
          .in("position", ["wlasciciel_koni", "wlasciciel_stajni"]);
        if (error) throw error;
        setOwners(data || []);
      } catch (error) {
        console.error("Error fetching owners:", error);
        setMessage("Wystąpił błąd przy pobieraniu właścicieli.");
      }
    };
    fetchOwners();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : parseInt(value, 10),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = null;

      if (imageFile) {
        const filePath = `zdjecia/${formData.imie}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("zdjecia")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from("zdjecia").getPublicUrl(filePath);
        if (!publicUrlData?.publicUrl) {
          throw new Error("Nie udało się uzyskać publicznego URL dla przesłanego zdjęcia.");
        }
        imageUrl = publicUrlData.publicUrl;
      }

      const newHorseData = {
        ...formData,
        image_url: imageUrl,
      };

      const { error } = await supabase.from("horse").insert(newHorseData);
      if (error) throw error;

      setMessage("Koń został dodany.");
      setFormData({
        imie: "",
        wlasc_id: null,
        image_url: null,
        nr_boksu: null,
        nr_padoku: null,
        plec: "",
        data_urodzenia: null,
        v: "",
        m: "",
        mv: "",
        kowal: null,
        nastepna_wizyta: null,
        szczepienie: null,
        ilosc_posilkow: null,
        wielkosc_posilku: null,
        posilek: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error("Error adding horse:", error);
      setMessage("Wystąpił błąd przy dodawaniu konia.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="imie">Imię konia:</label>
          <input
              className="custom-input"
              type="text"
              id="imie"
              name="imie"
              value={formData.imie || ""}
              onChange={handleInputChange}
              required
          />
        </div>

        <div>
          <label htmlFor="wlasc_id">Właściciel konia:</label>
          <select
              className="custom-select"
              id="wlasc_id"
              name="wlasc_id"
              value={formData.wlasc_id || ""}
              onChange={handleInputChange}
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
          <label htmlFor="plec">Płeć:</label>
          <select
              className="custom-select"
              id="plec"
              name="plec"
              value={formData.plec || ""}
              onChange={handleInputChange}
          >
            <option value="">Wybierz płeć</option>
            <option value="ogier">Ogier</option>
            <option value="wałach">Wałach</option>
            <option value="klacz">Klacz</option>
          </select>
        </div>

        <div>
          <label htmlFor="data_urodzenia">Data urodzenia:</label>
          <input
              className="custom-input"
              type="date"
              id="data_urodzenia"
              name="data_urodzenia"
              value={formData.data_urodzenia || ""}
              onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="nr_boksu">Nr boksu:</label>
          <input
              className="custom-input"
              type="number"
              id="nr_boksu"
              name="nr_boksu"
              value={formData.nr_boksu || ""}
              onChange={handleNumberChange}
          />
        </div>

        <div>
          <label htmlFor="nr_padoku">Nr padoku:</label>
          <input
              className="custom-input"
              type="number"
              id="nr_padoku"
              name="nr_padoku"
              value={formData.nr_padoku || ""}
              onChange={handleNumberChange}
          />
        </div>


        <div>
          <label htmlFor="v">Imię ojca:</label>
          <input
              className="custom-input"
              type="text"
              id="v"
              name="v"
              value={formData.v || ""}
              onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="m">Imię matki:</label>
          <input
              className="custom-input"
              type="text"
              id="m"
              name="m"
              value={formData.m || ""}
              onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="mv">Imię ojca matki:</label>
          <input
              className="custom-input"
              type="text"
              id="mv"
              name="mv"
              value={formData.mv || ""}
              onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="kowal">Ostatnia wizyta kowala:</label>
          <input
              className="custom-input"
              type="date"
              id="kowal"
              name="kowal"
              value={formData.kowal || ""}
              onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="nastepna_wizyta">Następna wizyta:</label>
          <input
              className="custom-input"
              type="date"
              id="nastepna_wizyta"
              name="nastepna_wizyta"
              value={formData.nastepna_wizyta || ""}
              onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="szczepienie">Ostatnie szczepienie:</label>
          <input
              className="custom-input"
              type="date"
              id="szczepienie"
              name="szczepienie"
              value={formData.szczepienie || ""}
              onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="ilosc_posilkow">Ilość posiłków:</label>
          <input
              className="custom-input"
              type="number"
              id="ilosc_posilkow"
              name="ilosc_posilkow"
              value={formData.ilosc_posilkow || ""}
              onChange={handleNumberChange}
          />
        </div>

        <div>
          <label htmlFor="wielkosc_posilku">Wielkość posiłku:</label>
          <input
              className="custom-input"
              type="number"
              id="wielkosc_posilku"
              name="wielkosc_posilku"
              value={formData.wielkosc_posilku || ""}
              onChange={handleNumberChange}
          />
        </div>

        <div>
          <label htmlFor="posilek">Skład posiłku:</label>
          <input
              className="custom-input"
              type="text"
              id="posilek"
              name="posilek"
              value={formData.posilek || ""}
              onChange={handleInputChange}
          />
        </div>

        <div className="pb-5">
          <label htmlFor="imageUpload">Dodaj zdjęcie:</label>
          <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange}/>
        </div>

        <button type="submit"
                className="px-6 py-2 text-xl w-fit drop-shadow-lg text-black bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 dark:text-white dark:drop-shadow-lg">
          Zapisz zmiany
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default DodajKonia;
