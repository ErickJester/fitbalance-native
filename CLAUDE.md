# CLAUDE.md — fitbalance-native

Este archivo provee instrucciones a Claude Code cuando trabaja en este repositorio.

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

## Arquitectura

### Flujo de la app (wizard de 5 pasos)

| Step | Nombre      | Propósito                                              |
|------|-------------|--------------------------------------------------------|
| 0    | Perfil      | Sexo, edad, peso, altura, nivel de actividad           |
| 1    | Rutina      | Días de gym, duración de sesión, calidad de dieta      |
| 2    | Objetivo    | Meta fitness (perder peso, músculo, mantener, salud)   |
| 3    | Equipamiento| Selección de máquinas/pesas disponibles en el gym      |
| 4    | Plan        | Resultados: macros + rutina semanal personalizada      |

### Archivos principales

- **`App.js`** — raíz de la app, maneja estado global y navegación entre steps
- **`src/screens/`** — una pantalla por step (StepPerfil, StepRutina, StepObjetivo, StepEquipment, StepPlan)
- **`src/logic/calculations.js`** — cálculo de TDEE y macros (Mifflin-St Jeor)
- **`src/logic/routineBuilder.js`** — generador de rutinas semanales según equipamiento, objetivo y días
- **`src/db/database.js`** — inicialización de SQLite, sembrado de ejercicios, queries
- **`src/components/`** — StepBar, theme (colores y radios)

### Base de datos (SQLite via expo-sqlite)

Al primer arranque la app siembra los 171 ejercicios en SQLite (`fitbalance.db`).
Los ejercicios se importan directamente desde los 8 archivos JSON en `src/data/`.
Las consultas posteriores usan SQL para filtrar por equipamiento, grupo muscular, nivel, etc.

### Datos de ejercicios

8 archivos JSON en `src/data/`, uno por grupo muscular:

| Archivo                                        | Grupo              | Cantidad |
|------------------------------------------------|--------------------|----------|
| `exercises_pecho.json`                         | Pecho              | 25       |
| `exercises_espalda.json`                       | Espalda            | 30       |
| `exercises_hombros.json`                       | Hombros            | 21       |
| `exercises_biceps_antebrazos.json`             | Bíceps/Antebrazos  | 20       |
| `exercises_triceps.json`                       | Tríceps            | 17       |
| `exercises_piernas.json`                       | Piernas            | 20       |
| `exercises_isquios_gluteos_pantorrillas.json`  | Isquios/Glúteos    | 23       |
| `exercises_abdominales.json`                   | Abdominales        | 14       |

Campos de cada ejercicio: `id`, `nombre`, `grupo_muscular`, `patron_movimiento`,
`musculo_principal`, `sinergistas`, `equipo`, `nivel`, `ejecucion`, `respiracion`,
`variantes_anatomicas`, `advertencias_lesion`.

### Equipamiento (`src/data/equipment.json`)

90+ equipos en 7 categorías. Cada equipo tiene `id`, `nombre`, `icono`, `grupos`.
El campo `equipo` de los ejercicios usa el `nombre` del equipo (no el `id`).
La función `buildAvailableNames()` en `routineBuilder.js` hace la traducción ID → nombre.

## Entorno

- Node.js v20+ requerido (WSL: `nvm use 20`)
- Expo CLI via `npx expo`
- Windows + WSL para desarrollo
