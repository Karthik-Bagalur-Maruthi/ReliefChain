import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

type Role = "volunteer" | "admin" | "victim" | "";

const roles = [
  {
    id: "volunteer",
    title: "Volunteer / NGO",
    subtitle: "Assigned rescue work",
    icon: "account-hard-hat",
  },
  {
    id: "admin",
    title: "Admin",
    subtitle: "Command dashboard",
    icon: "shield-account",
  },
  {
    id: "victim",
    title: "Victim / Citizen",
    subtitle: "Request emergency help instantly",
    icon: "alarm-light",
  },
];

export default function Login() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const particles = Array.from({ length: 14 });

  const handleLogin = () => {
    if (!role) {
      Alert.alert("Select Role", "Choose Volunteer, Admin, or Victim.");
      return;
    }

    if (role !== "victim" && (!email || !password)) {
      Alert.alert("Missing Details", "Enter email and password.");
      return;
    }

    if (role === "volunteer") {
      router.replace("/volunteerHome" as any);
    } else if (role === "admin") {
      router.replace("/dashboard" as any);
    } else {
      router.replace("/victimReport" as any);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#050505" }}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#040404", "#120202", "#2a0000"]}
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
            opacity: 0.15,
            translateY: height,
          }}
          animate={{
            opacity: 0.75,
            translateY: -80,
          }}
          transition={{
            loop: true,
            duration: 4500 + i * 300,
            delay: i * 180,
          }}
          style={{
            position: "absolute",
            width: 3 + (i % 5),
            height: 3 + (i % 5),
            borderRadius: 999,
            backgroundColor: "#ff2d2d",
            left: (width / 14) * i,
          }}
        />
      ))}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 55,
          paddingBottom: 40,
        }}
      >
        <MotiView
          from={{ opacity: 0, translateY: -35 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 900 }}
          style={{ alignItems: "center", marginBottom: 30 }}
        >
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: "rgba(255,0,0,0.13)",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#ff0000",
              shadowOpacity: 0.8,
              shadowRadius: 20,
              elevation: 18,
            }}
          >
            <MaterialCommunityIcons
              name="shield-alert"
              size={42}
              color="#ff4b4b"
            />
          </View>

          <Text
            style={{
              color: "white",
              fontSize: 34,
              fontWeight: "900",
              marginTop: 18,
              letterSpacing: 2,
            }}
          >
            RELIEFCHAIN
          </Text>

          <Text
            style={{
              color: "#999",
              marginTop: 8,
              fontSize: 13,
              letterSpacing: 1,
            }}
          >
            RESPONSE SURVIVES NETWORK FAILURE
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, scale: 0.92, translateY: 30 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 850 }}
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
          <Text
            style={{
              color: "white",
              fontSize: 22,
              fontWeight: "900",
              marginBottom: 16,
            }}
          >
            Select Access Role
          </Text>

          {roles.map((item) => {
            const selected = role === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setRole(item.id as Role)}
                style={{
                  borderRadius: 18,
                  overflow: "hidden",
                  marginBottom: 12,
                }}
              >
                <LinearGradient
                  colors={
                    selected
                      ? ["#7a0000", "#ff1a1a"]
                      : ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.04)"]
                  }
                  style={{
                    padding: 16,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: selected
                      ? "rgba(255,80,80,0.9)"
                      : "rgba(255,255,255,0.1)",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={30}
                    color={selected ? "white" : "#ff5c5c"}
                  />

                  <View style={{ marginLeft: 14, flex: 1 }}>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "900",
                        fontSize: 16,
                      }}
                    >
                      {item.title}
                    </Text>

                    <Text style={{ color: "#bbb", marginTop: 4 }}>
                      {item.subtitle}
                    </Text>
                  </View>

                  {selected && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color="white"
                    />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}

          {role !== "victim" && (
            <>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "900",
                  marginTop: 18,
                  marginBottom: 14,
                }}
              >
                Command Login
              </Text>

              <View style={inputBox}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={22}
                  color="#ff5c5c"
                />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
                  style={inputText}
                />
              </View>

              <View style={inputBox}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={22}
                  color="#ff5c5c"
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#888"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={inputText}
                />
              </View>
            </>
          )}

          <MotiView
            animate={{ scale: [1, 1.025, 1] }}
            transition={{ loop: true, duration: 2200 }}
          >
            <TouchableOpacity
              onPress={handleLogin}
              style={{
                borderRadius: 18,
                overflow: "hidden",
                marginTop: 8,
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
                    fontSize: 15,
                    fontWeight: "900",
                    letterSpacing: 1,
                  }}
                >
                  {role === "victim"
                    ? "REPORT EMERGENCY NOW"
                    : "ENTER RELIEFCHAIN"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
        </MotiView>
      </ScrollView>
    </View>
  );
}

const inputBox = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  backgroundColor: "rgba(255,255,255,0.06)",
  borderRadius: 16,
  paddingHorizontal: 14,
  marginBottom: 14,
  height: 58,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
};

const inputText = {
  flex: 1,
  color: "white",
  marginLeft: 12,
};