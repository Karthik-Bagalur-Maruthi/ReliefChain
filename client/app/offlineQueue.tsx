import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { createIncident } from "../services/incidentService";
import { deleteOfflineReport, getOfflineReports } from "../services/offlineDB";

const { width, height } = Dimensions.get("window");

type OfflineReport = {
  id: number;
  disasterType: string;
  severity: string;
  resources: string;
};

export default function OfflineQueue() {
  const [reports, setReports] = useState<OfflineReport[]>([]);

  const loadReports = () => {
    const data = getOfflineReports() as OfflineReport[];
    setReports(data);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const syncReports = async () => {
    if (reports.length === 0) {
      Alert.alert("Queue Empty", "No offline reports to sync.");
      return;
    }

    try {
      for (const report of reports) {
        await createIncident({
          disasterType: report.disasterType,
          severity: report.severity,
          resources: report.resources,
        });

        deleteOfflineReport(report.id);
      }

      Alert.alert("Sync Complete", "All offline reports synced successfully.");
      loadReports();
    } catch (error) {
      console.log(error);
      Alert.alert("Sync Failed", "Network still unavailable. Try again later.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#050505" }}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#040404", "#120202", "#2b0000"]}
        style={{ position: "absolute", width, height }}
      />

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: 55,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => router.replace("/dashboard" as any)}
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

        <Text style={{ color: "white", fontSize: 30, fontWeight: "900" }}>
          OFFLINE QUEUE
        </Text>

        <Text style={{ color: "#999", marginTop: 8, marginBottom: 24 }}>
          SQLite-stored reports waiting for network sync
        </Text>

        <View
          style={{
            backgroundColor: "rgba(255,0,0,0.12)",
            borderRadius: 24,
            padding: 18,
            borderWidth: 1,
            borderColor: "rgba(255,80,80,0.25)",
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#ff5c5c", fontWeight: "900" }}>
            QUEUED REPORTS
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 34,
              fontWeight: "900",
              marginTop: 8,
            }}
          >
            {reports.length}
          </Text>
        </View>

        {reports.length === 0 ? (
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: 24,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <MaterialCommunityIcons
              name="cloud-check"
              size={48}
              color="#06d6a0"
            />
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "900",
                marginTop: 14,
              }}
            >
              Queue Empty
            </Text>
            <Text
              style={{
                color: "#aaa",
                textAlign: "center",
                marginTop: 8,
                lineHeight: 20,
              }}
            >
              No offline reports stored. If network fails during reporting,
              incidents will appear here.
            </Text>
          </View>
        ) : (
          reports.map((report) => (
            <View
              key={report.id}
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: 24,
                padding: 18,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "900",
                }}
              >
                {report.disasterType}
              </Text>

              <Text style={{ color: "#ff5c5c", marginTop: 8 }}>
                Severity: {report.severity}
              </Text>

              <Text style={{ color: "#aaa", marginTop: 8, lineHeight: 20 }}>
                Resources: {report.resources}
              </Text>

              <Text
                style={{
                  color: "#ff5c5c",
                  marginTop: 12,
                  fontWeight: "900",
                }}
              >
                STATUS: QUEUED IN SQLITE
              </Text>
            </View>
          ))
        )}

        <TouchableOpacity
          onPress={syncReports}
          style={{
            borderRadius: 18,
            overflow: "hidden",
            marginTop: 20,
          }}
        >
          <LinearGradient
            colors={["#7a0000", "#ff1a1a"]}
            style={{
              paddingVertical: 18,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "900" }}>
              SYNC QUEUED REPORTS
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
