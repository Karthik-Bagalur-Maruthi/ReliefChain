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
import { completeTask, getTasks } from "../services/taskService";

const { width, height } = Dimensions.get("window");

type Task = {
  _id: string;
  volunteerName: string;
  volunteerType: string;
  taskTitle: string;
  severity: string;
  status: string;
  latitude?: number;
  longitude?: number;
};

export default function VolunteerHome() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();

      console.log("VOLUNTEER TASKS:", data);

      setTasks(data || []);
    } catch (error) {
      console.log("LOAD TASKS ERROR:", error);
      Alert.alert("Error", "Could not load assigned tasks.");
    }
  };

  const handleComplete = async (taskId: string) => {
    try {
      await completeTask(taskId);
      Alert.alert("Response Updated", "Mission marked as completed.");
      loadTasks();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not update task status.");
    }
  };

  const getSeverityColor = (severity: string) => {
    const level = severity?.toUpperCase();

    if (level === "CRITICAL") return "#ff0000";
    if (level === "HIGH") return "#ff5c5c";
    if (level === "MEDIUM") return "#ff9f1c";
    return "#06d6a0";
  };

  const activeTasks = tasks.filter(
    (task) => task.status?.toUpperCase() !== "COMPLETED"
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#050505" }}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#040404", "#120202", "#2b0000"]}
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

        <Text style={styles.title}>VOLUNTEER HUB</Text>
        <Text style={styles.subtitle}>
          Real-time disaster assignment console
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>FIELD STATUS</Text>
          <Text style={styles.cardTitle}>
            {activeTasks.length > 0
              ? `${activeTasks.length} Active Assignment(s)`
              : "Awaiting Assignment"}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
          <QuickButton
            title="REPORT"
            icon="alert-plus"
            onPress={() => router.push("/incident" as any)}
          />
          <QuickButton
            title="LIVE MAP"
            icon="map-marker-radius"
            onPress={() => router.push("/tacticalMap" as any)}
          />
        </View>

        <Text style={styles.section}>ASSIGNED WORK</Text>

        {activeTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="clipboard-alert-outline"
              size={44}
              color="#ff5c5c"
            />

            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "900",
                marginTop: 14,
              }}
            >
              No active assignments
            </Text>

            <Text
              style={{
                color: "#aaa",
                textAlign: "center",
                marginTop: 8,
                lineHeight: 20,
              }}
            >
              Admin-assigned rescue tasks will appear here in real time.
            </Text>
          </View>
        ) : (
          activeTasks.map((task) => (
            <View key={task._id} style={styles.taskCard}>
              <Text style={styles.taskLabel}>TEAM</Text>
              <Text style={styles.teamName}>{task.volunteerName}</Text>

              <Text style={styles.taskTitle}>
                MISSION: {task.taskTitle}
              </Text>

              <Text style={styles.taskInfo}>
                Team Type: {task.volunteerType}
              </Text>

              <View
                style={{
                  marginTop: 8,
                  alignSelf: "flex-start",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: `${getSeverityColor(task.severity)}22`,
                  borderWidth: 1,
                  borderColor: getSeverityColor(task.severity),
                }}
              >
                <Text
                  style={{
                    color: getSeverityColor(task.severity),
                    fontWeight: "900",
                    fontSize: 11,
                  }}
                >
                  {task.severity}
                </Text>
              </View>

              <Text style={styles.taskInfo}>Status: {task.status}</Text>

              {task.latitude && task.longitude && (
                <Text style={styles.taskInfo}>
                  GPS: {task.latitude.toFixed(4)}, {task.longitude.toFixed(4)}
                </Text>
              )}

              <TouchableOpacity
                onPress={() => handleComplete(task._id)}
                style={styles.actionBtn}
              >
                <Text style={styles.actionText}>COMPLETE RESPONSE</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity onPress={loadTasks} style={styles.refreshBtn}>
          <Text style={styles.refreshText}>REFRESH ASSIGNMENTS</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function QuickButton({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
      <LinearGradient
        colors={["rgba(255,255,255,0.09)", "rgba(255,0,0,0.16)"]}
        style={{
          paddingVertical: 18,
          alignItems: "center",
          borderRadius: 20,
        }}
      >
        <MaterialCommunityIcons name={icon} size={28} color="#ff5c5c" />
        <Text style={{ color: "white", fontWeight: "900", marginTop: 8 }}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = {
  title: { color: "white", fontSize: 30, fontWeight: "900" as const },
  subtitle: { color: "#999", marginTop: 8, marginBottom: 20 },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 18,
    borderRadius: 24,
    marginBottom: 20,
  },
  cardLabel: { color: "#ff5c5c", fontWeight: "900" as const },
  cardTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "900" as const,
    marginTop: 8,
  },
  section: {
    color: "white",
    fontSize: 18,
    fontWeight: "900" as const,
    marginBottom: 14,
  },
  emptyCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 28,
    borderRadius: 24,
    marginBottom: 14,
    alignItems: "center" as const,
  },
  taskCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 18,
    borderRadius: 24,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,80,80,0.25)",
  },
  taskLabel: {
    color: "#ff5c5c",
    fontWeight: "900" as const,
    fontSize: 12,
  },
  teamName: {
    color: "white",
    fontSize: 20,
    fontWeight: "900" as const,
    marginTop: 6,
    marginBottom: 12,
  },
  taskTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "900" as const,
    marginBottom: 10,
  },
  taskInfo: {
    color: "#bbb",
    marginTop: 6,
  },
  actionBtn: {
    marginTop: 16,
    backgroundColor: "rgba(255,0,0,0.2)",
    padding: 14,
    borderRadius: 16,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: "rgba(255,80,80,0.35)",
  },
  actionText: {
    color: "white",
    fontWeight: "900" as const,
  },
  refreshBtn: {
    marginTop: 10,
    padding: 14,
    borderRadius: 16,
    alignItems: "center" as const,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  refreshText: {
    color: "#ff5c5c",
    fontWeight: "900" as const,
  },
};