
# Cronograma de Supervisores de Perforación

Aplicación web desarrollada en **React + JavaScript** que genera automáticamente
el cronograma de turnos para **3 supervisores de perforación**, cumpliendo
estrictamente las reglas definidas en la prueba técnica.

---

## Objetivo del proyecto

Planificar los turnos de 3 supervisores de perforación asegurando que:

- Siempre haya **exactamente 2 supervisores perforando**
- **Nunca** haya 3 supervisores perforando
- **Nunca** haya solo 1 supervisor perforando (una vez que S3 entra)
- El **Supervisor 1 (S1)** mantiene siempre su régimen original
- Los **Supervisores 2 y 3 (S2 y S3)** se ajustan dinámicamente para cumplir las reglas

---

## Tecnologías utilizadas

- React (Vite)
- JavaScript (ES6)
- HTML5
- CSS3
- Netlify (deploy)
- GitHub (repositorio)

---

## Definición del ciclo de un supervisor

| Símbolo | Significado |
|-------|-------------|
| S | Subida (1 día) |
| I | Inducción (1 a 5 días) |
| P | Perforación |
| B | Bajada (1 día) |
| D | Descanso |
| - | Fuera del ciclo |

---

## Régimen de trabajo (NxM)

- **N** = Días de trabajo (Subida + Inducción + Perforación)
- **M** = Días libres (Bajada + Descanso)
- Descanso real = `M - 2` días

---

## Lógica del algoritmo

### Supervisor 1 (S1)
- Siempre sigue el régimen completo sin modificaciones.
- Sirve como referencia para el resto del cronograma.

### Supervisor 3 (S3)
- Su día de entrada se calcula con la fórmula:



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
