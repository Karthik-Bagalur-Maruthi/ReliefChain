import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getIncidents } from "../services/incidentService";
import { getCurrentLocation } from "../services/locationService";
import { getTasks } from "../services/taskService";

const { width } = Dimensions.get("window");

type Coords = {
  latitude: number;
  longitude: number;
};

type Incident = {
  _id: string;
  disasterType: string;
  severity: string;
  resources: string;
  latitude?: number;
  longitude?: number;
  status?: string;
};

type Task = {
  _id: string;
  volunteerName: string;
  taskTitle: string;
  status: string;
  latitude?: number;
  longitude?: number;
};

export default function TacticalMap() {
  const mapRef = useRef<MapView | null>(null);

  const [userLocation, setUserLocation] = useState<Coords | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    refreshAll();
  }, []);

  const loadIncidents = async () => {
    try {
      const data = await getIncidents();

      const gpsIncidents = (data || []).filter(
        (item: Incident) =>
          item.latitude &&
          item.longitude &&
          item.status?.toUpperCase() !== "RESOLVED"
      );

      setIncidents(gpsIncidents);
    } catch (error) {
      console.log("INCIDENT FETCH FAILED:", error);
    }
  };

  const loadTasks = async () => {
    try {
      const data = await getTasks();

      const gpsTasks = (data || []).filter(
  (task: Task) =>
    task.latitude &&
    task.longitude &&
    task.status?.toUpperCase() !== "COMPLETED"
);

      setTasks(gpsTasks);
    } catch (error) {
      console.log("TASK FETCH FAILED:", error);
    }
  };

  const loadLiveLocation = async () => {
    try {
      const coords = await getCurrentLocation();

      setUserLocation(coords);

      mapRef.current?.animateToRegion(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    } catch (error) {
      Alert.alert(
        "Location Permission",
        "Unable to access live location. Showing backend disaster map."
      );
    }
  };

  const refreshAll = async () => {
    await loadLiveLocation();
    await loadIncidents();
    await loadTasks();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#050505" }}>
      <StatusBar barStyle="light-content" />

      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 12.9716,
          longitude: 77.5946,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Live Location"
            description="Current responder position"
            pinColor="blue"
          />
        )}

        {incidents.map((incident) => (
          <Marker
            key={incident._id}
            coordinate={{
              latitude: incident.latitude!,
              longitude: incident.longitude!,
            }}
            title={incident.disasterType}
            description={`${incident.severity} • ${incident.resources}`}
            pinColor="red"
          />
        ))}

        {tasks.map((task) => (
          <Marker
            key={task._id}
            coordinate={{
              latitude: task.latitude!,
              longitude: task.longitude!,
            }}
            title={task.volunteerName}
            description={`${task.taskTitle} • ${task.status}`}
            pinColor={
              task.status?.toUpperCase() === "COMPLETED"
                ? "gray"
                : "orange"
            }
          />
        ))}
      </MapView>

      <LinearGradient
        colors={["rgba(0,0,0,0.85)", "rgba(80,0,0,0.25)", "transparent"]}
        style={{
          position: "absolute",
          top: 0,
          width,
          paddingTop: 55,
          paddingHorizontal: 20,
          paddingBottom: 28,
        }}
      >
        <TouchableOpacity
          onPress={() => router.replace("/login" as any)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#ff5c5c" />
          <Text style={{ color: "#ff5c5c", marginLeft: 8, fontWeight: "900" }}>
            Back
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            color: "white",
            fontSize: 30,
            fontWeight: "900",
          }}
        >
          TACTICAL MAP
        </Text>

        <Text style={{ color: "#ccc", marginTop: 8 }}>
          Live disaster + assignment visualization
        </Text>
      </LinearGradient>

      <View
        style={{
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          backgroundColor: "rgba(0,0,0,0.82)",
          borderRadius: 24,
          padding: 18,
          borderWidth: 1,
          borderColor: "rgba(255,80,80,0.3)",
        }}
      >
        <Text style={{ color: "#ff5c5c", fontWeight: "900" }}>
          LIVE RESPONSE STATUS
        </Text>

        <Text style={{ color: "white", fontSize: 18, fontWeight: "900" }}>
          {incidents.length} incidents • {tasks.length} response teams
        </Text>

        <Text style={{ color: "#aaa", marginTop: 8 }}>
          Red = active incidents | Orange = assigned teams | Gray = completed
        </Text>

        <TouchableOpacity
          onPress={refreshAll}
          style={{
            marginTop: 14,
            backgroundColor: "rgba(255,0,0,0.2)",
            paddingVertical: 12,
            borderRadius: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "900" }}>
            REFRESH MAP
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}