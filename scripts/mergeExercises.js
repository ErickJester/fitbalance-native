/**
 * mergeExercises.js
 * Fusiona los 8 bloques de ejercicios en un solo archivo exercises_all.json
 * Uso: npm run merge-exercises
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../src/data");
const OUTPUT_FILE = path.join(DATA_DIR, "exercises_all.json");

const SOURCE_FILES = [
  "exercises_pecho.json",
  "exercises_espalda.json",
  "exercises_hombros.json",
  "exercises_biceps_antebrazos.json",
  "exercises_triceps.json",
  "exercises_piernas.json",
  "exercises_isquios_gluteos_pantorrillas.json",
  "exercises_abdominales.json",
];

let allExercises = [];
let totalByGroup = {};

for (const file of SOURCE_FILES) {
  const filePath = path.join(DATA_DIR, file);

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Archivo no encontrado: ${file}`);
    continue;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const exercises = JSON.parse(raw);

  for (const ex of exercises) {
    const group = ex.grupo_muscular || "sin_grupo";
    totalByGroup[group] = (totalByGroup[group] || 0) + 1;
  }

  allExercises = allExercises.concat(exercises);
  console.log(`✓ ${file} — ${exercises.length} ejercicios`);
}

const output = {
  _meta: {
    total: allExercises.length,
    grupos: totalByGroup,
    generado: new Date().toISOString(),
  },
  ejercicios: allExercises,
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf-8");

console.log(`\n✅ exercises_all.json generado — ${allExercises.length} ejercicios totales`);
console.log("   Grupos:", JSON.stringify(totalByGroup, null, 2));
