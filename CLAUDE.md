# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tipo de proyecto

**React Native + Expo SDK 54** — aplicación móvil nativa.
NO es una app web. No usar `preview_start` ni herramientas de servidor web.
La verificación de cambios se hace corriendo la app en Expo Go o emulador.

## Comandos

```bash
npm start                  # Iniciar servidor Expo (Metro bundler)
npm run android            # Abrir en emulador Android
npm run ios                # Abrir en simulador iOS
npm run merge-exercises    # Fusionar los 8 JSON de ejercicios en exercises_all.json
```

> Los comandos deben ejecutarse en WSL:
> `wsl.exe bash -l -c "cd /mnt/c/Users/Samsung/Desktop/proyectos/fitbalance-native && npm start"`

## Entorno

- Node.js v20+ requerido (WSL: `nvm use 20`)
- Expo CLI via `npx expo`
- Windows + WSL para desarrollo

## Arquitectura

### Flujo de la app (wizard de 5 pasos)

El estado global vive en `App.js` y se pasa como props a cada pantalla. No hay librería de navegación ni gestor de estado externo.

| Step | Pantalla        | Propósito                                              |
|------|-----------------|--------------------------------------------------------|
| 0    | StepPerfil      | Sexo, edad, peso, altura, nivel de actividad           |
| 1    | StepRutina      | Días de gym, duración de sesión, calidad de dieta      |
| 2    | StepObjetivo    | Meta fitness (lose / muscle / maintain / health)       |
| 3    | StepEquipment   | Selección de equipos disponibles en el gym             |
| 4    | StepPlan        | Resultados: macros + rutina semanal personalizada      |

Al pasar del step 3 al 4, `App.js` llama `buildPlan()` + `buildRoutine()` y luego persiste el resultado con `saveUserPlan()`.

### Flujo de datos al generar el plan

```
data (INITIAL_DATA) + selectedEquipment (array de IDs)
        │
        ├─► buildPlan(data)          → plan { tdee, target, protein, fat, carbs, ... }
        │     src/logic/calculations.js
        │
        ├─► buildRoutine({ exercises, selectedEquipment, equipmentData, goal, gymDays, gymMinutes })
        │     src/logic/routineBuilder.js
        │     └── buildAvailableNames(selectedEquipment, equipmentData) → Set de nombres de equipo
        │         filtra exercises por equipo disponible, agrupa por split según gymDays (1-6)
        │
        └─► saveUserPlan(db, profile, plan, routine)
              src/db/database.js  — persiste en user_profile + user_plan (id=1 fijo)
```

### Dos generadores de rutinas (importante)

Existen **dos** sistemas de rutinas distintos, no confundirlos:

1. **`src/logic/routineBuilder.js` → `buildRoutine()`** — usa los ejercicios reales de SQLite filtrados por equipamiento disponible. Genera splits según días (1–6 días). **Este es el sistema activo.**

2. **`src/logic/calculations.js` → `gymRoutine()`** — genera rutinas genéricas de texto sin usar la base de datos de ejercicios. Función legacy, actualmente no se usa en la UI principal.

### Base de datos SQLite (`fitbalance.db`)

Tres tablas:

| Tabla          | Propósito                                              |
|----------------|--------------------------------------------------------|
| `exercises`    | 171 ejercicios sembrados al primer arranque desde JSON |
| `user_profile` | Perfil del usuario (un solo registro, id = 1)          |
| `user_plan`    | Plan y rutina calculados (un solo registro, id = 1)    |
| `meta`         | Control de sembrado (`seeded = 1`)                     |

- Los campos `sinergistas`, `equipo`, `variantes_anatomicas`, `advertencias_lesion` se guardan como JSON strings y se parsean con `parseRow()`.
- `user_profile.equipment_ids` y `user_plan.routine` también son JSON strings.
- API pública: `openDatabase()`, `getAllExercises()`, `getExercisesByMuscleGroup()`, `getExercisesByLevel()`, `saveUserPlan()`, `loadUserPlan()`.

### Datos de ejercicios

8 archivos JSON en `src/data/`, uno por grupo muscular (170+ ejercicios en total).
El campo `equipo` de los ejercicios usa el **nombre** del equipo (no el `id`).
La función `buildAvailableNames()` en `routineBuilder.js` hace la traducción ID → nombre usando `equipment.json`.

### Equipamiento (`src/data/equipment.json`)

90+ equipos en 7 categorías. Cada equipo: `id`, `nombre`, `icono`, `grupos`.
