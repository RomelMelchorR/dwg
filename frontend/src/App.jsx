import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import './App.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function App() {
  const [file, setFile] = useState(null);
  const [planId, setPlanId] = useState(null);
  const [zones, setZones] = useState([]);
  const [drawing, setDrawing] = useState(null);
  const [pageSize, setPageSize] = useState({ width: 600, height: 0 });

  const handleUpload = async (e) => {
    const pdf = e.target.files[0];
    if (!pdf) return;
    const form = new FormData();
    form.append('plan', pdf);
    const res = await fetch('http://localhost:3001/api/upload', { method: 'POST', body: form });
    const data = await res.json();
    setPlanId(data.file);
    setFile(URL.createObjectURL(pdf));
  };

  const startDraw = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDrawing({ x: e.clientX - rect.left, y: e.clientY - rect.top, w: 0, h: 0 });
  };

  const draw = (e) => {
    if (!drawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setDrawing((d) => ({ ...d, w: e.clientX - rect.left - d.x, h: e.clientY - rect.top - d.y }));
  };

  const endDraw = () => {
    if (!drawing) return;
    setZones((z) => [...z, drawing]);
    setDrawing(null);
  };

  const saveZones = async () => {
    await fetch('http://localhost:3001/api/zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, zones })
    });
  };

  return (
    <div className="container">
      <input type="file" accept="application/pdf" onChange={handleUpload} />
      {file && (
        <div className="viewer" style={{ width: pageSize.width }}>
          <Document file={file} onLoadSuccess={({ numPages }) => {}}>
            <Page
              pageNumber={1}
              width={pageSize.width}
              onRenderSuccess={(page) => setPageSize({ width: page.width, height: page.height })}
            />
          </Document>
          <div
            className="overlay"
            style={{ width: pageSize.width, height: pageSize.height }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
          >
            {zones.map((z, i) => (
              <div key={i} className="zone" style={{ left: z.x, top: z.y, width: z.w, height: z.h }} />
            ))}
            {drawing && (
              <div className="zone temp" style={{ left: drawing.x, top: drawing.y, width: drawing.w, height: drawing.h }} />
            )}
          </div>
        </div>
      )}
      {zones.length > 0 && <button onClick={saveZones}>Guardar zonas</button>}
    </div>
  );
}

export default App;
