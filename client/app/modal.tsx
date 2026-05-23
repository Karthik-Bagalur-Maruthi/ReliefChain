import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { MotiView } from "moti";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#040404", "#120202", "#2b0000"]}
        style={{
          position: "absolute",
          width,
          height,
        }}
      />

      <MotiView
        from={{ opacity: 0, scale: 0.9, translateY: 30 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 800 }}
        style={styles.card}
      >
        <MotiView
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ loop: true, duration: 1800 }}
          style={styles.iconBox}
        >
          <MaterialCommunityIcons
            name="shield-alert"
            size={46}
            color="#ff4b4b"
          />
        </MotiView>

        <Text style={styles.title}>RELIEFCHAIN ALERT</Text>

        <Text style={styles.subtitle}>
          Emergency modal console is active. Use this space for critical system
          alerts, confirmations, or offline sync notices.
        </Text>

        <Link href="/" dismissTo asChild>
          <TouchableOpacity style={styles.buttonWrapper}>
            <LinearGradient
              colors={["#7a0000", "#ff1a1a"]}
              style={styles.button}
            >
              <Text style={styles.buttonText}>RETURN TO HOME</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Link>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 28,
    padding: 26,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#ff0000",
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 18,
  },
  iconBox: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(255,0,0,0.14)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ff0000",
    shadowOpacity: 0.8,
    shadowRadius: 22,
    elevation: 18,
    marginBottom: 22,
  },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 26,
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
  },
  button: {
    paddingVertical: 17,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "900",
    letterSpacing: 1,
  },
});
