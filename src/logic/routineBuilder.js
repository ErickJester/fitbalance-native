// ─── Splits por número de días ────────────────────────────────────────────────
// Los nombres de grupos deben coincidir con el campo grupo_muscular en los JSON
const SPLITS = {
  1: [
    { nombre: "Full Body", grupos: ["cuadriceps", "pecho", "espalda", "hombros", "gluteos", "abdominales"] }
  ],
  2: [
    { nombre: "Tren Superior", grupos: ["pecho", "espalda", "hombros", "biceps", "triceps"] },
    { nombre: "Tren Inferior", grupos: ["cuadriceps", "gluteos", "isquiosurales", "pantorrillas", "abdominales"] }
  ],
  3: [
    { nombre: "Empuje (Push)",   grupos: ["pecho", "hombros", "triceps"] },
    { nombre: "Jalón (Pull)",    grupos: ["espalda", "biceps"] },
    { nombre: "Piernas + Core",  grupos: ["cuadriceps", "gluteos", "isquiosurales", "pantorrillas", "abdominales"] }
  ],
  4: [
    { nombre: "Tren Superior A — Empuje",    grupos: ["pecho", "hombros", "triceps"] },
    { nombre: "Tren Inferior A — Cuádriceps",grupos: ["cuadriceps", "gluteos", "abdominales"] },
    { nombre: "Tren Superior B — Jalón",     grupos: ["espalda", "biceps"] },
    { nombre: "Tren Inferior B — Posterior", grupos: ["isquiosurales", "gluteos", "pantorrillas"] }
  ],
  5: [
    { nombre: "Pecho + Tríceps",     grupos: ["pecho", "triceps"] },
    { nombre: "Espalda + Bíceps",    grupos: ["espalda", "biceps"] },
    { nombre: "Piernas (Compuesto)", grupos: ["cuadriceps", "gluteos", "isquiosurales", "pantorrillas"] },
    { nombre: "Hombros + Core",      grupos: ["hombros", "abdominales"] },
    { nombre: "Full Body — Fuerza",  grupos: ["cuadriceps", "pecho", "espalda", "gluteos", "abdominales"] }
  ],
  6: [
    { nombre: "Pecho + Tríceps",    grupos: ["pecho", "triceps"] },
    { nombre: "Espalda + Bíceps",   grupos: ["espalda", "biceps"] },
    { nombre: "Piernas",            grupos: ["cuadriceps", "gluteos", "isquiosurales", "pantorrillas"] },
    { nombre: "Hombros",            grupos: ["hombros"] },
    { nombre: "Brazos + Core",      grupos: ["biceps", "triceps", "antebrazos", "abdominales"] },
    { nombre: "Full Body + Core",   grupos: ["cuadriceps", "pecho", "espalda", "abdominales"] }
  ]
};

const GRUPO_LABEL = {
  pecho:          "Pecho",
  espalda:        "Espalda",
  hombros:        "Hombros",
  biceps:         "Bíceps",
  antebrazos:     "Antebrazos",
  triceps:        "Tríceps",
  cuadriceps:     "Cuádriceps",
  isquiosurales:  "Isquiotibiales",
  gluteos:        "Glúteos",
  pantorrillas:   "Pantorrillas",
  abdominales:    "Core / Abdomen",
};

// Patrones de movimiento que se consideran ejercicios compuestos
const PATRONES_COMPUESTOS = new Set([
  "dominante_rodilla",
  "dominante_cadera",
  "empuje_horizontal",
  "empuje_vertical",
  "jalon_horizontal",
  "jalon_vertical",
  "multiarticular",
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function maxEjerciciosPorSesion(minutos) {
  if (minutos <= 30) return 4;
  if (minutos <= 45) return 5;
  if (minutos <= 60) return 6;
  if (minutos <= 90) return 8;
  return 10;
}

function getSetsReps(goal) {
  return {
    muscle:   { series: "4", reps: "6-10"  },
    lose:     { series: "3", reps: "12-15" },
    maintain: { series: "3", reps: "10-12" },
    health:   { series: "3", reps: "12-15" },
  }[goal] || { series: "3", reps: "10-12" };
}

// Clasifica el ejercicio en "compuesto" o "aislamiento" según su patrón de movimiento
function getTipo(ejercicio) {
  return PATRONES_COMPUESTOS.has(ejercicio.patron_movimiento) ? "compuesto" : "aislamiento";
}

function prioridad(ejercicio, goal) {
  const tipo = getTipo(ejercicio);
  const prioridades = {
    muscle:   { compuesto: 0, aislamiento: 1 },
    lose:     { compuesto: 0, aislamiento: 1 },
    maintain: { compuesto: 0, aislamiento: 1 },
    health:   { compuesto: 0, aislamiento: 1 },
  };
  return (prioridades[goal] || prioridades.maintain)[tipo] ?? 2;
}

/**
 * Construye un Set con los nombres de equipo disponibles a partir de los IDs
 * seleccionados por el usuario. "peso corporal" siempre está disponible.
 */
function buildAvailableNames(selectedEquipment, equipmentData) {
  const allEquipment = equipmentData.categorias.flatMap(c => c.equipos);
  const selectedSet  = new Set(selectedEquipment);

  const names = new Set(
    allEquipment
      .filter(e => selectedSet.has(e.id))
      .map(e => e.nombre.toLowerCase().trim())
  );
  names.add("peso corporal");
  return names;
}

/**
 * Filtra los ejercicios cuyo equipo requerido está completamente disponible.
 * Un ejercicio sin equipo declarado siempre es accesible.
 */
function filterAvailable(exercises, selectedEquipment, equipmentData) {
  const availableNames = buildAvailableNames(selectedEquipment, equipmentData);

  return exercises.filter(ej => {
    const equipoList = ej.equipo || [];
    if (equipoList.length === 0) return true;
    return equipoList.every(eq => availableNames.has(eq.toLowerCase().trim()));
  });
}

/**
 * Selecciona ejercicios para un día dado limitando la cantidad y priorizando
 * según el objetivo. Cubre el mayor número de grupos musculares distintos.
 */
function pickExercisesForDay(disponibles, grupos, goal, maxEj) {
  const candidates = disponibles
    .filter(ej => grupos.includes(ej.grupo_muscular))
    .sort((a, b) => prioridad(a, goal) - prioridad(b, goal));

  const seleccionados = [];
  const gruposCubiertos = new Set();

  // Primera pasada: un ejercicio por grupo
  for (const ej of candidates) {
    if (seleccionados.length >= maxEj) break;
    if (!gruposCubiertos.has(ej.grupo_muscular)) {
      seleccionados.push(ej);
      gruposCubiertos.add(ej.grupo_muscular);
    }
  }

  // Segunda pasada: rellenar hasta maxEj con ejercicios adicionales
  if (seleccionados.length < maxEj) {
    const usados = new Set(seleccionados.map(e => e.id));
    for (const ej of candidates) {
      if (seleccionados.length >= maxEj) break;
      if (!usados.has(ej.id)) {
        seleccionados.push(ej);
        usados.add(ej.id);
      }
    }
  }

  return seleccionados;
}

/**
 * Agrupa los ejercicios por grupo_muscular y los convierte en bloques
 * listos para mostrar en pantalla.
 */
function ejerciciosABloques(ejercicios, goal) {
  const setsRepsBase = getSetsReps(goal);
  const grupos = {};

  for (const ej of ejercicios) {
    const g = ej.grupo_muscular;
    if (!grupos[g]) grupos[g] = [];
    grupos[g].push(ej);
  }

  return Object.entries(grupos).map(([grupo, lista]) => ({
    title: GRUPO_LABEL[grupo] || grupo,
    items: lista.map(ej => {
      const { series, reps } = setsRepsBase;
      return `${ej.nombre} — ${series}×${reps}`;
    })
  }));
}

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Genera la rutina semanal completa.
 *
 * @param {object}   params
 * @param {Array}    params.exercises         - Array de ejercicios cargados desde la BD
 * @param {string[]} params.selectedEquipment - IDs de equipamiento disponible
 * @param {object}   params.equipmentData     - Objeto importado de equipment.json
 * @param {string}   params.goal              - "muscle" | "lose" | "maintain" | "health"
 * @param {number}   params.gymDays           - 1-6
 * @param {number}   params.gymMinutes        - duración por sesión en minutos
 * @returns {Array} Array de días con { day, blocks }
 */
export function buildRoutine({ exercises, selectedEquipment, equipmentData, goal, gymDays, gymMinutes }) {
  const days  = Math.min(Math.max(parseInt(gymDays) || 3, 1), 6);
  const mins  = parseInt(gymMinutes) || 45;
  const maxEj = maxEjerciciosPorSesion(mins);

  const disponibles = filterAvailable(exercises, selectedEquipment, equipmentData);

  if (disponibles.length === 0) {
    return pesoCorpoRoutine(goal, days);
  }

  const split = SPLITS[days] || SPLITS[3];

  return split.map((diaInfo, idx) => {
    const ejercicios = pickExercisesForDay(disponibles, diaInfo.grupos, goal, maxEj);
    const label = idx + 1;

    if (ejercicios.length === 0) {
      return {
        day: `Día ${label} — ${diaInfo.nombre}`,
        blocks: [{ title: "Sin equipamiento suficiente", items: ["Agrega más equipamiento o realiza ejercicios de peso corporal"] }]
      };
    }

    return {
      day: `Día ${label} — ${diaInfo.nombre}`,
      blocks: [
        { title: "Calentamiento (5 min)", items: ["Bici estática, caminata rápida o movilidad articular"] },
        ...ejerciciosABloques(ejercicios, goal),
        { title: "Vuelta a la calma (5 min)", items: ["Estiramientos de los grupos trabajados hoy"] }
      ]
    };
  });
}

/**
 * Estadísticas del equipamiento seleccionado (usado en StepEquipment).
 *
 * @param {object}   params
 * @param {Array}    params.exercises
 * @param {string[]} params.selectedEquipment
 * @param {object}   params.equipmentData
 * @returns {{ totalEjercicios: number, gruposCubiertos: string[] }}
 */
export function getEquipmentStats({ exercises, selectedEquipment, equipmentData }) {
  const disponibles = filterAvailable(exercises, selectedEquipment, equipmentData);
  const grupos = new Set(disponibles.map(e => e.grupo_muscular).filter(Boolean));
  return {
    totalEjercicios: disponibles.length,
    gruposCubiertos: [...grupos],
  };
}

// ─── Rutina de peso corporal (fallback) ───────────────────────────────────────

function pesoCorpoRoutine(goal, days) {
  const dias = [
    {
      day: "Día 1 — Full Body",
      blocks: [
        { title: "Calentamiento", items: ["5 min jumping jacks + movilidad articular"] },
        { title: "Fuerza — 3×12", items: ["Flexiones (push-ups)", "Sentadillas con peso corporal", "Fondos en silla", "Zancadas en el lugar"] },
        { title: "Core — 3×30 seg", items: ["Plancha frontal", "Plancha lateral", "Puente de glúteos"] },
        { title: "Vuelta a la calma", items: ["5 min estiramientos generales"] }
      ]
    },
    {
      day: "Día 2 — Cardio + Core",
      blocks: [
        { title: "Cardio — 20 min", items: ["HIIT: 30 seg esfuerzo / 30 seg descanso × 10 rondas", "Opciones: burpees, mountain climbers, saltos"] },
        { title: "Core — 3×15", items: ["Crunch abdominal", "Elevación de piernas acostado", "Russian twist"] },
        { title: "Vuelta a la calma", items: ["5 min estiramientos"] }
      ]
    }
  ];
  return Array.from({ length: days }, (_, i) => dias[i % dias.length]);
}
