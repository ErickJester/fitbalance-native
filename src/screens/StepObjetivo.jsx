import React from "react";
import { Text, StyleSheet } from "react-native";
import { ChoiceBtn, Card, Field } from "../components/ui";

const GOAL_OPTIONS = [
  { value: "lose",     label: "Perder grasa" },
  { value: "muscle",   label: "Ganar músculo" },
  { value: "maintain", label: "Mantenerme" },
  { value: "health",   label: "Mejorar salud general" },
];

export default function StepObjetivo({ data, set }) {
  return (
    <Card>
      <Text style={styles.title}>¿Cuál es tu objetivo?</Text>
      <Field>
        {GOAL_OPTIONS.map(o => (
          <ChoiceBtn
            key={o.value}
            selected={data.goal === o.value}
            onPress={() => set("goal", o.value)}
          >
            {o.label}
          </ChoiceBtn>
        ))}
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
});
