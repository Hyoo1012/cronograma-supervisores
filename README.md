# Cronograma de Supervisores de Perforación

Aplicación web desarrollada en React y JavaScript que genera automáticamente
el cronograma de turnos para tres supervisores de perforación, cumpliendo
estrictamente las reglas definidas en la prueba técnica.

---

## Objetivo del proyecto

Planificar los turnos de tres supervisores de perforación asegurando que:

- Siempre haya exactamente dos supervisores perforando.
- Nunca haya tres supervisores perforando al mismo tiempo.
- Nunca haya solo un supervisor perforando, una vez que el Supervisor 3 (S3 entra).
- El Supervisor 1 (S1) mantiene siempre su régimen completo sin modificaciones.
- Los Supervisores 2 y 3 (S2 y S3) se ajustan dinámicamente para cumplir las reglas.

---

## Tecnologías utilizadas

- React (Vite)
- JavaScript (ES6)
- HTML5
- CSS3
- GitHub
- Netlify

---

## Definición del ciclo de un supervisor

| Símbolo | Descripción |
|--------|-------------|
| S | Subida (1 día) |
| I | Inducción (1 a 5 días) |
| P | Perforación |
| B | Bajada (1 día) |
| D | Descanso |
| - | Fuera del ciclo |

---

## Régimen de trabajo (NxM)

- N: Días de trabajo (Subida + Inducción + Perforación).
- M: Días libres (Bajada + Descanso).
- Días de descanso reales: `M - 2`.

---

## Lógica del algoritmo

### Supervisor 1 (S1)
- Cumple siempre el régimen completo sin modificaciones.
- Se utiliza como referencia base para el cronograma.

### Supervisor 3 (S3)
- Su día de entrada se calcula a partir del día de bajada de S1.
- Inicia la perforación luego de completar su subida e inducción.

### Supervisor 2 (S2)
- Ajusta dinámicamente su ciclo para:
  - Evitar días con solo un supervisor perforando.
  - Evitar solapamientos de tres supervisores perforando.
- Puede volver antes o extender su período de perforación si es necesario.

---

## Validaciones implementadas

- Alerta cuando existen días con tres supervisores perforando.
- Alerta cuando existen días con solo un supervisor perforando, una vez que S3 está activo.
- Detección de patrones inválidos:
  - S-S
  - S-B
  - B-S
  - B-B

---

## Interfaz de usuario

- Inputs dinámicos para:
  - Régimen de trabajo (N).
  - Días de descanso (M).
  - Días de inducción (1 a 5).
  - Total de días a simular.
- Tabla de visualización con:
  - Cronograma por supervisor.
  - Estados diferenciados por color.
  - Fila adicional con la cantidad de supervisores perforando por día.
- Indicadores visuales en rojo cuando no se cumple la regla de dos supervisores perforando.

---

## Casos de prueba obligatorios

El sistema fue diseñado para manejar correctamente los siguientes escenarios:

1. Régimen 14x7 con 5 días de inducción y 90 días de perforación.
2. Régimen 21x7 con 3 días de inducción y 90 días de perforación.
3. Régimen 10x5 con 2 días de inducción y 90 días de perforación.
4. Régimen 14x6 con 4 días de inducción y 950 días de perforación.

---

## Instalación y ejecución local

```bash
npm install
npm run dev
