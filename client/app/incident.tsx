import { View, Text, TextInput, TouchableOpacity ,Alert } from 'react-native';
import { useState } from 'react';

export default function Incident() {
  const [type, setType] = useState('');
  const [severity, setSeverity] = useState('');
  const [resources, setResources] = useState('');

  return (
    <View style={{flex:1,padding:20}}>
      
      <Text style={{fontSize:24,fontWeight:'bold',marginBottom:20}}>
        Report Incident
      </Text>

      <TextInput
        placeholder="Disaster Type (Flood, Earthquake...)"
        value={type}
        onChangeText={setType}
        style={{borderWidth:1,padding:10,marginBottom:10}}
      />

      <TextInput
        placeholder="Severity (Low/Medium/High)"
        value={severity}
        onChangeText={setSeverity}
        style={{borderWidth:1,padding:10,marginBottom:10}}
      />

      <TextInput
        placeholder="Resources Needed"
        value={resources}
        onChangeText={setResources}
        style={{borderWidth:1,padding:10,marginBottom:20}}
      />

      <TouchableOpacity
  onPress={async () => {
    try {
      const res = await fetch("http://172.20.4.134/api/incidents/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          disasterType: type,
          severity: severity,
          resources: resources
        })
      });

      const data = await res.json();
      Alert.alert("Success", "Incident reported");

    } catch (err) {
      Alert.alert("Error", "Failed to send");
    }
  }}
  style={{ backgroundColor: 'red', padding: 15 }}
>
  <Text style={{color:'white',textAlign:'center'}}>Submit Incident</Text>
</TouchableOpacity>

    </View>
  );
}