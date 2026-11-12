import { randomUUID } from 'node:crypto';
import { db } from '../config/database.js';

export interface ModuleRepositoryOptions {
  modulo: string;
  autor: string;
}

export interface RecordItem<T> {
  id: string;
  created_at: string;
  autor: string;
  modulo: string;
  content: T;
}

type DbRow = {
  id: string;
  created_at: string;
  autor: string;
  modulo: string;
  content: string;
};

/**
 * Repositorio genérico para la tabla única `records`.
 * Cada módulo crea una instancia con su nombre de rama y autor.
 */
export class ModuleRepository<T extends object = Record<string, unknown>> {
  private readonly modulo: string;
  private readonly autor: string;

  constructor({ modulo, autor }: ModuleRepositoryOptions) {
    if (!modulo.trim() || !autor.trim()) {
      throw new Error('ModuleRepository requiere modulo y autor no vacíos.');
    }
    this.modulo = modulo.trim();
    this.autor = autor.trim();
  }

  private mapRow(row: DbRow): RecordItem<T> {
    return {
      id: row.id,
      created_at: row.created_at,
      autor: row.autor,
      modulo: row.modulo,
      content: JSON.parse(row.content) as T
    };
  }

  async create(data: T): Promise<RecordItem<T>> {
    const id = randomUUID();
    const result = await db.execute({
      sql: `INSERT INTO records (id, autor, modulo, content)
            VALUES (?, ?, ?, jsonb(?))
            RETURNING id, created_at, autor, modulo, json(content) AS content`,
      args: [id, this.autor, this.modulo, JSON.stringify(data)]
    });
    return this.mapRow(result.rows[0] as unknown as DbRow);
  }

  async findAll(): Promise<RecordItem<T>[]> {
    const result = await db.execute({
      sql: `SELECT id, created_at, autor, modulo, json(content) AS content
            FROM records WHERE modulo = ? ORDER BY created_at DESC`,
      args: [this.modulo]
    });
    return result.rows.map((row) => this.mapRow(row as unknown as DbRow));
  }

  async findById(id: string): Promise<RecordItem<T> | null> {
    const result = await db.execute({
      sql: `SELECT id, created_at, autor, modulo, json(content) AS content
            FROM records WHERE id = ? AND modulo = ? LIMIT 1`,
      args: [id, this.modulo]
    });
    return result.rows[0]
      ? this.mapRow(result.rows[0] as unknown as DbRow)
      : null;
  }

  /** Busca por una propiedad del primer nivel de content. */
  async findByField(jsonKey: string, value: string | number | boolean | null): Promise<RecordItem<T>[]> {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(jsonKey)) {
      throw new Error('jsonKey inválida. Usa una clave simple del objeto JSON.');
    }
    const jsonPath = `$.${jsonKey}`;
    const result = await db.execute({
      sql: `SELECT id, created_at, autor, modulo, json(content) AS content
            FROM records
            WHERE modulo = ? AND json_extract(content, ?) = ?
            ORDER BY created_at DESC`,
      args: [this.modulo, jsonPath, value]
    });
    return result.rows.map((row) => this.mapRow(row as unknown as DbRow));
  }

  async update(id: string, data: T): Promise<RecordItem<T> | null> {
    const result = await db.execute({
      sql: `UPDATE records SET content = jsonb(?)
            WHERE id = ? AND modulo = ?
            RETURNING id, created_at, autor, modulo, json(content) AS content`,
      args: [JSON.stringify(data), id, this.modulo]
    });
    return result.rows[0]
      ? this.mapRow(result.rows[0] as unknown as DbRow)
      : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.execute({
      sql: `DELETE FROM records WHERE id = ? AND modulo = ?`,
      args: [id, this.modulo]
    });
    return Number(result.rowsAffected) > 0;
  }
}
