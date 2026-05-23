import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getIncidents } from "../services/incidentService";
import { assignTask } from "../services/taskService";

const { width, height } = Dimensions.get("window");

type Incident = {
  _id: string;
  disasterType: string;
  severity: string;
  resources: string;
  status: string;
  latitude?: number;
  longitude?: number;
};

export default function Dashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const particles = Array.from({ length: 10 });

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const data = await getIncidents();
      setIncidents(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadIncidents();
  };

  const getSeverityColor = (severity: string) => {
    const value = severity?.toUpperCase();

    if (value === "CRITICAL") return "#ff0000";
    if (value === "HIGH") return "#ff3b3b";
    if (value === "MEDIUM") return "#ff9f1c";
    return "#06d6a0";
  };

  const getTaskTitle = (incident: Incident) => {
    const type = incident.disasterType?.toLowerCase();

    if (type?.includes("medical")) return "Emergency Medical Response";
    if (type?.includes("fire")) return "Fire Rescue Deployment";
    if (type?.includes("collapse")) return "Search & Rescue Operation";
    if (type?.includes("flood")) return "Flood Rescue & Relief Support";

    return "Emergency Field Response";
  };

  const handleAssignToTeam = async (
    incident: Incident,
    volunteerName: string,
    volunteerType: string
  ) => {
    try {
      await assignTask({
        incidentId: incident._id,
        volunteerName,
        volunteerType,
        taskTitle: getTaskTitle(incident),
        severity: incident.severity,
        latitude: incident.latitude,
        longitude: incident.longitude,
      });

      Alert.alert(
        "Team Dispatched",
        `${getTaskTitle(incident)} assigned to ${volunteerName}`
      );

      loadIncidents();
    } catch (error) {
      console.log(error);
      Alert.alert("Dispatch Failed", "Could not dispatch this team.");
    }
  };

  const openAssignMenu = (incident: Incident) => {
    if (incident.status?.toUpperCase() === "ASSIGNED") {
      Alert.alert(
        "Team Already Dispatched",
        "This incident is already assigned."
      );
      return;
    }

    Alert.alert("Dispatch Response Team", "Choose a volunteer / NGO team", [
      {
        text: "Rescue Team Alpha",
        onPress: () =>
          handleAssignToTeam(
            incident,
            "Rescue Team Alpha",
            "Volunteer Rescue Team"
          ),
      },
      {
        text: "Medical Unit Bravo",
        onPress: () =>
          handleAssignToTeam(
            incident,
            "Medical Unit Bravo",
            "NGO Medical Team"
          ),
      },
      {
        text: "Fire Response Unit",
        onPress: () =>
          handleAssignToTeam(
            incident,
            "Fire Response Unit",
            "Emergency Volunteer Team"
          ),
      },
      {
        text: "NGO Relief Squad",
        onPress: () =>
          handleAssignToTeam(
            incident,
            "NGO Relief Squad",
            "NGO Relief Team"
          ),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const visibleIncidents = incidents.filter(
    (item) => item.status?.toUpperCase() !== "RESOLVED"
  );

  const activeCount = visibleIncidents.length;

  const highPriorityCount = visibleIncidents.filter(
    (item) =>
      item.severity?.toUpperCase() === "HIGH" ||
      item.severity?.toUpperCase() === "CRITICAL"
  ).length;

  const openCount = visibleIncidents.length;

  const severityRank = {
    CRITICAL: 1,
    HIGH: 2,
    MEDIUM: 3,
    LOW: 4,
  };

  const sortedIncidents = [...visibleIncidents].sort((a, b) => {
    const aRank =
      severityRank[a.severity?.toUpperCase() as keyof typeof severityRank] || 5;

    const bRank =
      severityRank[b.severity?.toUpperCase() as keyof typeof severityRank] || 5;

    return aRank - bRank;
  });

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

      {particles.map((_, i) => (
        <MotiView
          key={i}
          from={{
            opacity: 0.12,
            translateY: height,
          }}
          animate={{
            opacity: 0.7,
            translateY: -80,
          }}
          transition={{
            loop: true,
            duration: 5000 + i * 350,
            delay: i * 250,
          }}
          style={{
            position: "absolute",
            width: 3 + (i % 5),
            height: 3 + (i % 5),
            borderRadius: 999,
            backgroundColor: "#ff2d2d",
            left: (width / 10) * i,
          }}
        />
      ))}

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 55 }}>
        <TouchableOpacity
          onPress={() => router.replace("/login" as any)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#ff5c5c" />
          <Text
            style={{
              color: "#ff5c5c",
              marginLeft: 8,
              fontWeight: "900",
            }}
          >
            Back
          </Text>
        </TouchableOpacity>

        <MotiView
          from={{ opacity: 0, translateY: -25 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 800 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 22,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 30,
                  fontWeight: "900",
                  letterSpacing: 1,
                }}
              >
                COMMAND CENTER
              </Text>

              <Text
                style={{
                  color: "#999",
                  marginTop: 6,
                  letterSpacing: 0.7,
                }}
              >
                ReliefChain live incident dashboard
              </Text>
            </View>

            <TouchableOpacity
              onPress={loadIncidents}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "rgba(255,255,255,0.08)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={24}
                color="#ff5c5c"
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <MetricCard
              label="ACTIVE"
              value={String(activeCount)}
              icon="alert-circle"
            />
            <MetricCard
              label="PRIORITY"
              value={String(highPriorityCount)}
              icon="fire-alert"
            />
            <MetricCard
              label="OPEN"
              value={String(openCount)}
              icon="access-point-network"
            />
          </View>

          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 850 }}
            style={{
              backgroundColor: "rgba(255,0,0,0.12)",
              borderRadius: 24,
              padding: 18,
              borderWidth: 1,
              borderColor: "rgba(255,80,80,0.25)",
              marginBottom: 18,
            }}
          >
            <Text
              style={{
                color: "#ff5c5c",
                fontWeight: "900",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              ACTIVE DISASTER RESPONSE
            </Text>

            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "800",
              }}
            >
              {highPriorityCount > 0
                ? `${highPriorityCount} high-priority incidents need attention`
                : "No high-priority incident detected"}
            </Text>

            <Text style={{ color: "#aaa", marginTop: 8, lineHeight: 20 }}>
              Offline reports and live backend incidents are displayed here for
              coordinator action.
            </Text>
          </MotiView>
        </MotiView>

        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <QuickAction
            title="Teams"
            icon="account-group"
            onPress={() =>
              Alert.alert(
                "Response Teams",
                "Dispatch teams directly from incident cards below."
              )
            }
          />

          <QuickAction
            title="Queue"
            icon="sync"
            onPress={() => router.push("/offlineQueue" as any)}
          />

          <QuickAction
            title="Map"
            icon="map"
            onPress={() => router.push("/tacticalMap" as any)}
          />
        </View>

        {loading ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator color="#ff4b4b" size="large" />
            <Text style={{ color: "#aaa", marginTop: 14 }}>
              Loading live incidents...
            </Text>
          </View>
        ) : (
          <FlatList
            data={sortedIncidents}
            keyExtractor={(item, index) => item._id || String(index)}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#ff4b4b"
              />
            }
            ListEmptyComponent={
              <View
                style={{
                  alignItems: "center",
                  marginTop: 50,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  padding: 24,
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <MaterialCommunityIcons
                  name="shield-check"
                  size={44}
                  color="#06d6a0"
                />
                <Text
                  style={{
                    color: "white",
                    fontWeight: "900",
                    fontSize: 18,
                    marginTop: 14,
                  }}
                >
                  No active incidents
                </Text>
                <Text
                  style={{
                    color: "#aaa",
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  Resolved incidents are hidden from the active command list.
                </Text>
              </View>
            }
            renderItem={({ item, index }) => (
              <MotiView
                from={{ opacity: 0, translateY: 25 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: "timing",
                  duration: 500,
                  delay: index * 80,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/incidentDetails",
                      params: {
                        disasterType: item.disasterType,
                        severity: item.severity,
                        resources: item.resources,
                      },
                    })
                  }
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderRadius: 24,
                    padding: 18,
                    marginBottom: 14,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.1)",
                    shadowColor: "#ff0000",
                    shadowOpacity: 0.18,
                    shadowRadius: 18,
                    elevation: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 22,
                          backgroundColor: "rgba(255,0,0,0.14)",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 12,
                        }}
                      >
                        <MaterialCommunityIcons
                          name="alert-decagram"
                          size={25}
                          color="#ff5c5c"
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: "white",
                            fontSize: 18,
                            fontWeight: "900",
                          }}
                        >
                          {item.disasterType || "Unknown Incident"}
                        </Text>
                        <Text style={{ color: "#999", marginTop: 3 }}>
                          {item.status?.toUpperCase() === "ASSIGNED"
                            ? "TEAM DISPATCHED"
                            : item.status || "OPEN"}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        backgroundColor: `${getSeverityColor(item.severity)}22`,
                        paddingVertical: 7,
                        paddingHorizontal: 10,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: getSeverityColor(item.severity),
                      }}
                    >
                      <Text
                        style={{
                          color: getSeverityColor(item.severity),
                          fontWeight: "900",
                          fontSize: 11,
                        }}
                      >
                        {item.severity || "LOW"}
                      </Text>
                    </View>
                  </View>

                  <Text style={{ color: "#ccc", lineHeight: 21 }}>
                    Resources Needed: {item.resources || "Not specified"}
                  </Text>

                  <TouchableOpacity
                    onPress={() => openAssignMenu(item)}
                    disabled={item.status?.toUpperCase() === "ASSIGNED"}
                    style={{
                      marginTop: 16,
                      backgroundColor:
                        item.status?.toUpperCase() === "ASSIGNED"
                          ? "rgba(6,214,160,0.16)"
                          : "rgba(255,0,0,0.2)",
                      paddingVertical: 12,
                      borderRadius: 16,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor:
                        item.status?.toUpperCase() === "ASSIGNED"
                          ? "rgba(6,214,160,0.5)"
                          : "rgba(255,80,80,0.35)",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          item.status?.toUpperCase() === "ASSIGNED"
                            ? "#06d6a0"
                            : "white",
                        fontWeight: "900",
                      }}
                    >
                      {item.status?.toUpperCase() === "ASSIGNED"
                        ? "TEAM DISPATCHED"
                        : "DISPATCH TEAM"}
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={{
                      color: "#ff5c5c",
                      marginTop: 12,
                      fontWeight: "800",
                    }}
                  >
                    Tap to inspect report →
                  </Text>
                </TouchableOpacity>
              </MotiView>
            )}
          />
        )}
      </View>
    </View>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: 14,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
      }}
    >
      <MaterialCommunityIcons name={icon} size={22} color="#ff5c5c" />
      <Text
        style={{
          color: "white",
          fontSize: 22,
          fontWeight: "900",
          marginTop: 8,
        }}
      >
        {value}
      </Text>
      <Text
        style={{ color: "#999", fontSize: 11, fontWeight: "800", marginTop: 3 }}
      >
        {label}
      </Text>
    </View>
  );
}

function QuickAction({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.09)", "rgba(255,0,0,0.12)"]}
        style={{
          paddingVertical: 16,
          alignItems: "center",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
          borderRadius: 20,
        }}
      >
        <MaterialCommunityIcons name={icon} size={24} color="#ff5c5c" />
        <Text
          style={{
            color: "white",
            fontWeight: "900",
            marginTop: 8,
            fontSize: 12,
          }}
        >
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}