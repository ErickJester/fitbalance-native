import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Field, Label, Input, ChoiceBtn, Card } from "../components/ui";
import { colors } from "../components/theme";

const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "Sedentario (sin ejercicio)" },
  { value: "light",     label: "Ligero (1-2 días/sem)" },
  { value: "moderate",  label: "Moderado (3-4 días/sem)" },
  { value: "active",    label: "Activo (5-6 días/sem)" },
  { value: "very",      label: "Muy activo (diario + trabajo físico)" },
];

export default function StepPerfil({ data, set }) {
  return (
    <Card>
      <Text style={styles.title}>Tu perfil</Text>

      <Field>
        <Label>Sexo</Label>
        <View style={styles.row}>
          {[["m", "Hombre"], ["f", "Mujer"]].map(([v, l]) => (
            <View key={v} style={styles.halfBtn}>
              <ChoiceBtn selected={data.sex === v} onPress={() => set("sex", v)}>
                {l}
              </ChoiceBtn>
            </View>
          ))}
        </View>
      </Field>

      <Field>
        <Label>Edad</Label>
        <Input value={data.age} onChange={v => set("age", v)} placeholder="años" />
      </Field>

      <Field>
        <Label>Peso (kg)</Label>
        <Input value={data.weight} onChange={v => set("weight", v)} placeholder="kg" />
      </Field>

      <Field>
        <Label>Estatura (cm)</Label>
        <Input value={data.height} onChange={v => set("height", v)} placeholder="cm" />
      </Field>

      <Field>
        <Label>Nivel de actividad general</Label>
        {ACTIVITY_OPTIONS.map(o => (
          <ChoiceBtn
            key={o.value}
            selected={data.physicalActivity === o.value}
            onPress={() => set("physicalActivity", o.value)}
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
  row: {
    flexDirection: "row",
    gap: 8,
  },
  halfBtn: {
    flex: 1,
  },
});
