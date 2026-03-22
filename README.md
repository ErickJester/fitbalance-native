# FitBalance Native

Coach de entrenamiento personalizado — app móvil construida con React Native + Expo.

## ¿Qué hace?

Guía al usuario por un wizard de 5 pasos para generar un plan nutricional y una rutina de gimnasio completamente personalizada según su equipamiento disponible, objetivo y disponibilidad semanal.

## Stack

- React Native 0.81 + Expo SDK 54
- expo-sqlite — base de datos local con 171 ejercicios
- Sin backend ni API externa

## Estructura del wizard

```
Perfil → Rutina → Objetivo → Equipamiento → Plan
```

1. **Perfil** — sexo, edad, peso, altura, nivel de actividad física
2. **Rutina** — días de gym por semana, duración de sesión, calidad de dieta
3. **Objetivo** — perder peso · ganar músculo · mantenimiento · salud general
4. **Equipamiento** — selecciona las máquinas y pesas disponibles en tu gym
5. **Plan** — macros diarios + rutina semanal generada con los ejercicios disponibles

## Base de datos de ejercicios

171 ejercicios distribuidos en 8 grupos musculares, almacenados en SQLite al primer arranque:

| Grupo                        | Ejercicios |
|------------------------------|-----------|
| Pecho                        | 25        |
| Espalda                      | 30        |
| Hombros                      | 21        |
| Bíceps + Antebrazos          | 20        |
| Tríceps                      | 17        |
| Piernas (cuádriceps)         | 20        |
| Isquios + Glúteos + Pantorr. | 23        |
| Abdominales                  | 14        |

Cada ejercicio incluye ejecución detallada, respiración, variantes anatómicas y advertencias de lesión.

## Cómo correr

```bash
# Instalar dependencias
npm install

# Iniciar servidor Expo
npm start
```

Luego escanear el QR con Expo Go (Android/iOS) o presionar `a` para abrir en emulador Android.

### En WSL (Windows)

```bash
wsl.exe bash -l -c "cd /mnt/c/Users/Samsung/Desktop/proyectos/fitbalance-native && npm start"
```

## Scripts

```bash
npm run merge-exercises   # Fusiona los 8 JSON en src/data/exercises_all.json
```

## Estructura de archivos

```
fitbalance-native/
├── App.js                          # Raíz — wizard de 5 steps + init de BD
├── src/
│   ├── screens/
│   │   ├── StepPerfil.jsx
│   │   ├── StepRutina.jsx
│   │   ├── StepObjetivo.jsx
│   │   ├── StepEquipment.jsx       # Selector de equipamiento con stats en tiempo real
│   │   └── StepPlan.jsx            # Muestra macros + rutina semanal
│   ├── logic/
│   │   ├── calculations.js         # TDEE, BMR, macros (Mifflin-St Jeor)
│   │   └── routineBuilder.js       # Genera rutinas según equipo + objetivo + días
│   ├── db/
│   │   └── database.js             # expo-sqlite: schema, sembrado, queries
│   ├── components/
│   │   ├── StepBar.jsx
│   │   └── theme.js
│   └── data/
│       ├── equipment.json          # 90+ equipos en 7 categorías
│       ├── exercises_pecho.json
│       ├── exercises_espalda.json
│       ├── exercises_hombros.json
│       ├── exercises_biceps_antebrazos.json
│       ├── exercises_triceps.json
│       ├── exercises_piernas.json
│       ├── exercises_isquios_gluteos_pantorrillas.json
│       └── exercises_abdominales.json
└── scripts/
    └── mergeExercises.js           # Fusiona los 8 bloques en exercises_all.json
```
