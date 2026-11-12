
export type CategoriaComida =
  | 'desayuno'
  | 'comida'
  | 'cena'
  | 'postre';

export type Dificultad =
  | 'facil'
  | 'media'
  | 'dificil';

export interface Comida {
  nombre: string;
  categoria: CategoriaComida;
  ingredientes: string[];
  descripcion: string;
  tiempoPreparacion: number;
  dificultad: Dificultad;
  precio: number;
  paisOrigen: string;
}
