
# Módulo de Comida - CAPA

**Responsable:** ALY

**Módulo:** comida

## Descripción

Permite registrar y administrar platillos mediante
operaciones CRUD utilizando el repositorio genérico
del proyecto CAPA.

## Estructura de los datos

- nombre
- categoria
- ingredientes
- descripcion
- tiempoPreparacion
- dificultad
- precio
- paisOrigen

## Categorías

- desayuno
- comida
- cena
- postre

## Operaciones disponibles

- Crear platillos.
- Consultar todos los platillos.
- Consultar por identificador.
- Buscar por propiedad.
- Actualizar platillos.
- Eliminar platillos.

## Arquitectura

Utiliza ModuleRepository y la tabla compartida
records de Turso/libSQL.

No modifica el esquema de la base de datos.
