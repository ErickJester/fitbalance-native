export function calcTDEE(d) {
  const w = parseFloat(d.weight), h = parseFloat(d.height), a = parseInt(d.age);
  if (!w || !h || !a) return null;
  const bmr = d.sex === "m" ? 10*w + 6.25*h - 5*a + 5 : 10*w + 6.25*h - 5*a - 161;
  const mul = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725, very:1.9 };
  return Math.round(bmr * (mul[d.physicalActivity] || 1.2));
}

export function buildPlan(d) {
  const tdee = calcTDEE(d);
  if (!tdee) return null;
  const gymDays = parseInt(d.gymDays) || 0;
  const gymMin  = parseInt(d.gymMinutes) || 0;
  const gymCalWeek = gymDays * gymMin * 6;
  const dietQ = { excellent:1.0, good:0.85, average:0.65, poor:0.45, junk:0.25 }[d.dietStyle] || 0.65;
  const gymScore = Math.min(gymCalWeek / 400, 1);
  const goalAdj  = { lose:-500, muscle:250, maintain:0, health:-200 };
  let target = tdee + (goalAdj[d.goal] || 0);
  let recoGymDays = gymDays;
  let dietNote = "", gymNote = "";

  if (dietQ < 0.5 && gymScore < 0.5) {
    target = Math.round(target * 0.88);
    recoGymDays = Math.min(recoGymDays + 2, 6);
    dietNote = "Dieta pobre y poco gym: reduce calorías gradualmente y suma días de ejercicio.";
    gymNote  = "Intenta llegar a 3-4 sesiones semanales de al menos 40 min.";
  } else if (dietQ < 0.55) {
    recoGymDays = Math.min(recoGymDays + 1, 6);
    dietNote = "Compensa la calidad de tu dieta con un día extra de ejercicio semanal.";
    gymNote  = "Prioriza cardio + fuerza para quemar el exceso calórico.";
  } else if (gymScore < 0.4) {
    target = Math.round(target * 0.93);
    dietNote = "Poco tiempo de gym: ajusta calorías a la baja para compensar.";
    gymNote  = "Con 20-30 min de HIIT puedes compensar sesiones cortas.";
  } else {
    dietNote = "Buena combinación. Mantén la consistencia.";
    gymNote  = "Ritmo adecuado para tu objetivo.";
  }

  const w       = parseFloat(d.weight) || 70;
  const protein = Math.round(w * (d.goal === "muscle" ? 2.0 : 1.6));
  const fat     = Math.round(target * 0.28 / 9);
  const carbs   = Math.round((target - protein*4 - fat*9) / 4);

  return { tdee, target, protein, fat, carbs, gymCalWeek: Math.round(gymCalWeek), recoGymDays, dietNote, gymNote, dietScore: dietQ*100, gymScore: gymScore*100 };
}

export function gymRoutine(d, goal) {
  const days = parseInt(d.gymDays) || 0;
  const min  = parseInt(d.gymMinutes) || 30;
  if (days === 0) return [];

  const warmup  = "5 min calentamiento (bici estática o caminata rápida)";
  const stretch = "5 min estiramientos finales";

  const routines = {
    lose: [
      { day: "Día A – Cardio + Fuerza", blocks: [
        { title: "Calentamiento", items: [warmup] },
        { title: `Cardio (${Math.round(min*0.35)} min)`, items: ["Caminadora inclinada o bici estática — ritmo moderado-alto"] },
        { title: "Fuerza – Circuito 3×12", items: ["Sentadilla con peso corporal o barra","Press de pecho en máquina o mancuernas","Jalón al pecho (polea alta)","Peso muerto con mancuernas"] },
        { title: "Vuelta a la calma", items: [stretch] },
      ]},
      { day: "Día B – HIIT + Core", blocks: [
        { title: "Calentamiento", items: [warmup] },
        { title: `HIIT (${Math.round(min*0.4)} min)`, items: ["20 seg sprint / 40 seg descanso × 8-10 rondas","Alternativa: cuerda, jumping jacks, burpees"] },
        { title: "Core – 3×15", items: ["Plancha frontal (30-45 seg)","Crunch abdominal","Elevación de piernas en banca","Puente de glúteos"] },
        { title: "Vuelta a la calma", items: [stretch] },
      ]},
      { day: "Día C – Cardio Steady-State + Movilidad", blocks: [
        { title: `Cardio suave (${min} min)`, items: ["Caminata rápida, bici o elíptica — ritmo constante y cómodo"] },
        { title: "Movilidad", items: ["Rotación de cadera, apertura de pecho, estiramiento de isquiotibiales","Foam roller en piernas y espalda (5 min)"] },
      ]},
      { day: "Día D – Tren inferior + Core", blocks: [
        { title: "Calentamiento", items: [warmup] },
        { title: "Piernas – 3×12", items: ["Sentadilla goblet con mancuerna","Zancadas caminando (10 pasos)","Prensa de pierna","Curl femoral en máquina"] },
        { title: "Core – 3×12", items: ["Russian twist","Dead bug","Plancha lateral (20 seg c/lado)"] },
        { title: "Vuelta a la calma", items: [stretch] },
      ]},
      { day: "Día E – Tren superior + Cardio", blocks: [
        { title: "Calentamiento", items: [warmup] },
        { title: "Tren superior – 3×12", items: ["Remo con mancuerna","Press de hombros","Aperturas en polea (pecho)","Curl de bíceps + extensión tríceps"] },
        { title: `Cardio final (${Math.round(min*0.3)} min)`, items: ["Bici estática o elíptica a ritmo moderado"] },
        { title: "Vuelta a la calma", items: [stretch] },
      ]},
      { day: "Día F – Full Body + HIIT", blocks: [
        { title: "Calentamiento", items: [warmup] },
        { title: "Full body – 3×10", items: ["Sentadilla + press overhead (thruster)","Remo con barra","Peso muerto","Fondos en paralelas o en banco"] },
        { title: `HIIT final (${Math.round(min*0.25)} min)`, items: ["Sprints cortos o bicicleta × 6 rondas"] },
        { title: "Vuelta a la calma", items: [stretch] },
      ]},
    ],
    muscle: [
      { day: "Día A – Pecho + Tríceps", blocks: [
        { title: "Calentamiento", items: [warmup, "10 flexiones de calentamiento"] },
        { title: "Pecho – 4×8", items: ["Press de banca con barra (principal)","Press inclinado con mancuernas","Aperturas en polea o máquina (pec deck)","Fondos en paralelas (lastrado si es posible)"] },
        { title: "Tríceps – 3×10", items: ["Extensión en polea (cuerda)","Press francés con barra EZ","Fondos cerrados en banco"] },
        { title: "Vuelta a la calma", items: [stretch] },
      ]},
      { day: "Día B – Espalda + Bíceps", blocks: [
        { title: "Calentamiento", items: [warmup] },
        { title: "Espalda – 4×8", items: ["Jalón al pecho (agarre ancho)","Remo con barra (Pendlay o inclinado)","Remo en máquina o polea","Pullover con mancuerna"] },
        { title: "Bíceps – 3×10", items: ["Curl con barra recta","Curl martillo con mancuernas","Curl concentrado (1 brazo)"] },
        { title: "Vuelta a la calma", items: [stretch] },
      ]},
      { day: "Día C – Piernas", blocks: [
        { title: "Calentamiento", items: [warmup, "Sentadilla sin peso × 15"] },
        { title: "Cuádriceps – 4×8", items: ["Sentadilla con barra (back squat)","Prensa de pierna","Extensión de cuádriceps en máquina"] },
        { title: "Isquiotibiales / Glúteos – 3×10", items: ["Peso muerto rumano con mancuernas","Curl femoral en máquina","Hip thrust (empuje de cadera con barra)"] },
        { title: "Pantorrillas – 3×15", items: ["Elevación de talones de pie (en máquina o libre)"] },
        { title: "Vuelta a la calma", items: [stretch] },
      ]},
      { day: "Día D – Hombros + Trapecios", blocks: [
        { title: "Calentamiento", items: [warmup, "Rotaciones de hombro con banda elástica"] },
        { title: "Hombros – 4×10", items: ["Press militar con barra o mancuernas","Elevaciones laterales","Elevaciones frontales","Pájaro (deltoides posterior)"] },
        { title: "Trapecios – 3×12", items: ["Encogimiento de hombros con mancuernas","Remo al mentón (agarre ancho)"] },
        { title: "Vuelta a la calma", items: [stretch] },
      ]},
      { day: "Día E – Full body + Core", blocks: [
        { title: "Calentamiento", items: [warmup] },
        { title: "Compuestos – 3×8", items: ["Peso muerto convencional","Press de banca agarre medio","Sentadilla frontal o goblet"] },
        { title: "Core – 3×12", items: ["Plancha con toque de hombros","Rueda abdominal","Elevación de piernas colgado en barra"] },
        { title: "Vuelta a la calma", items: [stretch] },
      ]},
      { day: "Día F – Brazos + Core", blocks: [
        { title: "Calentamiento", items: [warmup] },
        { title: "Bíceps – 3×12", items: ["Curl con barra","Curl predicador","Curl en polea baja"] },
        { title: "Tríceps – 3×12", items: ["Press francés","Extensión sobre la cabeza (mancuerna)","Kickbacks en polea"] },
        { title: "Core – 3×15", items: ["Crunch en polea","Plancha lateral","Mountain climbers"] },
        { title: "Vuelta a la calma", items: [stretch] },
      ]},
    ],
    maintain: [
      { day: "Día A – Full Body", blocks: [
        { title: "Calentamiento", items: [warmup] },
        { title: "Fuerza – 3×10", items: ["Sentadilla con barra o mancuernas","Press de banca","Jalón al pecho","Zancadas caminando"] },
        { title: "Core – 2×15", items: ["Plancha (40 seg)","Crunch bicicleta"] },
        { title: "Vuelta a la calma", items: [stretch] },
      ]},
      { day: "Día B – Cardio + Movilidad", blocks: [
        { title: `Cardio (${min} min)`, items: ["Bici, caminadora o elíptica — ritmo cómodo"] },
        { title: "Movilidad", items: ["Apertura de cadera, rotación torácica, estiramiento de psoas","Foam roller (5 min)"] },
      ]},
      { day: "Día C – Tren superior", blocks: [
        { title: "Calentamiento", items: [warmup] },
        { title: "Empuje – 3×10", items: ["Press inclinado con mancuernas","Press de hombros","Fondos en banco"] },
        { title: "Jalón – 3×10", items: ["Remo con mancuerna","Jalón al pecho","Curl de bíceps"] },
        { title: "Vuelta a la calma", items: [stretch] },
      ]},
      { day: "Día D – Tren inferior", blocks: [
        { title: "Calentamiento", items: [warmup] },
        { title: "Piernas – 3×10", items: ["Sentadilla goblet","Peso muerto con mancuernas","Prensa de pierna","Elevación de talones"] },
        { title: "Vuelta a la calma", items: [stretch] },
      ]},
    ],
    health: [
      { day: "Día A – Movilidad + Fuerza funcional", blocks: [
        { title: "Movilidad (10 min)", items: ["Rotación de cadera, apertura de pecho, cuello, muñecas"] },
        { title: "Funcional – 3×12", items: ["Sentadilla con peso corporal","Flexiones (o asistidas)","Remo invertido en barra o TRX","Puente de glúteos"] },
        { title: "Respiración / relajación", items: ["5 min respiración diafragmática o yoga suave"] },
      ]},
      { day: "Día B – Cardio suave", blocks: [
        { title: `Cardio (${min} min)`, items: ["Caminata rápida, bici o natación — ritmo cómodo y constante"] },
        { title: "Estiramientos", items: ["Isquiotibiales, cuádriceps, espalda baja, hombros (5 min)"] },
      ]},
      { day: "Día C – Core + Equilibrio", blocks: [
        { title: "Calentamiento", items: [warmup] },
        { title: "Core – 3×12", items: ["Plancha frontal (30 seg)","Dead bug","Bird-dog","Puente lateral"] },
        { title: "Equilibrio", items: ["Sentadilla en una pierna (asistida)","Estocada estática con apoyo"] },
        { title: "Vuelta a la calma", items: [stretch] },
      ]},
    ],
  };

  const base = routines[goal] || routines.health;
  return Array.from({ length: days }, (_, i) => base[i % base.length]);
}
