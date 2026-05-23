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

const incidentTypes = [
  { label: "Flood", icon: "waves", value: "Flood" },
  { label: "Fire", icon: "fire-alert", value: "Fire" },
  { label: "Medical", icon: "medical-bag", value: "Medical" },
  { label: "Collapse", icon: "home-alert", value: "Collapse" },
];

const severityLevels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function Incident() {
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState("");
  const [resources, setResources] = useState("");
  const [description, setDescription] = useState("");

  const [gpsLocked, setGpsLocked] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const particles = Array.from({ length: 12 });

  const handleGPSLock = async () => {
    try {
      const coords = await getCurrentLocation();

      setLatitude(coords.latitude);
      setLongitude(coords.longitude);
      setGpsLocked(true);

      Alert.alert("GPS Locked", "Live location captured successfully.");
    } catch (error) {
      console.log("GPS ERROR:", error);
      Alert.alert(
        "GPS Failed",
        "Could not access location. Please allow location permission."
      );
    }
  };

  const handlePhotoEvidence = () => {
    Alert.alert(
      "Photo Evidence",
      "Photo capture and offline image sync are planned for the next version."
    );
  };

  const handleSubmit = async () => {
    if (!type || !severity || !resources) {
      Alert.alert(
        "Missing Info",
        "Select incident type, severity, and resources."
      );
      return;
    }

    let finalLatitude = latitude;
    let finalLongitude = longitude;

    if (!gpsLocked || finalLatitude === null || finalLongitude === null) {
      try {
        const coords = await getCurrentLocation();
        finalLatitude = coords.latitude;
        finalLongitude = coords.longitude;
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
        setGpsLocked(true);
      } catch (locationError) {
        console.log("LOCATION FAILED, USING DEFAULT:", locationError);
        finalLatitude = 12.9716;
        finalLongitude = 77.5946;
      }
    }

    const finalResources = description
      ? `${resources}. Notes: ${description}`
      : resources;

    try {
      await Promise.race([
        createIncident({
          disasterType: type,
          severity,
          resources: finalResources,
          latitude: finalLatitude,
          longitude: finalLongitude,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Backend timeout")), 4000)
        ),
      ]);

      Alert.alert("Success", "Incident Reported with GPS location", [
        {
          text: "OK",
          onPress: () =>
            router.push({
              pathname: "/incidentDetails",
              params: {
                disasterType: type,
                severity,
                resources: finalResources,
              },
            }),
        },
      ]);

      setType("");
      setSeverity("");
      setResources("");
      setDescription("");
      setGpsLocked(false);
      setLatitude(null);
      setLongitude(null);
    } catch (error) {
      console.log("BACKEND FAILED, SAVING OFFLINE:", error);

      try {
        saveOfflineReport(type, severity, finalResources);

        Alert.alert(
          "Offline Saved",
          "Incident saved locally and will sync later.",
          [
            {
              text: "View Queue",
              onPress: () => router.push("/offlineQueue" as any),
            },
            {
              text: "OK",
            },
          ]
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
        colors={["#040404", "#130202", "#2b0000"]}
        style={{
          position: "absolute",
          width,
          height,
        }}
      />

      {particles.map((_, i) => (
        <MotiView
          key={i}
          from={{
            opacity: 0.15,
            translateY: height,
          }}
          animate={{
            opacity: 0.75,
            translateY: -80,
          }}
          transition={{
            loop: true,
            duration: 4500 + i * 350,
            delay: i * 180,
          }}
          style={{
            position: "absolute",
            width: 3 + (i % 5),
            height: 3 + (i % 5),
            borderRadius: 999,
            backgroundColor: "#ff2d2d",
            left: (width / 12) * i,
          }}
        />
      ))}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 55,
          paddingBottom: 40,
        }}
      >
        <MotiView
          from={{ opacity: 0, translateY: -30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 800 }}
        >
          <TouchableOpacity
            onPress={() => router.replace("/login" as any)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 22,
            }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#ff5c5c"
            />
            <Text
              style={{ color: "#ff5c5c", marginLeft: 8, fontWeight: "700" }}
            >
              Back
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: "white",
              fontSize: 30,
              fontWeight: "900",
              letterSpacing: 1,
            }}
          >
            INCIDENT REPORT
          </Text>

          <Text
            style={{
              color: "#999",
              marginTop: 8,
              marginBottom: 24,
              letterSpacing: 0.8,
            }}
          >
            Emergency Intake Console
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, scale: 0.92, translateY: 30 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 850 }}
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: 28,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.12)",
            shadowColor: "#ff0000",
            shadowOpacity: 0.35,
            shadowRadius: 30,
            elevation: 18,
          }}
        >
          <Text style={sectionTitle}>Disaster Type</Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 22,
            }}
          >
            {incidentTypes.map((item) => {
              const selected = type === item.value;

              return (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => setType(item.value)}
                  style={{
                    width: "47%",
                    borderRadius: 18,
                    overflow: "hidden",
                  }}
                >
                  <LinearGradient
                    colors={
                      selected
                        ? ["#7a0000", "#ff1a1a"]
                        : ["rgba(255,255,255,0.09)", "rgba(255,255,255,0.04)"]
                    }
                    style={{
                      padding: 16,
                      borderRadius: 18,
                      borderWidth: 1,
                      borderColor: selected
                        ? "rgba(255,80,80,0.9)"
                        : "rgba(255,255,255,0.08)",
                    }}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={28}
                      color={selected ? "white" : "#ff5c5c"}
                    />
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "800",
                        marginTop: 10,
                      }}
                    >
                      {item.label}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={sectionTitle}>Severity Level</Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 22,
            }}
          >
            {severityLevels.map((level) => {
              const selected = severity === level;

              return (
                <TouchableOpacity
                  key={level}
                  onPress={() => setSeverity(level)}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    borderRadius: 999,
                    backgroundColor: selected
                      ? "rgba(255, 0, 0, 0.9)"
                      : "rgba(255,255,255,0.07)",
                    borderWidth: 1,
                    borderColor: selected ? "#ff4b4b" : "rgba(255,255,255,0.1)",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "900",
                      fontSize: 12,
                      letterSpacing: 0.8,
                    }}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={sectionTitle}>Resources Needed</Text>

          <View style={inputBox}>
            <MaterialCommunityIcons
              name="package-variant"
              size={22}
              color="#ff5c5c"
            />
            <TextInput
              placeholder="Food, boat, ambulance, shelter..."
              placeholderTextColor="#888"
              value={resources}
              onChangeText={setResources}
              style={inputText}
            />
          </View>

          <Text style={sectionTitle}>Situation Notes</Text>

          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 18,
              padding: 14,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              marginBottom: 20,
            }}
          >
            <TextInput
              placeholder="Describe what happened..."
              placeholderTextColor="#888"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{
                color: "white",
                minHeight: 90,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <TouchableOpacity
              onPress={handleGPSLock}
              style={{
                flex: 1,
                backgroundColor: gpsLocked
                  ? "rgba(6,214,160,0.16)"
                  : "rgba(255,255,255,0.06)",
                borderRadius: 18,
                paddingVertical: 16,
                alignItems: "center",
                borderWidth: 1,
                borderColor: gpsLocked
                  ? "rgba(6,214,160,0.6)"
                  : "rgba(255,255,255,0.08)",
              }}
            >
              <MaterialCommunityIcons
                name={gpsLocked ? "map-marker-check" : "map-marker-radius"}
                size={24}
                color={gpsLocked ? "#06d6a0" : "#ff5c5c"}
              />
              <Text
                style={{
                  color: gpsLocked ? "#06d6a0" : "#ddd",
                  fontSize: 11,
                  fontWeight: "800",
                  marginTop: 8,
                }}
              >
                {gpsLocked ? "GPS LOCKED" : "GET GPS"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePhotoEvidence} style={miniAction}>
              <MaterialCommunityIcons name="camera" size={24} color="#ff5c5c" />
              <Text style={miniText}>Evidence</Text>
            </TouchableOpacity>
          </View>

          {gpsLocked && latitude !== null && longitude !== null && (
            <Text
              style={{
                color: "#06d6a0",
                fontSize: 12,
                marginBottom: 18,
                fontWeight: "800",
              }}
            >
              GPS: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </Text>
          )}

          <MotiView
            animate={{
              scale: [1, 1.025, 1],
            }}
            transition={{
              loop: true,
              duration: 2200,
            }}
          >
            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                borderRadius: 18,
                overflow: "hidden",
              }}
            >
              <LinearGradient
                colors={["#7a0000", "#ff1a1a"]}
                style={{
                  paddingVertical: 18,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "900",
                    letterSpacing: 1,
                    fontSize: 15,
                  }}
                >
                  DISPATCH REPORT
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
        </MotiView>
      </ScrollView>
    </View>
  );
}

const sectionTitle = {
  color: "white",
  fontSize: 15,
  fontWeight: "900" as const,
  marginBottom: 12,
  letterSpacing: 0.8,
};

const inputBox = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  backgroundColor: "rgba(255,255,255,0.06)",
  borderRadius: 18,
  paddingHorizontal: 14,
  height: 58,
  marginBottom: 22,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
};

const inputText = {
  flex: 1,
  color: "white",
  marginLeft: 12,
};

const miniAction = {
  flex: 1,
  backgroundColor: "rgba(255,255,255,0.06)",
  borderRadius: 18,
  paddingVertical: 16,
  alignItems: "center" as const,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
};

const miniText = {
  color: "#ddd",
  fontSize: 11,
  fontWeight: "800" as const,
  marginTop: 8,
};