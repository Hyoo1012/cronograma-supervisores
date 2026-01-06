import React, { useState } from "react";
import { generarCronograma } from "./logic/scheduler";
import "./index.css";
export default function App() {
  const [workDays, setWorkDays] = useState(14);
  const [restDays, setRestDays] = useState(7);
  const [inductionDays, setInductionDays] = useState(5);
  const [totalDays, setTotalDays] = useState(90);
  const [resultado, setResultado] = useState(null);
  const handleCalcular = () => {
    const res = generarCronograma({
      workDays: parseInt(workDays),
      restDays: parseInt(restDays),
      inductionDays: parseInt(inductionDays),
      totalDays: parseInt(totalDays),
    });
    setResultado(res);
  };
  return (
    <div className="app">
      <header className="header">
        <h1>🛠️ Cronograma de Supervisores</h1>
        <p className="muted">
          Genera automáticamente el cronograma de los 3 supervisores respetando las reglas del régimen.
        </p>
      </header>
      <div className="card">
        <h2>Configuración del régimen</h2>
        <div className="formGrid">
          <label>
            Régimen de trabajo (N)
            <input
              type="number"
              value={workDays}
              onChange={(e) => setWorkDays(e.target.value)}
              min={1}
            />
            <span className="hint">Días totales de trabajo</span>
          </label>
          <label>
            Días de descanso (M)
            <input
              type="number"
              value={restDays}
              onChange={(e) => setRestDays(e.target.value)}
              min={1}
            />
            <span className="hint">Incluye bajada + descanso</span>
          </label>
          <label>
            Días de inducción
            <input
              type="number"
              value={inductionDays}
              onChange={(e) => setInductionDays(e.target.value)}
              min={1}
              max={5}
            />
            <span className="hint">Entre 1 y 5 días</span>
          </label>
          <label>
            Total días de perforación
            <input
              type="number"
              value={totalDays}
              onChange={(e) => setTotalDays(e.target.value)}
              min={30}
            />
            <span className="hint">Ejemplo: 30, 45, 90, 950...</span>
          </label>
          <div className="actions">
            <button onClick={handleCalcular}>Calcular Cronograma</button>
          </div>
        </div>
      </div>
      {resultado && (
        <div className="card">
          <h2>📊 Cronograma generado</h2>

          {resultado.alerts.length > 0 && (
            <div className="alert danger">
              <strong>⚠️ Observaciones:</strong>
              <ul>
                {resultado.alerts.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="tableWrap">
            <table className="grid">
              <thead>
                <tr>
                  <th>Supervisor / Día</th>
                  {Array.from({ length: totalDays }).map((_, d) => (
                    <th key={d}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(resultado.estados).map((sup) => (
                  <tr key={sup}>
                    <td className="rowTitle">{sup}</td>
                    {resultado.estados[sup].map((v, i) => (
                      <td key={i} className={`cell st-${v}`}>{v}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="rowTitle">#P (Perforando)</td>
                  {Array.from({ length: totalDays }).map((_, i) => {
                    const count = Object.values(resultado.estados).filter(
                      (s) => s[i] === "P"
                    ).length;
                    const bad = count !== 2 ? "countBadStrong" : "";
                    return (
                      <td key={i} className={`count ${bad}`}>
                        {count}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="legend">
            <div className="legendItem">
              <div className="legendSw st-S"></div> <span>Subida (S)</span>
            </div>
            <div className="legendItem">
              <div className="legendSw st-I"></div> <span>Inducción (I)</span>
            </div>
            <div className="legendItem">
              <div className="legendSw st-P"></div> <span>Perforación (P)</span>
            </div>
            <div className="legendItem">
              <div className="legendSw st-B"></div> <span>Bajada (B)</span>
            </div>
            <div className="legendItem">
              <div className="legendSw st-D"></div> <span>Descanso (D)</span>
            </div>
            <div className="legendItem">
              <div className="legendSw st--"></div> <span>Fuera del ciclo (-)</span>
            </div>
          </div>
          <div className="footer muted">
            <p>
              Resultado generado según las reglas oficiales del documento técnico.<br />
              Mantenido: S1 fijo, S2 y S3 ajustados dinámicamente.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
