
import { Router } from 'express';
import { peliculasRepository } from '../modules/peliculas/index.js';

const router = Router();

// Consultar todas las películas.
router.get('/', async (_req, res) => {
  try {
    const peliculas = await peliculasRepository.findAll();
    res.json(peliculas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar películas.' });
  }
});

// Consultar una película por ID.
router.get('/:id', async (req, res) => {
  try {
    const pelicula = await peliculasRepository.findById(req.params.id);

    if (!pelicula) {
      res.status(404).json({ error: 'Película no encontrada.' });
      return;
    }

    res.json(pelicula);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar la película.' });
  }
});

// Registrar una película.
router.post('/', async (req, res) => {
  try {
    const pelicula = await peliculasRepository.create(req.body);
    res.status(201).json(pelicula);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar la película.' });
  }
});

// Actualizar una película.
router.put('/:id', async (req, res) => {
  try {
    const pelicula = await peliculasRepository.update(
      req.params.id,
      req.body
    );

    if (!pelicula) {
      res.status(404).json({ error: 'Película no encontrada.' });
      return;
    }

    res.json(pelicula);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la película.' });
  }
});

// Eliminar una película.
router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await peliculasRepository.delete(req.params.id);

    if (!eliminado) {
      res.status(404).json({ error: 'Película no encontrada.' });
      return;
    }

    res.json({ mensaje: 'Película eliminada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la película.' });
  }
});

export default router;
