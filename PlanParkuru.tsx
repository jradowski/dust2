import React, { useState, useEffect } from 'react';
import { Canvas, Rect, Text, Group, Textbox, PencilBrush } from 'fabric';

const PlanParkuru: React.FC = () => {
  const [width, setWidth] = useState<number>(20);
  const [height, setHeight] = useState<number>(20);
  const [scale] = useState<number>(20); // Skala: 1 metr = 20 pikseli
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [canvas, setCanvas] = useState<any>(null);
  const [obstacleCounter, setObstacleCounter] = useState<number>(1); // Numer przeszkody

  useEffect(() => {
    const initCanvas = new Canvas('planCanvas');
    setCanvas(initCanvas);
    generatePlan(initCanvas);

    return () => {
      initCanvas.dispose(); // Sprzątanie, gdy komponent jest usuwany
    };
  }, []);

  const generatePlan = (canvas: any) => {
    // Ustawienie rozmiarów canvasu
    canvas.setWidth(width * scale);
    canvas.setHeight(height * scale);
    canvas.clear();

    // Dodawanie oznaczeń co 10 metrów
    for (let i = 0; i <= height; i += 10) {
      const text = new Text(`${i}m`, {
        left: -40,
        top: i * scale - 10,
        fontSize: 12,
        fill: '#000',
        selectable: false,
      });
      canvas.add(text);
    }

    for (let i = 0; i <= width; i += 10) {
      const text = new Text(`${i}m`, {
        left: i * scale - 10,
        top: canvas.height - 20,
        fontSize: 12,
        fill: '#000',
        selectable: false,
      });
      canvas.add(text);
    }

    canvas.renderAll();
  };

  const addObstacle = (type: string) => {
    const obstacleWidth = 3.5 * scale;
    let obstacle: Rect | Group | Text | undefined;

    if (type === 'stacjonata') {
      obstacle = new Rect({
        left: 100,
        top: 100,
        width: obstacleWidth,
        height: 10,
        fill: 'blue',
      });
    } else if (type === 'oxer') {
      const firstBar = new Rect({
        left: 100,
        top: 100,
        width: obstacleWidth,
        height: 10,
        fill: 'green',
      });

      const secondBar = new Rect({
        left: 100,
        top: 100 + scale,
        width: obstacleWidth,
        height: 10,
        fill: 'green',
      });

      obstacle = new Group([firstBar, secondBar], {
        left: 100,
        top: 100,
      });
    } else if (type === 'start' || type === 'finish') {
      obstacle = new Text(type === 'start' ? 'Start' : 'Meta', {
        left: 100,
        top: 100,
        fontSize: 16,
        fill: type === 'start' ? 'green' : 'red',
      });
    }

    // Sprawdzenie, czy 'obstacle' jest prawidłowo zainicjowane przed dalszym użyciem
    if (obstacle) {
      if (type === 'stacjonata' || type === 'oxer') {
        const obstacleLabel = new Text(`P${obstacleCounter}`, {
          left: obstacle.left + obstacleWidth / 2 - 10,
          top: obstacle.top - 20,
          fontSize: 14,
          fill: '#000',
          selectable: false,
        });

        const group = new Group([obstacle, obstacleLabel], {
          left: obstacle.left,
          top: obstacle.top,
          selectable: true,
        });

        canvas.add(group);

        // Zmiana numeracji przeszkody
        group.on('mousedblclick', () => {
          const newNumber = prompt('Podaj nowy numer przeszkody:', obstacleLabel.text);
          if (newNumber) {
            obstacleLabel.text = newNumber;
            setObstacleCounter((prev) => prev + 1);
            canvas.renderAll();
          }
        });
      } else {
        canvas.add(obstacle);
      }
      canvas.renderAll();
    } else {
      console.error('Nie udało się dodać przeszkody.'); // W przypadku, gdy obstacle nie jest zainicjowane
    }
  };

  const enableDrawPath = () => {
    setIsDrawing(true);
    canvas.isDrawingMode = true;

    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = 'black';
    canvas.freeDrawingBrush.width = 2;
    canvas.freeDrawingBrush.strokeDashArray = [5, 5];
  };

  const endDrawPath = () => {
    setIsDrawing(false);
    canvas.isDrawingMode = false;
  };

  const addTextField = () => {
    const text = new Textbox('Tu pisz', {
      left: 100,
      top: 100,
      fontSize: 18,
      fill: '#000',
      width: 50,
      editable: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const saveAsJPG = () => {
    // Tymczasowy biały prostokąt jako tło
    const background = new Rect({
      left: 0,
      top: 0,
      width: canvas.width,
      height: canvas.height,
      fill: 'white',
      selectable: false,
      evented: false,
    });

    // Dodaj tło do canvasu

    //  canvas.add(background);
    // canvas.sendToBack(background);

    // Generuj obraz
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1.0,
    });

    // Usuń tło po zapisie

     // canvas.remove(background);

    // Pobierz obraz
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'plan_parkuru.png';
    link.click();
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
          min="1"
        />
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          placeholder="Długość placu (m)"
          min="1"
        />
        <button onClick={() => generatePlan(canvas)}>Generuj plan</button>
        <button onClick={saveAsJPG}>Zapisz plan w JPG</button>
      </div>

      <div>
        <button onClick={() => addObstacle('stacjonata')}>Stacjonata</button>
        <button onClick={() => addObstacle('oxer')}>Oxer</button>
        <button onClick={() => addObstacle('start')}>Start</button>
        <button onClick={() => addObstacle('finish')}>Meta</button>
        <button onClick={enableDrawPath}>Rysuj trasę</button>
        <button onClick={endDrawPath}>Zakończ rysowanie</button>
        <button onClick={addTextField}>Dodaj tekst</button>
      </div>

      <div>
        <canvas id="planCanvas" width="800" height="600"></canvas>
      </div>
    </div>
  );
};

export default PlanParkuru;
