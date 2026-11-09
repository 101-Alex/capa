import { ModuleRepository } from '../../repositories/ModuleRepository.js';

export interface Pelicula {
  titulo: string;
  anio: number;
  genero: string[];
  director: { nombre: string; pais?: string };
  reparto: Array<{ nombre: string; personaje: string }>;
  disponible: boolean;
  puntuacion: number;
  plataformas: string[];
}

// Los valores deben coincidir con el nombre de la rama y el integrante.
export const peliculasRepository = new ModuleRepository<Pelicula>({
  modulo: 'peliculas',
  autor: 'PAOLA'
});
