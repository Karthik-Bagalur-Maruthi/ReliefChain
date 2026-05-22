import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { getIncidents } from "../services/incidentService";
import { router } from "expo-router";

export default function Dashboard() {
  type Incident = {
    _id: string;
    disasterType: string;
    severity: string;
    resources: string;
  };

  const [incidents, setIncidents] = useState<Incident[]>([]);
  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Dashboard
      </Text>

      <TouchableOpacity
        onPress={loadIncidents}
        style={{
          backgroundColor: "blue",
          padding: 10,
          marginBottom: 15,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          Refresh
        </Text>
      </TouchableOpacity>
      <FlatList
        data={incidents}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
onPress={() =>
router.push({
 pathname:"/incidentDetails",
 params:{
   disasterType:item.disasterType,
   severity:item.severity,
   resources:item.resources
 }
})
}
style={{
 borderWidth:1,
 padding:10,
 marginBottom:10
}}
>
            <Text>Disaster: {item.disasterType}</Text>
            <Text
              style={{
                color:
                  item.severity === "High"
                    ? "red"
                    : item.severity === "Medium"
                      ? "orange"
                      : "green",
              }}
            >
              Severity: {item.severity}
            </Text>
            <Text>Resources: {item.resources}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
