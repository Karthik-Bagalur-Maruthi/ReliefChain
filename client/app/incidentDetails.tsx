import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function IncidentDetails() {

  const { disasterType, severity, resources } =
    useLocalSearchParams();

  return (
    <View style={{flex:1,padding:20}}>
      
      <Text
      style={{
        fontSize:24,
        fontWeight:"bold",
        marginBottom:20
      }}>
        Incident Details
      </Text>

      <Text>Disaster: {disasterType}</Text>

      <Text>
        Severity: {severity}
      </Text>

      <Text>
        Resources: {resources}
      </Text>

    </View>
  );
}