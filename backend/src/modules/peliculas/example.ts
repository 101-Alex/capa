import { db } from '../../config/database.js';
import { peliculasRepository } from './index.js';

async function runCrudExample(): Promise<void> {
  try {
    // CREATE: content admite objetos, arreglos, booleanos y datos anidados.
    const created = await peliculasRepository.create({
      titulo: 'Interestelar',
      anio: 2014,
      genero: ['Ciencia ficción', 'Drama'],
      director: { nombre: 'Christopher Nolan', pais: 'Reino Unido' },
      reparto: [
        { nombre: 'Matthew McConaughey', personaje: 'Cooper' },
        { nombre: 'Anne Hathaway', personaje: 'Brand' }
      ],
      disponible: true,
      puntuacion: 8.7,
      plataformas: ['Ejemplo Streaming']
    });
    console.log('\nCREATE:', created);

    // READ ALL: solo registros del módulo peliculas.
    console.log('\nFIND ALL:', await peliculasRepository.findAll());

    // READ BY ID.
    console.log('\nFIND BY ID:', await peliculasRepository.findById(created.id));

    // FILTER: busca dentro de content.titulo.
    console.log('\nFIND BY FIELD:', await peliculasRepository.findByField('titulo', 'Interestelar'));

    // UPDATE.
    const updated = await peliculasRepository.update(created.id, {
      ...created.content,
      puntuacion: 9.0
    });
    console.log('\nUPDATE:', updated);

    // DELETE: descomenta para borrar el registro de prueba.
    console.log('\nDELETE:', await peliculasRepository.delete(created.id));
  } finally {
    await db.close();
  }
}

runCrudExample().catch((error) => {
  console.error('Error ejecutando el CRUD de peliculas:', error);
  process.exitCode = 1;
});
