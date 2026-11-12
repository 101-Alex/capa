import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

type ModuleKey = 'peliculas' | 'aves' | 'comida' | 'anime'


interface PeliculaContent {
  titulo?: string
  anio?: number
  genero?: string[]
  director?: {
    nombre: string
    pais?: string
  }
  reparto?: Array<{
    nombre: string
    personaje: string
  }>
  disponible?: boolean
  puntuacion?: number
  plataformas?: string[]
}


interface Pelicula {
  id: string
  created_at: string
  autor: string
  modulo: string
  content: PeliculaContent
}

const modules = [
  {
    id: 'peliculas' as ModuleKey,
    name: 'Películas',
    description: 'Administra información de películas, directores y reparto.',
    icon: '🎬',
    color: 'blue',
  },
  {
    id: 'aves' as ModuleKey,
    name: 'Aves',
    description: 'Consulta y administra registros de especies de aves.',
    icon: '🦜',
    color: 'green',
  },
  {
    id: 'comida' as ModuleKey,
    name: 'Comida',
    description: 'Organiza información de platillos y gastronomía.',
    icon: '🍲',
    color: 'orange',
  },
  {
    id: 'anime' as ModuleKey,
    name: 'Anime',
    description: 'Administra series, personajes y contenido de anime.',
    icon: '⛩️',
    color: 'purple',
  },
]

function App() {
  const [activeModule, setActiveModule] = useState<ModuleKey | null>(null)
  const [peliculas, setPeliculas] = useState<Pelicula[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedModule = modules.find(
    (module) => module.id === activeModule,
  )

  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [peliculaEditando, setPeliculaEditando] = useState<string | null>(null)

  const [formulario, setFormulario] = useState({
    titulo: '',
    anio: '2026',
    genero: '',
    directorNombre: '',
    directorPais: '',
    reparto: '',
    disponible: true,
    puntuacion: '8',
    plataformas: '',
  })

  useEffect(() => {
    if (activeModule !== 'peliculas') return

    const cargarPeliculas = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch('/api/peliculas')

        if (!response.ok) {
          throw new Error('No se pudieron consultar las películas.')
        }

        const data: Pelicula[] = await response.json()
        setPeliculas(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Ocurrió un error al conectar con el servidor.',
        )
      } finally {
        setLoading(false)
      }
    }

    cargarPeliculas()
  }, [activeModule])

  const limpiarFormulario = () => {
    setFormulario({
      titulo: '',
      anio: '2026',
      genero: '',
      directorNombre: '',
      directorPais: '',
      reparto: '',
      disponible: true,
      puntuacion: '8',
      plataformas: '',
    })

    setPeliculaEditando(null)
  }

  const editarPelicula = (pelicula: Pelicula) => {
    const contenido = pelicula.content

    setFormulario({
      titulo: contenido.titulo ?? '',
      anio: String(contenido.anio ?? 2026),
      genero: contenido.genero?.join(', ') ?? '',
      directorNombre: contenido.director?.nombre ?? '',
      directorPais: contenido.director?.pais ?? '',
      reparto: contenido.reparto
        ?.map((persona) => `${persona.nombre} | ${persona.personaje}`)
        .join('\n') ?? '',
      disponible: contenido.disponible ?? true,
      puntuacion: String(contenido.puntuacion ?? 8),
      plataformas: contenido.plataformas?.join(', ') ?? '',
    })

    setPeliculaEditando(pelicula.id)
    setMensaje('')
    setError('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const guardarCambios = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!peliculaEditando) return

    try {
      setGuardando(true)
      setError('')
      setMensaje('')

      const peliculaActualizada = {
        titulo: formulario.titulo.trim(),
        anio: Number(formulario.anio),
        genero: formulario.genero
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),

        director: {
          nombre: formulario.directorNombre.trim(),
          pais: formulario.directorPais.trim(),
        },

        reparto: formulario.reparto
          .split('\n')
          .map((linea) => linea.trim())
          .filter(Boolean)
          .map((linea) => {
            const [nombre, ...personaje] = linea.split('|')

            return {
              nombre: nombre.trim(),
              personaje: personaje.join('|').trim() || 'No especificado',
            }
          }),

        disponible: formulario.disponible,
        puntuacion: Number(formulario.puntuacion),

        plataformas: formulario.plataformas
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      }

      const response = await fetch(`/api/peliculas/${peliculaEditando}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(peliculaActualizada),
      })

      if (!response.ok) {
        throw new Error('No se pudieron guardar los cambios.')
      }

      const consulta = await fetch('/api/peliculas')

      if (!consulta.ok) {
        throw new Error('Los cambios se guardaron, pero no se pudo actualizar la lista.')
      }

      const datos: Pelicula[] = await consulta.json()

      setPeliculas(datos)
      limpiarFormulario()
      setMensaje('¡Película actualizada correctamente!')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al actualizar la película.',
      )
    } finally {
      setGuardando(false)
    }
  }

  const eliminarPelicula = async (id: string, titulo: string) => {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar la película "${titulo}"?`,
    )

    if (!confirmar) return

    try {
      setError('')
      setMensaje('')

      const response = await fetch(`/api/peliculas/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('No se pudo eliminar la película.')
      }

      setPeliculas((actuales) =>
        actuales.filter((pelicula) => pelicula.id !== id),
      )

      if (peliculaEditando === id) {
        limpiarFormulario()
      }

      setMensaje('¡Película eliminada correctamente!')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al eliminar la película.',
      )
    }
  }

  const registrarPelicula = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()

  try {
    setGuardando(true)
    setError('')
    setMensaje('')

    const nuevaPelicula = {
      titulo: formulario.titulo.trim(),
      anio: Number(formulario.anio),
      genero: formulario.genero
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),

      director: {
        nombre: formulario.directorNombre.trim(),
        pais: formulario.directorPais.trim(),
      },

      reparto: formulario.reparto
        .split('\n')
        .map((linea) => linea.trim())
        .filter(Boolean)
        .map((linea) => {
          const [nombre, ...personaje] = linea.split('|')

          return {
            nombre: nombre.trim(),
            personaje: personaje.join('|').trim() || 'No especificado',
          }
        }),

      disponible: formulario.disponible,
      puntuacion: Number(formulario.puntuacion),

      plataformas: formulario.plataformas
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    }

    const response = await fetch('/api/peliculas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaPelicula),
    })

    if (!response.ok) {
      throw new Error('No se pudo registrar la película.')
    }

    const consulta = await fetch('/api/peliculas')

    if (!consulta.ok) {
      throw new Error('La película se registró, pero no se pudo actualizar la lista.')
    }

    const datos: Pelicula[] = await consulta.json()

    setPeliculas(datos)
    setFormulario({
      titulo: '',
      anio: '2026',
      genero: '',
      directorNombre: '',
      directorPais: '',
      reparto: '',
      disponible: true,
      puntuacion: '8',
      plataformas: '',
    })

    setMensaje('¡Película registrada correctamente!')
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Ocurrió un error al registrar la película.',
    )
  } finally {
    setGuardando(false)
  }
}

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">C</div>
          <div>
            <h2>CAPA</h2>
            <span>Plataforma integrada</span>
          </div>
        </div>

        <div className="menu-label">MENÚ PRINCIPAL</div>

        <button
          className={`nav-item ${activeModule === null ? 'active' : ''}`}
          onClick={() => setActiveModule(null)}
        >
          <span>⌂</span>
          Inicio
        </button>

        <div className="menu-label modules-label">MÓDULOS</div>

        {modules.map((module) => (
          <button
            key={module.id}
            className={`nav-item ${activeModule === module.id ? 'active' : ''}`}
            onClick={() => setActiveModule(module.id)}
          >
            <span>{module.icon}</span>
            {module.name}
          </button>
        ))}

        <div className="sidebar-footer">
          <span className="status-dot" />
          CAPA · Versión inicial
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="breadcrumb">
              CAPA / {selectedModule?.name ?? 'Inicio'}
            </span>
            <h1>{selectedModule ? selectedModule.name : 'Panel principal'}</h1>
          </div>

          <div className="user-label">
            <span className="user-avatar">P</span>
            <div>
              <strong>Equipo CAPA</strong>
              <small>Proyecto académico</small>
            </div>
          </div>
        </header>

        {selectedModule ? (
          <section className="module-view">
            <button
              className="back-button"
              onClick={() => setActiveModule(null)}
            >
              ← Volver al inicio
            </button>

            <div className={`module-banner ${selectedModule.color}`}>
              <span className="module-banner-icon">{selectedModule.icon}</span>
              <div>
                <span className="eyebrow">MÓDULO CAPA</span>
                <h2>{selectedModule.name}</h2>
                <p>{selectedModule.description}</p>
              </div>
            </div>

            {activeModule === 'peliculas' ? (
              <div className="data-section">
                <div className="data-heading">
                  <div>
                    <h2>Catálogo de películas</h2>
                    <p>Registros consultados desde la base de datos Turso.</p>
                  </div>
                  <span className="module-count">
                    {peliculas.length} REGISTROS
                  </span>
                </div>

<form
  className="movie-form"
  onSubmit={peliculaEditando ? guardarCambios : registrarPelicula}
>
  <h3>
  {peliculaEditando ? 'Editar película' : 'Registrar nueva película'}
  </h3>

  <div className="form-grid">
    <label>
      Título
      <input
        required
        value={formulario.titulo}
        onChange={(e) =>
          setFormulario({ ...formulario, titulo: e.target.value })
        }
        placeholder="Ej. Interestelar"
      />
    </label>

    <label>
      Año
      <input
        type="number"
        required
        min="1888"
        max="2100"
        value={formulario.anio}
        onChange={(e) =>
          setFormulario({ ...formulario, anio: e.target.value })
        }
      />
    </label>

    <label>
      Géneros (separados por comas)
      <input
        value={formulario.genero}
        onChange={(e) =>
          setFormulario({ ...formulario, genero: e.target.value })
        }
        placeholder="Ciencia ficción, Drama"
      />
    </label>

    <label>
      Nombre del director
      <input
        required
        value={formulario.directorNombre}
        onChange={(e) =>
          setFormulario({ ...formulario, directorNombre: e.target.value })
        }
        placeholder="Nombre del director"
      />
    </label>

    <label>
      País del director
      <input
        value={formulario.directorPais}
        onChange={(e) =>
          setFormulario({ ...formulario, directorPais: e.target.value })
        }
        placeholder="Ej. Reino Unido"
      />
    </label>

    <label>
      Puntuación (0 a 10)
      <input
        type="number"
        min="0"
        max="10"
        step="0.1"
        value={formulario.puntuacion}
        onChange={(e) =>
          setFormulario({ ...formulario, puntuacion: e.target.value })
        }
      />
    </label>

    <label className="full-width">
      Reparto (un integrante por línea: Nombre | Personaje)
      <textarea
        rows={3}
        value={formulario.reparto}
        onChange={(e) =>
          setFormulario({ ...formulario, reparto: e.target.value })
        }
        placeholder={'Matthew McConaughey | Cooper\nAnne Hathaway | Brand'}
      />
    </label>

    <label className="full-width">
      Plataformas (separadas por comas)
      <input
        value={formulario.plataformas}
        onChange={(e) =>
          setFormulario({ ...formulario, plataformas: e.target.value })
        }
        placeholder="Netflix, Prime Video"
      />
    </label>

    <label className="availability-field">
      <input
        type="checkbox"
        checked={formulario.disponible}
        onChange={(e) =>
          setFormulario({ ...formulario, disponible: e.target.checked })
        }
      />
      Película disponible
    </label>
  </div>

  <button type="submit" className="save-button" disabled={guardando}>
    {guardando
      ? 'Guardando...'
      : peliculaEditando
        ? 'Guardar cambios'
        : 'Registrar película'}
  </button>

  {peliculaEditando && (
    <button
      type="button"
      className="cancel-button"
      onClick={limpiarFormulario}
      disabled={guardando}
    >
      Cancelar edición
    </button>
  )}

  {mensaje && <p className="success-message">{mensaje}</p>}
</form>


                {loading && <p className="data-message">Cargando películas...</p>}

                {error && (
                  <p className="data-error">
                    {error}
                  </p>
                )}

                {!loading && !error && peliculas.length === 0 && (
                  <p className="data-message">
                    No hay películas registradas todavía.
                  </p>
                )}

                <div className="movie-grid">
                  {peliculas.map((pelicula) => (
                    <article className="movie-card" key={pelicula.id}>
                      <div className="movie-card-icon">🎬</div>
                      <div>
                        <h3>{pelicula.content?.titulo ?? 'Sin título'}</h3>
                        <p>
                          Año: {pelicula.content?.anio ?? 'No especificado'}
                        </p>
                        <p>
                          Director:{' '}
                          {typeof pelicula.content?.director === 'object' &&
                          pelicula.content.director !== null
                            ? `${pelicula.content.director.nombre ?? 'Sin nombre'} ${
                                pelicula.content.director.pais
                                  ? `(${pelicula.content.director.pais})`
                                  : ''
                              }`
                            : pelicula.content?.director || 'No especificado'}
                        </p>
                        <p>
                          Género: {pelicula.content?.genero?.join(', ') || 'No especificado'}
                        </p>
                        <p>
                          Puntuación: {pelicula.content?.puntuacion ?? 'Sin puntuación'}
                        </p>
                        <p>
                          Disponibilidad:{' '}
                          {pelicula.content?.disponible ? 'Disponible' : 'No disponible'}
                        </p>
                        <small>
                          Registrado por: {pelicula.autor}
                        </small>
                      </div>
                      <div className="movie-actions">
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => editarPelicula(pelicula)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            eliminarPelicula(
                              pelicula.id,
                              pelicula.content?.titulo ?? 'Sin título',
                            )
                          }
                        >
                          Eliminar
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="coming-soon">
                <span>🚧</span>
                <h3>Área de trabajo del módulo</h3>
                <p>
                  La interfaz de este módulo está preparada.
                  Aquí se incorporarán las funciones de consulta,
                  registro, edición y eliminación de información.
                </p>
                <small>En desarrollo</small>
              </div>
            )}
          </section>
        ) : (
          <section className="dashboard">
            <div className="welcome-banner">
              <div>
                <span className="eyebrow">SISTEMA INTEGRADO</span>
                <h2>Bienvenido a CAPA</h2>
                <p>
                  Gestiona y consulta la información de los cuatro
                  módulos desde una sola plataforma.
                </p>
              </div>
              <div className="welcome-decoration">✦</div>
            </div>

            <div className="section-heading">
              <div>
                <h2>Módulos del sistema</h2>
                <p>Selecciona un módulo para acceder a su espacio de trabajo.</p>
              </div>
              <span className="module-count">04 MÓDULOS</span>
            </div>

            <div className="module-grid">
              {modules.map((module) => (
                <button
                  key={module.id}
                  className="module-card"
                  onClick={() => setActiveModule(module.id)}
                >
                  <div className={`card-icon ${module.color}`}>
                    {module.icon}
                  </div>

                  <h3>{module.name}</h3>
                  <p>{module.description}</p>

                  <div className="card-link">
                    Abrir módulo <span>→</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="info-panel">
              <div className="info-icon">ℹ</div>
              <div>
                <strong>Arquitectura compartida</strong>
                <p>
                  CAPA integra los cuatro módulos en una aplicación
                  con un backend centralizado y una base de datos compartida.
                </p>
              </div>
            </div>
          </section>
        )}

        <footer className="footer">
          CAPA · Sistema integrado de información
          <span>Desarrollado por el equipo CAPA</span>
        </footer>
      </main>
    </div>
  )
}

export default App
