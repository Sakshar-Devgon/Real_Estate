import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

export default function Splash() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const text1Opacity = useRef(new Animated.Value(0)).current;
  const text1Y = useRef(new Animated.Value(20)).current;
  const text2Opacity = useRef(new Animated.Value(0)).current;
  const text2Y = useRef(new Animated.Value(20)).current;
  const text3Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    SplashScreen.hideAsync();

    Animated.sequence([
      // Logo springs in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // "Kribb" slides up
      Animated.parallel([
        Animated.timing(text1Opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(text1Y, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
      // "Real Estate" slides up
      Animated.parallel([
        Animated.timing(text2Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(text2Y, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
      // Tagline fades in
      Animated.timing(text3Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      if (!isLoaded) return;
      router.replace(isSignedIn ? "/(root)/(tabs)" : "/sign-up");
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoaded]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{ opacity: logoOpacity, transform: [{ scale: logoScale }], marginBottom: 28 }}
      >
        <Image
          source={require("../assets/images/Kribb.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text
        style={[styles.appName, { opacity: text1Opacity, transform: [{ translateY: text1Y }] }]}
      >
        Kribb
      </Animated.Text>

      <Animated.Text
        style={[styles.subtitle, { opacity: text2Opacity, transform: [{ translateY: text2Y }] }]}
      >
        Real Estate
      </Animated.Text>

      <Animated.Text style={[styles.tagline, { opacity: text3Opacity }]}>
        ✦ Find your dream home today ✦
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 160,
    height: 160,
  },
  appName: {
    fontSize: 42,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#6B7280",
    letterSpacing: 4,
    textTransform: "uppercase",
    marginBottom: 32,
  },
  tagline: {
    fontSize: 13,
    color: "#9CA3AF",
    letterSpacing: 0.5,
  },
});
