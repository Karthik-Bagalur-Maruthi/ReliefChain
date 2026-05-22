import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createIncident } from "../services/incidentService";

export default function Incident() {
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState("");
  const [resources, setResources] = useState("");

  const handleSubmit = async () => {
    try {
      await createIncident({
        disasterType: type,
        severity: severity,
        resources: resources,
      });

      Alert.alert("Success", "Incident Reported", [
        {
          text: "OK",
          onPress: () => router.push("/dashboard"),
        },
      ]);

      setType("");
      setSeverity("");
      setResources("");
    } catch (error) {
      Alert.alert("Error", "Failed to send");
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Report Incident
      </Text>

      <TextInput
        placeholder="Disaster Type"
        value={type}
        onChangeText={setType}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Severity"
        value={severity}
        onChangeText={setSeverity}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Resources Needed"
        value={resources}
        onChangeText={setResources}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        style={{ backgroundColor: "red", padding: 15 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Submit Incident
        </Text>
      </TouchableOpacity>
    </View>
  );
}
