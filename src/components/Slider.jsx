import React, { useState, useRef } from "react";
import { View, Text, PanResponder, StyleSheet, LayoutAnimation } from "react-native";
import { colors } from "./theme";

export default function Slider({ value, min, max, step = 1, onChange }) {
  const [trackWidth, setTrackWidth] = useState(0);
  const fraction = (value - min) / (max - min);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => handleTouch(e),
      onPanResponderMove: (e) => handleTouch(e),
    })
  ).current;

  function handleTouch(e) {
    if (!trackWidth) return;
    const x = e.nativeEvent.locationX;
    const raw = min + ((x / trackWidth) * (max - min));
    const stepped = Math.round(raw / step) * step;
    const clamped = Math.max(min, Math.min(max, stepped));
    if (clamped !== value) onChange(clamped);
  }

  return (
    <View>
      <View style={styles.row}>
        <View
          style={styles.track}
          onLayout={e => setTrackWidth(e.nativeEvent.layout.width)}
          {...panResponder.panHandlers}
        >
          <View style={[styles.fill, { width: `${fraction * 100}%` }]} />
          <View style={[styles.thumb, { left: `${fraction * 100}%` }]} />
        </View>
        <Text style={styles.val}>{value} min</Text>
      </View>
      <View style={styles.labels}>
        <Text style={styles.labelText}>{min} min</Text>
        <Text style={styles.labelText}>{max} min</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 99,
    justifyContent: "center",
    position: "relative",
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 99,
  },
  thumb: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: "#ffffff",
    marginLeft: -10,
    top: -7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  val: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.primary,
    minWidth: 52,
    textAlign: "right",
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  labelText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});
