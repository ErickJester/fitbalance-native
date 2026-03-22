import * as SQLite from "expo-sqlite";

// ─── Importar los 8 bloques de ejercicios ────────────────────────────────────
import pecho           from "../data/exercises_pecho.json";
import espalda         from "../data/exercises_espalda.json";
import hombros         from "../data/exercises_hombros.json";
import bicepsAntebraz  from "../data/exercises_biceps_antebrazos.json";
import triceps         from "../data/exercises_triceps.json";
import piernas         from "../data/exercises_piernas.json";
import isquiosGluteos  from "../data/exercises_isquios_gluteos_pantorrillas.json";
import abdominales     from "../data/exercises_abdominales.json";

const ALL_EXERCISES = [
  ...pecho,
  ...espalda,
  ...hombros,
  ...bicepsAntebraz,
  ...triceps,
  ...piernas,
  ...isquiosGluteos,
  ...abdominales,
];

const DB_NAME = "fitbalance.db";

// ─── Schema ───────────────────────────────────────────────────────────────────
async function initSchema(db) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS exercises (
      id                   TEXT PRIMARY KEY,
      nombre               TEXT NOT NULL,
      grupo_muscular       TEXT,
      patron_movimiento    TEXT,
      musculo_principal    TEXT,
      sinergistas          TEXT,
      equipo               TEXT,
      nivel                TEXT,
      ejecucion            TEXT,
      respiracion          TEXT,
      variantes_anatomicas TEXT,
      advertencias_lesion  TEXT
    );

    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY,
      value TEXT
    );
  `);
}

// ─── Sembrado inicial (solo en primer arranque) ───────────────────────────────
async function seedIfNeeded(db) {
  const row = await db.getFirstAsync(
    "SELECT value FROM meta WHERE key = ?",
    ["seeded"]
  );
  if (row?.value === "1") return;

  await db.withTransactionAsync(async () => {
    for (const ex of ALL_EXERCISES) {
      await db.runAsync(
        `INSERT OR IGNORE INTO exercises VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          ex.id,
          ex.nombre,
          ex.grupo_muscular      ?? null,
          ex.patron_movimiento   ?? null,
          ex.musculo_principal   ?? null,
          JSON.stringify(ex.sinergistas          || []),
          JSON.stringify(ex.equipo               || []),
          ex.nivel               ?? null,
          ex.ejecucion           ?? null,
          ex.respiracion         ?? null,
          JSON.stringify(ex.variantes_anatomicas || []),
          JSON.stringify(ex.advertencias_lesion  || []),
        ]
      );
    }
    await db.runAsync("INSERT OR REPLACE INTO meta VALUES ('seeded', '1')");
  });
}

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Abre la base de datos, crea el schema y siembra datos si es la primera vez.
 * Llamar una sola vez al iniciar la app (en useEffect de App.js).
 * @returns {Promise<SQLiteDatabase>}
 */
export async function openDatabase() {
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await initSchema(db);
  await seedIfNeeded(db);
  return db;
}

/**
 * Devuelve todos los ejercicios como array de objetos con arrays correctamente
 * parseados (sinergistas, equipo, variantes_anatomicas, advertencias_lesion).
 * @param {SQLiteDatabase} db
 * @returns {Promise<Array>}
 */
export async function getAllExercises(db) {
  const rows = await db.getAllAsync("SELECT * FROM exercises");
  return rows.map(parseRow);
}

/**
 * Devuelve ejercicios filtrados por grupo muscular.
 * Útil para pantallas de detalle de músculo.
 * @param {SQLiteDatabase} db
 * @param {string} grupo - ej. "pecho", "espalda"
 * @returns {Promise<Array>}
 */
export async function getExercisesByMuscleGroup(db, grupo) {
  const rows = await db.getAllAsync(
    "SELECT * FROM exercises WHERE grupo_muscular = ?",
    [grupo]
  );
  return rows.map(parseRow);
}

/**
 * Devuelve ejercicios filtrados por nivel.
 * @param {SQLiteDatabase} db
 * @param {string} nivel - "principiante" | "intermedio" | "avanzado"
 * @returns {Promise<Array>}
 */
export async function getExercisesByLevel(db, nivel) {
  const rows = await db.getAllAsync(
    "SELECT * FROM exercises WHERE nivel = ?",
    [nivel]
  );
  return rows.map(parseRow);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseRow(row) {
  return {
    ...row,
    sinergistas:          JSON.parse(row.sinergistas          || "[]"),
    equipo:               JSON.parse(row.equipo               || "[]"),
    variantes_anatomicas: JSON.parse(row.variantes_anatomicas || "[]"),
    advertencias_lesion:  JSON.parse(row.advertencias_lesion  || "[]"),
  };
}
