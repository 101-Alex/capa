
import { ModuleRepository } from '../../repositories/ModuleRepository.js';
import type { Comida } from './types.js';

export const comidaRepository = new ModuleRepository<Comida>({
  modulo: 'comida',
  autor: 'ALY'
});
