import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList,
} from "react-native";
import { colors, radius } from "../components/theme";

const { width } = Dimensions.get("window");

const SLIDES = [
  { icon: "🏋️", title: "Rutina personalizada según tu gym", desc: "Generamos tu plan con exactamente el equipo que tienes disponible. Sin excusas." },
  { icon: "⏱️", title: "Macros calculados en minutos", desc: "TDEE, proteína, carbos y grasas ajustados a tu objetivo. Ciencia, no suposiciones." },
  { icon: "📅", title: "Plan semanal listo para usar", desc: "Día a día, ejercicio por ejercicio. Adaptado a cuántos días puedes ir al gym." },
  { icon: "🍽️", title: "Recetas y consejos de nutrición", desc: "Sugerencias prácticas de comida alineadas con tu objetivo y calidad de dieta." },
];

export default function SplashScreen({ onStart }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % SLIDES.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(timerRef.current);
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.slideIcon}>
        <Text style={styles.slideIconText}>{item.icon}</Text>
      </View>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideDesc}>{item.desc}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.bgCircle} />

      <View style={styles.hero}>
        <View style={styles.logoRing}>
          <Text style={styles.logoIcon}>🏋️</Text>
        </View>
        <Text style={styles.appName}>
          Fit<Text style={styles.appNameAccent}>Balance</Text>
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        style={styles.carousel}
      />

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.ctaSection}>
        <TouchableOpacity style={styles.btnPrimary} onPress={onStart} activeOpacity={0.8}>
          <Text style={styles.btnPrimaryText}>Comenzar</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>tu plan fitness personalizado</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.btnOutline} onPress={onStart} activeOpacity={0.7}>
          <Text style={styles.btnOutlineText}>Ya tengo un plan guardado</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Toda la información se guarda localmente en tu dispositivo.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: 28,
  },
  bgCircle: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.primary,
    opacity: 0.07,
    top: -70,
    right: -70,
  },
  hero: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
  },
  logoRing: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 36,
  },
  appName: {
    fontSize: 24,
    fontWeight: "500",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  appNameAccent: {
    color: colors.primary,
  },
  carousel: {
    flexGrow: 0,
  },
  slide: {
    width: width,
    paddingHorizontal: 40,
    alignItems: "center",
    gap: 12,
  },
  slideIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  slideIconText: {
    fontSize: 30,
  },
  slideTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 20,
  },
  slideDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
    maxWidth: 240,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    paddingVertical: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  ctaSection: {
    paddingHorizontal: 24,
    gap: 12,
  },
  btnPrimary: {
    width: "100%",
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  btnPrimaryText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "500",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  btnOutline: {
    width: "100%",
    padding: 13,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    alignItems: "center",
  },
  btnOutlineText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  footer: {
    textAlign: "center",
    fontSize: 11,
    color: colors.textSecondary,
    paddingHorizontal: 24,
    paddingTop: 14,
    lineHeight: 18,
  },
});
