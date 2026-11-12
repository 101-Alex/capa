
import type {
  Comida,
  CategoriaComida,
  Dificultad
} from './types.js';

const categorias: CategoriaComida[] = [
  'desayuno',
  'comida',
  'cena',
  'postre'
];

const dificultades: Dificultad[] = [
  'facil',
  'media',
  'dificil'
];

export function validarComida(data: unknown): asserts data is Comida {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error('Los datos deben ser un objeto.');
  }

  const comida = data as Record<string, unknown>;

  if (typeof comida.nombre !== 'string' || !comida.nombre.trim()) {
    throw new Error('El nombre es obligatorio.');
  }

  if (!categorias.includes(comida.categoria as CategoriaComida)) {
    throw new Error('La categoría no es válida.');
  }

  if (
    !Array.isArray(comida.ingredientes) ||
    comida.ingredientes.length === 0 ||
    !comida.ingredientes.every(
      item => typeof item === 'string' && item.trim().length > 0
    )
  ) {
    throw new Error('Los ingredientes no son válidos.');
  }

  if (
    typeof comida.descripcion !== 'string' ||
    !comida.descripcion.trim()
  ) {
    throw new Error('La descripción es obligatoria.');
  }

  if (
    typeof comida.tiempoPreparacion !== 'number' ||
    !Number.isInteger(comida.tiempoPreparacion) ||
    comida.tiempoPreparacion <= 0
  ) {
    throw new Error('El tiempo debe ser un entero positivo.');
  }

  if (!dificultades.includes(comida.dificultad as Dificultad)) {
    throw new Error('La dificultad no es válida.');
  }

  if (
    typeof comida.precio !== 'number' ||
    !Number.isFinite(comida.precio) ||
    comida.precio < 0
  ) {
    throw new Error('El precio no es válido.');
  }

  if (
    typeof comida.paisOrigen !== 'string' ||
    !comida.paisOrigen.trim()
  ) {
    throw new Error('El país de origen es obligatorio.');
  }
}
