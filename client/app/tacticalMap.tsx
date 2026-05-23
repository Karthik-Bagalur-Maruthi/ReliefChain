import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Dimensions,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function TacticalMapWebFallback() {
  return (
    <View style={{ flex: 1, backgroundColor: "#050505" }}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#040404", "#120202", "#2b0000"]}
        style={{
          position: "absolute",
          width,
          height,
        }}
      />

      <View
        style={{
          flex: 1,
          padding: 24,
          paddingTop: 55,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => router.replace("/dashboard" as any)}
          style={{
            position: "absolute",
            top: 55,
            left: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#ff5c5c" />
          <Text style={{ color: "#ff5c5c", marginLeft: 8, fontWeight: "900" }}>
            Back
          </Text>
        </TouchableOpacity>

        <MaterialCommunityIcons name="map-marker-alert" size={70} color="#ff5c5c" />

        <Text
          style={{
            color: "white",
            fontSize: 30,
            fontWeight: "900",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          TACTICAL MAP
        </Text>

        <Text
          style={{
            color: "#aaa",
            textAlign: "center",
            marginTop: 14,
            lineHeight: 22,
            maxWidth: 420,
          }}
        >
          Live GPS and native map visualization are available on Android/iOS.
          Use Expo Go on mobile to view incident markers, assigned teams, and
          disaster zones.
        </Text>
      </View>
    </View>
  );
}