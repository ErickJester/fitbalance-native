import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Field, Label, Input, ChoiceBtn, Card } from "../components/ui";

const DIET_OPTIONS = [
  { value: "excellent", label: "Muy saludable (sin procesados)" },
  { value: "good",      label: "Saludable (pocos procesados)" },
  { value: "average",   label: "Promedio (mixta)" },
  { value: "poor",      label: "Poco saludable (frecuente comida rápida)" },
  { value: "junk",      label: "Alta en ultra-procesados" },
];

export default function StepRutina({ data, set }) {
  return (
    <Card>
      <Text style={styles.title}>Tu rutina</Text>

      <Field>
        <Label>Calidad de tu dieta actual</Label>
        {DIET_OPTIONS.map(o => (
          <ChoiceBtn
            key={o.value}
            selected={data.dietStyle === o.value}
            onPress={() => set("dietStyle", o.value)}
          >
            {o.label}
          </ChoiceBtn>
        ))}
      </Field>

      <Field>
        <Label>Días de gym por semana</Label>
        <View style={styles.daysRow}>
          {[0, 1, 2, 3, 4, 5, 6].map(d => (
            <View key={d} style={styles.dayBtn}>
              <ChoiceBtn
                selected={data.gymDays === String(d)}
                onPress={() => set("gymDays", String(d))}
              >
                {String(d)}
              </ChoiceBtn>
            </View>
          ))}
        </View>
      </Field>

      <Field>
        <Label>Minutos por sesión</Label>
        <Input
          value={data.gymMinutes}
          onChange={v => set("gymMinutes", v)}
          placeholder="min"
        />
      </Field>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  dayBtn: {
    width: 44,
  },
});
