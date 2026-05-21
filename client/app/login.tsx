import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
export default function Login() {
  const router = useRouter();
  return (
    <View style={{flex:1,justifyContent:'center',padding:20}}>
      
      <Text style={{fontSize:28,fontWeight:'bold',marginBottom:20}}>
        ReliefChain
      </Text>

      <TextInput
        placeholder="Email"
        style={{borderWidth:1,padding:10,marginBottom:10,borderRadius:5}}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={{borderWidth:1,padding:10,marginBottom:20,borderRadius:5}}
      />

     <TouchableOpacity
onPress={() => router.push('/incident' as any)}
  style={{backgroundColor:'blue',padding:15,borderRadius:5}}>
        <Text style={{color:'white',textAlign:'center'}}>Login</Text>
      </TouchableOpacity>

    </View>
  );
}