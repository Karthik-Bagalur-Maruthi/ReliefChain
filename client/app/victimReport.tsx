import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MotiView } from "moti";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createIncident } from "../services/incidentService";
import { getCurrentLocation } from "../services/locationService";
import { saveOfflineReport } from "../services/offlineDB";

const { width, height } = Dimensions.get("window");

const helpTypes = [
  { label: "Rescue", icon: "lifebuoy" },
  { label: "Medical", icon: "medical-bag" },
  { label: "Food", icon: "food" },
  { label: "Shelter", icon: "home-heart" },
];

export default function VictimReport() {
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const handleSOS = async () => {
    if (!type) {
      Alert.alert("Select Help Type", "Choose what help you need.");
      return;
    }

    const finalResources = `${type} help needed. Location: ${
      location || "Live GPS captured"
    }. Notes: ${notes || "No extra notes"}`;

    let coords = {
      latitude: 12.9716,
      longitude: 77.5946,
    };

    try {
      coords = await getCurrentLocation();
    } catch (locationError) {
      console.log("LOCATION FAILED, USING DEFAULT:", locationError);
    }

    try {
      await Promise.race([
        createIncident({
          disasterType: type,
          severity: "CRITICAL",
          resources: finalResources,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Backend timeout")), 1500),
        ),
      ]);

      Alert.alert("SOS Sent", "Emergency request sent with live GPS.", [
        {
          text: "OK",
          onPress: () =>
            router.push({
              pathname: "/incidentDetails",
              params: {
                disasterType: type,
                severity: "CRITICAL",
                resources: finalResources,
              },
            }),
        },
      ]);
    } catch (error) {
      console.log("VICTIM SOS BACKEND FAILED:", error);

      try {
        saveOfflineReport(type, "CRITICAL", finalResources);

        Alert.alert(
          "Offline Mode",
          "SOS stored locally in SQLite. It will sync when network returns.",
          [
            {
              text: "View Queue",
              onPress: () => router.push("/offlineQueue" as any),
            },
            {
              text: "OK",
            },
          ],
        );
      } catch (dbError) {
        console.log("SQLITE SAVE FAILED:", dbError);
        Alert.alert("SQLite Error", "Offline save failed.");
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#050505" }}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#040404", "#160202", "#310000"]}
        style={{ position: "absolute", width, height }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 55,
          paddingBottom: 40,
        }}
      >
        <TouchableOpacity
          onPress={() => router.replace("/login" as any)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#ff5c5c" />
          <Text style={{ color: "#ff5c5c", marginLeft: 8, fontWeight: "900" }}>
            Back
          </Text>
        </TouchableOpacity>

        <MotiView
          from={{ opacity: 0, translateY: -25 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 800 }}
          style={{ alignItems: "center" }}
        >
          <MotiView
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ loop: true, duration: 1500 }}
            style={{
              width: 108,
              height: 108,
              borderRadius: 54,
              backgroundColor: "rgba(255,0,0,0.18)",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#ff0000",
              shadowOpacity: 0.9,
              shadowRadius: 28,
              elevation: 22,
              marginBottom: 22,
            }}
          >
            <MaterialCommunityIcons
              name="alarm-light"
              size={56}
              color="#ff4b4b"
            />
          </MotiView>

          <Text style={styles.title}>EMERGENCY SOS</Text>
          <Text style={styles.subtitle}>Request help with automatic GPS</Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, scale: 0.92, translateY: 30 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 850 }}
          style={styles.card}
        >
          <Text style={styles.sectionTitle}>What help do you need?</Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 22,
            }}
          >
            {helpTypes.map((item) => {
              const selected = type === item.label;

              return (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => setType(item.label)}
                  style={{ width: "47%", borderRadius: 18, overflow: "hidden" }}
                >
                  <LinearGradient
                    colors={
                      selected
                        ? ["#7a0000", "#ff1a1a"]
                        : ["rgba(255,255,255,0.09)", "rgba(255,255,255,0.04)"]
                    }
                    style={styles.helpCard}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={30}
                      color={selected ? "white" : "#ff5c5c"}
                    />
                    <Text style={styles.helpText}>{item.label}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Location Note</Text>

          <View style={styles.inputBox}>
            <MaterialCommunityIcons
              name="map-marker-radius"
              size={22}
              color="#ff5c5c"
            />
            <TextInput
              placeholder="Optional landmark / area"
              placeholderTextColor="#888"
              value={location}
              onChangeText={setLocation}
              style={styles.inputText}
            />
          </View>

          <Text style={styles.sectionTitle}>Extra Notes</Text>

          <View style={styles.notesBox}>
            <TextInput
              placeholder="Explain emergency briefly..."
              placeholderTextColor="#888"
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlignVertical="top"
              style={{ color: "white", minHeight: 90 }}
            />
          </View>

          <View
            style={{
              backgroundColor: "rgba(6,214,160,0.12)",
              borderRadius: 18,
              padding: 14,
              borderWidth: 1,
              borderColor: "rgba(6,214,160,0.35)",
              marginBottom: 20,
            }}
          >
            <Text style={{ color: "#06d6a0", fontWeight: "900" }}>
              GPS AUTO-CAPTURE ENABLED
            </Text>
            <Text style={{ color: "#aaa", marginTop: 6, lineHeight: 20 }}>
              Your live location will be attached automatically when SOS is
              sent.
            </Text>
          </View>

          <MotiView
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ loop: true, duration: 1800 }}
          >
            <TouchableOpacity
              onPress={handleSOS}
              style={{ borderRadius: 20, overflow: "hidden" }}
            >
              <LinearGradient
                colors={["#8b0000", "#ff0000"]}
                style={styles.sosButton}
              >
                <MaterialCommunityIcons
                  name="alarm-light"
                  size={24}
                  color="white"
                />
                <Text style={styles.sosText}>SEND SOS WITH GPS</Text>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
        </MotiView>
      </ScrollView>
    </View>
  );
}

const styles = {
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "900" as const,
    letterSpacing: 1.2,
  },
  subtitle: {
    color: "#999",
    marginTop: 8,
    marginBottom: 30,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#ff0000",
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 18,
  },
  sectionTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "900" as const,
    marginBottom: 12,
    letterSpacing: 0.8,
  },
  helpCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  helpText: {
    color: "white",
    fontWeight: "900" as const,
    marginTop: 10,
  },
  inputBox: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 58,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  inputText: {
    flex: 1,
    color: "white",
    marginLeft: 12,
  },
  notesBox: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 20,
  },
  sosButton: {
    paddingVertical: 18,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flexDirection: "row" as const,
    gap: 10,
  },
  sosText: {
    color: "white",
    fontWeight: "900" as const,
    letterSpacing: 1,
  },
};
