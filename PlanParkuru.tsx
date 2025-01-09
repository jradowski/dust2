import React, { useState, useEffect } from 'react';
import * as fabric from 'fabric';
import supabase from '@/supabaseClient.js';

const PlanParkuru: React.FC = () => {
  const [width, setWidth] = useState<number>(20);
  const [height, setHeight] = useState<number>(20);
  const [scale] = useState<number>(17); // Skala: 1 metr = 20 pikseli
  const [canvas, setCanvas] = useState<any>(null);
  const [obstacleCounter, setObstacleCounter] = useState<number>(1);
  const [images, setImages] = useState<any[]>([]);
  const [editingLabel, setEditingLabel] = useState<fabric.Object | null>(null); // Zmieniamy typ na `fabric.Object | null`

  useEffect(() => {
    const initCanvas = new fabric.Canvas('planCanvas');
    setCanvas(initCanvas);
    generatePlan(initCanvas);

    // Załaduj zapisane obrazy
    fetchImagesFromSupabase().then(setImages);

    return () => {
      initCanvas.dispose();
    };
  }, []);

  const generatePlan = (canvas: any) => {
    canvas.setWidth(width * scale);
    canvas.setHeight(height * scale);
    canvas.clear();

    for (let i = 0; i <= height; i += 10) {
      const text = new fabric.Text(`${i}m`, {
        left: 2,
        top: i * scale - 10,
        fontSize: 10,
        fill: '#000',
        selectable: false,
      });
      canvas.add(text);
    }

    for (let i = 0; i <= width; i += 10) {
      const text = new fabric.Text(`${i}m`, {
        left: i * scale - 10,
        top: canvas.getHeight() - 20,
        fontSize: 10,
        fill: '#000',
        selectable: false,
      });
      canvas.add(text);
    }

    // Dodajemy obramowanie wokół placu
    const border = new fabric.Rect({
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      width: width * scale,
      height: height * scale,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
      selectable: false,
    });
    canvas.add(border);

    canvas.renderAll();
  };

  const addObstacle = (type: string) => {
    const obstacleWidth = 3.5 * scale;
    let obstacle: fabric.Object | undefined;
    let obstacleLabel: fabric.Object | undefined;

    if (type === 'stacjonata') {
      obstacle = new fabric.Rect({
        left: 100,
        top: 100,
        width: obstacleWidth,
        height: 10,
        fill: 'black',
      });
    } else if (type === 'oxer') {
      const firstBar = new fabric.Rect({
        left: 100,
        top: 100,
        width: obstacleWidth,
        height: 10,
        fill: 'black',
      });

      const secondBar = new fabric.Rect({
        left: 100,
        top: 100 + scale,
        width: obstacleWidth,
        height: 10,
        fill: 'black',
      });

      obstacle = new fabric.Group([firstBar, secondBar], {
        left: 100,
        top: 100,
      });
    } else if (type === 'start' || type === 'finish') {
      obstacle = new fabric.Text(type === 'start' ? 'Start' : 'Meta', {
        left: 100,
        top: 100,
        fontSize: 16,
        fill: type === 'start' ? 'green' : 'red',
      });
    }

    if (obstacle) {
      // Only create and add the label for obstacles other than "start" and "finish"
      if (type !== 'start' && type !== 'finish') {
        obstacleLabel = new fabric.Text(`P${obstacleCounter}`, {
          left: 110,
          top: 80,
          fontSize: 14,
          fill: '#000',
          selectable: true,
        });

        // Allow editing the label on click
        obstacleLabel.on('mousedown', () => {
          setEditingLabel(obstacleLabel as fabric.Object); // Enable editing
        });
      }

      // Filter out undefined obstacleLabel from the array before adding to the group
      const groupElements = [obstacle, obstacleLabel].filter((obj) => obj !== undefined) as fabric.Object[];

      const group = new fabric.Group(groupElements, {
        left: 100,
        top: 100,
        selectable: true,
      });

      canvas.add(group);

      if (obstacleLabel) {
        setObstacleCounter((prev) => prev + 1);
      }

      canvas.renderAll();
    }
  };

  const addTextField = () => {
    const textField = new fabric.Textbox('Wpisz tekst...', {
      left: 100,
      top: 100,
      width: 150,
      fontSize: 14,
      fill: '#000',
      editable: true,
      selectable: true,
    });

    textField.on('mousedown', () => {
      setEditingLabel(textField); // Enable editing
    });

    canvas.add(textField);
    canvas.renderAll();
  };

  const enableDrawPath = () => {
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = 'black';
    canvas.freeDrawingBrush.width = 2;
    canvas.freeDrawingBrush.strokeDashArray = [5, 5];
  };

  const endDrawPath = () => {
    canvas.isDrawingMode = false;
  };

  const saveAsJPG = async () => {
    if (!canvas) return;

    // Tworzymy biały prostokąt jako tło
    const background = new fabric.Rect({
      left: 0,
      top: 0,
      width: canvas.getWidth(),
      height: canvas.getHeight(),
      fill: 'white',
      selectable: false,
      evented: false,
    });

    canvas.renderAll();

    // Generujemy obraz w formacie JPG
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1.0,
    });

    // Przesyłamy obraz do Supabase
    const imagePath = await uploadImageToSupabase(dataURL);
    if (imagePath) {
      setImages(await fetchImagesFromSupabase());
    }

    // Usuwamy tło po zapisie
    canvas.remove(background);
    canvas.renderAll();
  };

  const uploadImageToSupabase = async (dataURL: string) => {
    const blob = await (await fetch(dataURL)).blob();
    const file = new File([blob], `plan_parkuru_${Date.now()}.png`, { type: 'image/png' });

    const { data, error } = await supabase.storage.from('plans').upload(file.name, file);

    if (error) {
      console.error('Błąd przesyłania pliku:', error);
      return null;
    }

    return data.path;
  };

  const fetchImagesFromSupabase = async () => {
    const { data: files, error } = await supabase.storage.from('plans').list();

    if (error) {
      console.error('Błąd pobierania plików:', error);
      return [];
    }

    const images = files.map((file) => {
      const { data } = supabase.storage.from('plans').getPublicUrl(file.name);
      return {
        name: file.name,
        createdAt: file.created_at,
        url: data.publicUrl,
        path: file.name,  // Dodajemy ścieżkę pliku
      };
    });

    return images;
  };

  const deleteImageFromSupabase = async (imagePath: string) => {
    const { error } = await supabase.storage.from('plans').remove([imagePath]);
    if (error) {
      console.error('Błąd usuwania pliku:', error);
    } else {
      setImages(await fetchImagesFromSupabase());
    }
  };

  const downloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'download.png';
    link.click();
  };

  const handleLabelEdit = (newText: string) => {
    if (editingLabel && 'set' in editingLabel) {
      editingLabel.set({ text: newText });
      canvas.renderAll();
      setEditingLabel(null);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Plan Parkuru</h1>
      <div>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          placeholder="Szerokość placu (m)"
        />
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          placeholder="Długość placu (m)"
        />
        <button onClick={() => generatePlan(canvas)}>Generuj plan</button>
        <button onClick={saveAsJPG}>Zapisz plan w JPG</button>
      </div>

      <div>
  <img
    src="stacjonata.png"
    alt="Stacjonata"
    onClick={() => addObstacle('stacjonata')}
    style={{ width: '50px', height: '50px', cursor: 'pointer', margin: '1px' }}
  />
  <img
    src="oxer.png"
    alt="Oxer"
    onClick={() => addObstacle('oxer')}
    style={{ width: '50px', height: '50px', cursor: 'pointer', margin: '1px' }}
  />
  <img
    src="start.png"
    alt="Start"
    onClick={() => addObstacle('start')}
    style={{ width: '50px', height: '50px', cursor: 'pointer', margin: '1px' }}
  />
  <img
    src="meta.png"
    onClick={() => addObstacle('finish')}
    style={{ width: '50px', height: '50px', cursor: 'pointer', margin: '1px' }}
  />
  <img
    src="/path/to/draw-path-icon.png"
    alt="Rysuj trasę"
    onClick={enableDrawPath}
    style={{ width: '50px', height: '50px', cursor: 'pointer', margin: '1px' }}
  />
  <img
    src="/path/to/end-draw-path-icon.png"
    alt="Zakończ rysowanie"
    onClick={endDrawPath}
    style={{ width: '50px', height: '50px', cursor: 'pointer', margin: '1px' }}
  />
  <img
    src="/path/to/add-text-field-icon.png"
    alt="Dodaj pole tekstowe"
    onClick={addTextField}
    style={{ width: '50px', height: '50px', cursor: 'pointer', margin: '1px' }}
  />
</div>

      <div>
        <canvas id="planCanvas" width="800" height="600"></canvas>
      </div>

      <h2>Zapisane Plany</h2>
      <ul>
        {images.map((img) => (
          <li key={img.name}>
            <p>{img.name} - {new Date(img.createdAt).toLocaleString()}</p>
            <img
              src={img.url}
              alt={img.name}
              style={{ maxWidth: '200px', cursor: 'pointer' }}
              onClick={() => downloadImage(img.url)}
            />
            <button onClick={() => deleteImageFromSupabase(img.path)}>Usuń</button>
          </li>
        ))}
      </ul>

      {/* Modal do edycji numeru przeszkody */}
      {editingLabel && (
        <div>
          <input
            type="text"
            defaultValue={(editingLabel as fabric.Textbox).text || ""}
            onBlur={(e) => handleLabelEdit(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default PlanParkuru;
