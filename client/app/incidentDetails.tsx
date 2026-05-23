import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function IncidentDetails() {
  const { disasterType, severity, resources } = useLocalSearchParams();

  const getSeverityColor = () => {
    if (severity === "CRITICAL") return "#ff0000";
    if (severity === "HIGH") return "#ff3b3b";
    if (severity === "MEDIUM") return "#ff8c00";
    return "#06d6a0";
  };

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 55,
          paddingBottom: 50,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 26,
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#ff5c5c" />
          <Text style={{ color: "#ff5c5c", marginLeft: 8, fontWeight: "800" }}>
            Back
          </Text>
        </TouchableOpacity>

        <MotiView
          from={{ opacity: 0, translateY: -25 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 800 }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 30,
              fontWeight: "900",
              letterSpacing: 1,
            }}
          >
            INCIDENT DETAILS
          </Text>

          <Text
            style={{
              color: "#999",
              marginTop: 8,
              marginBottom: 28,
              letterSpacing: 0.8,
            }}
          >
            Emergency Response Snapshot
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, scale: 0.9, translateY: 30 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 900 }}
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: 28,
            padding: 22,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.12)",
            shadowColor: "#ff0000",
            shadowOpacity: 0.35,
            shadowRadius: 30,
            elevation: 18,
          }}
        >
          <View
            style={{
              alignItems: "center",
              marginBottom: 28,
            }}
          >
            <MotiView
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{
                loop: true,
                duration: 1800,
              }}
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: "rgba(255,0,0,0.15)",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#ff0000",
                shadowOpacity: 0.8,
                shadowRadius: 22,
                elevation: 18,
              }}
            >
              <MaterialCommunityIcons
                name="alert-decagram"
                size={48}
                color="#ff4b4b"
              />
            </MotiView>

            <Text
              style={{
                color: "white",
                fontSize: 22,
                fontWeight: "900",
                marginTop: 18,
              }}
            >
              REPORT RECEIVED
            </Text>

            <Text
              style={{
                color: "#aaa",
                marginTop: 6,
              }}
            >
              Awaiting coordinator response
            </Text>
          </View>

          <DetailRow
            icon="alert-circle-outline"
            label="Disaster Type"
            value={String(disasterType || "Not provided")}
          />

          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 18,
              padding: 16,
              marginBottom: 14,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="signal-cellular-3"
                size={24}
                color={getSeverityColor()}
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text
                  style={{ color: "#999", fontSize: 12, fontWeight: "700" }}
                >
                  Severity
                </Text>
                <Text
                  style={{
                    color: getSeverityColor(),
                    fontSize: 20,
                    fontWeight: "900",
                    marginTop: 4,
                  }}
                >
                  {String(severity || "Not provided")}
                </Text>
              </View>
            </View>
          </View>

          <DetailRow
            icon="package-variant"
            label="Resources Needed"
            value={String(resources || "Not provided")}
          />

          <View
            style={{
              marginTop: 10,
              backgroundColor: "rgba(255,0,0,0.1)",
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor: "rgba(255,80,80,0.25)",
            }}
          >
            <Text
              style={{
                color: "#ff5c5c",
                fontWeight: "900",
                marginBottom: 8,
              }}
            >
              SYSTEM STATUS
            </Text>

            <Text style={{ color: "#ddd", lineHeight: 22 }}>
              Incident has been logged into ReliefChain. If the network is
              unstable, this report can be queued and synced once connectivity
              returns.
            </Text>
          </View>
        </MotiView>

        <MotiView
          animate={{ scale: [1, 1.025, 1] }}
          transition={{ loop: true, duration: 2200 }}
          style={{ marginTop: 26 }}
        >
          <TouchableOpacity
            onPress={() => router.replace("/login" as any)}
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
                }}
              >
                BACK TO HOME
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.06)",
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MaterialCommunityIcons name={icon} size={24} color="#ff5c5c" />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ color: "#999", fontSize: 12, fontWeight: "700" }}>
            {label}
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "900",
              marginTop: 4,
            }}
          >
            {value}
          </Text>
        </View>
      </View>
    </View>
  );
}