import { comidaRepository } from './index.js';
import { validarComida } from './validation.js';
import type { Comida } from './types.js';

export async function crearComida(data: unknown) {
  validarComida(data);
  return comidaRepository.create(data);
}

export async function listarComidas() {
  return comidaRepository.findAll();
}

export async function obtenerComida(id: string) {
  return comidaRepository.findById(id);
}

export async function buscarComida(
  campo: keyof Comida,
  valor: string | number | boolean | null
) {
  return comidaRepository.findByField(campo, valor);
}

export async function actualizarComida(
  id: string,
  data: unknown
) {
  validarComida(data);
  return comidaRepository.update(id, data);
}

export async function eliminarComida(id: string) {
  return comidaRepository.delete(id);
}

