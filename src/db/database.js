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

    CREATE TABLE IF NOT EXISTS user_profile (
      id                INTEGER PRIMARY KEY,
      sex               TEXT,
      age               INTEGER,
      weight            REAL,
      height            REAL,
      physical_activity TEXT,
      diet_style        TEXT,
      gym_days          INTEGER,
      gym_minutes       INTEGER,
      goal              TEXT,
      equipment_ids     TEXT,
      updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_plan (
      id             INTEGER PRIMARY KEY,
      profile_id     INTEGER REFERENCES user_profile(id),
      tdee           INTEGER,
      target         INTEGER,
      protein        INTEGER,
      fat            INTEGER,
      carbs          INTEGER,
      gym_cal_week   INTEGER,
      reco_gym_days  INTEGER,
      diet_score     REAL,
      gym_score      REAL,
      diet_note      TEXT,
      gym_note       TEXT,
      routine        TEXT,
      created_at     TEXT NOT NULL DEFAULT (datetime('now'))
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

/**
 * Guarda (o actualiza) el perfil del usuario y los resultados del plan.
 * Siempre mantiene solo un registro (id = 1) para perfil y plan.
 * @param {SQLiteDatabase} db
 * @param {object} profile  — campos del wizard (data + selectedEquipment)
 * @param {object} plan     — resultado de buildPlan()
 * @param {Array}  routine  — resultado de buildRoutine()
 * @returns {Promise<void>}
 */
export async function saveUserPlan(db, profile, plan, routine) {
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO user_profile (id, sex, age, weight, height, physical_activity,
         diet_style, gym_days, gym_minutes, goal, equipment_ids, updated_at)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         sex = excluded.sex,
         age = excluded.age,
         weight = excluded.weight,
         height = excluded.height,
         physical_activity = excluded.physical_activity,
         diet_style = excluded.diet_style,
         gym_days = excluded.gym_days,
         gym_minutes = excluded.gym_minutes,
         goal = excluded.goal,
         equipment_ids = excluded.equipment_ids,
         updated_at = excluded.updated_at`,
      [
        profile.sex,
        parseInt(profile.age)        || null,
        parseFloat(profile.weight)   || null,
        parseFloat(profile.height)   || null,
        profile.physicalActivity,
        profile.dietStyle,
        parseInt(profile.gymDays)    || null,
        parseInt(profile.gymMinutes) || null,
        profile.goal,
        JSON.stringify(profile.selectedEquipment || []),
      ]
    );

    await db.runAsync(
      `INSERT INTO user_plan (id, profile_id, tdee, target, protein, fat, carbs,
         gym_cal_week, reco_gym_days, diet_score, gym_score, diet_note, gym_note,
         routine, created_at)
       VALUES (1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         profile_id    = excluded.profile_id,
         tdee          = excluded.tdee,
         target        = excluded.target,
         protein       = excluded.protein,
         fat           = excluded.fat,
         carbs         = excluded.carbs,
         gym_cal_week  = excluded.gym_cal_week,
         reco_gym_days = excluded.reco_gym_days,
         diet_score    = excluded.diet_score,
         gym_score     = excluded.gym_score,
         diet_note     = excluded.diet_note,
         gym_note      = excluded.gym_note,
         routine       = excluded.routine,
         created_at    = excluded.created_at`,
      [
        plan.tdee,
        plan.target,
        plan.protein,
        plan.fat,
        plan.carbs,
        plan.gymCalWeek,
        plan.recoGymDays,
        plan.dietScore,
        plan.gymScore,
        plan.dietNote,
        plan.gymNote,
        JSON.stringify(routine),
      ]
    );
  });
}

/**
 * Carga el perfil y el plan guardado del usuario.
 * Retorna null si no hay datos guardados.
 * @param {SQLiteDatabase} db
 * @returns {Promise<{profile: object, plan: object} | null>}
 */
export async function loadUserPlan(db) {
  const profile = await db.getFirstAsync("SELECT * FROM user_profile WHERE id = 1");
  if (!profile) return null;

  const plan = await db.getFirstAsync("SELECT * FROM user_plan WHERE id = 1");

  return {
    profile: {
      ...profile,
      equipment_ids: JSON.parse(profile.equipment_ids || "[]"),
    },
    plan: plan
      ? { ...plan, routine: JSON.parse(plan.routine || "[]") }
      : null,
  };
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
