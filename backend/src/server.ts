
import express from 'express';
import cors from 'cors';
import peliculasRoutes from './routes/peliculas.routes.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/peliculas', peliculasRoutes);

// Ruta principal para comprobar que el servidor funciona.
app.get('/', (_req, res) => {
  res.json({
    mensaje: 'API de CAPA funcionando correctamente',
    proyecto: 'CAPA',
    modulos: ['peliculas', 'aves', 'comida', 'anime']
  });
});

// Ruta de prueba de salud.
app.get('/api/health', (_req, res) => {
  res.json({
    estado: 'activo',
    servicio: 'CAPA API'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor CAPA ejecutándose en http://localhost:${PORT}`);
});
