
import { db } from '../../config/database.js';
import {
  crearComida,
  listarComidas,
  obtenerComida,
  buscarComida,
  actualizarComida,
  eliminarComida
} from './service.js';

async function ejecutarPruebas(): Promise<void> {
  try {
    const nueva = await crearComida({
      nombre: 'Tacos al pastor',
      categoria: 'comida',
      ingredientes: [
        'Carne de cerdo',
        'Tortillas',
        'Piña',
        'Cilantro',
        'Cebolla'
      ],
      descripcion: 'Tacos tradicionales mexicanos.',
      tiempoPreparacion: 35,
      dificultad: 'media',
      precio: 80,
      paisOrigen: 'México'
    });

    console.log('CREATE:', nueva);

    console.log('LISTAR:', await listarComidas());

    console.log(
      'BUSCAR POR ID:',
      await obtenerComida(nueva.id)
    );

    console.log(
      'BUSCAR POR NOMBRE:',
      await buscarComida('nombre', 'Tacos al pastor')
    );

    console.log(
      'ACTUALIZAR:',
      await actualizarComida(nueva.id, {
        ...nueva.content,
        precio: 90
      })
    );

    // La eliminación se deja desactivada
    // para conservar el registro de prueba.
    // await eliminarComida(nueva.id);

  } finally {
    await db.close();
  }
}

ejecutarPruebas().catch((error) => {
  console.error('Error en las pruebas de comida:', error);
  process.exitCode = 1;
});
