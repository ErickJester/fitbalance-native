import knowledge from "../data/knowledge.json";

/**
 * Devuelve hasta `limit` consejos que coincidan con el objetivo y la calidad de dieta.
 * Siempre incluye c_006 (hidratación) y c_008 (descanso) si el límite lo permite.
 */
export function getTips(goal, dietStyle, limit = 3) {
  const exact = knowledge.consejos.filter(
    c => c.objetivos.includes(goal) && c.dietas.includes(dietStyle)
  );
  // Si hay pocos, complementa con los universales (todos los objetivos y dietas)
  if (exact.length < limit) {
    const ids = new Set(exact.map(c => c.id));
    const universal = knowledge.consejos.filter(
      c => !ids.has(c.id) &&
           c.objetivos.length >= 3 &&
           c.dietas.length >= 4
    );
    return [...exact, ...universal].slice(0, limit);
  }
  return exact.slice(0, limit);
}

/**
 * Devuelve hasta `limit` recetas que coincidan con el objetivo y la calidad de dieta.
 */
export function getRecetas(goal, dietStyle, limit = 3) {
  const matched = knowledge.recetas.filter(
    r => r.objetivos.includes(goal) && r.dietas.includes(dietStyle)
  );
  // Si no hay suficientes, amplía solo por objetivo
  if (matched.length < limit) {
    const ids = new Set(matched.map(r => r.id));
    const byGoal = knowledge.recetas.filter(
      r => !ids.has(r.id) && r.objetivos.includes(goal)
    );
    return [...matched, ...byGoal].slice(0, limit);
  }
  return matched.slice(0, limit);
}

export const MOMENTO_LABEL = {
  desayuno: "🌅 Desayuno",
  almuerzo: "☀️ Almuerzo",
  cena: "🌙 Cena",
  "pre-entreno": "⚡ Pre-entreno",
  "post-entreno": "💪 Post-entreno",
  snack: "🍎 Snack",
};
