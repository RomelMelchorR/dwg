# dwg

Sistema web para cargar planos en PDF, crear zonas dentro de ellos y vincularlas a una base de datos MySQL.

## Backend
- Express + MySQL.
- `POST /api/upload`: sube un archivo PDF.
- `POST /api/zones`: guarda las zonas para un plano.
- `GET /api/zones/:planId`: obtiene las zonas guardadas.
- Ejecutar con:
  ```bash
  cd backend
  npm install
  npm run dev
  ```

## Frontend
- React con Vite.
- Permite subir un PDF, dibujar zonas rectangulares y guardarlas.
- Ejecutar con:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
