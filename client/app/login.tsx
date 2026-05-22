import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  Dimensions,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const particles = Array.from({ length: 15 });

  return (
    <View style={{ flex: 1, backgroundColor: "#050505" }}>
      <StatusBar barStyle="light-content" />

      {/* Cinematic emergency background */}
      <LinearGradient
        colors={["#040404", "#120202", "#2a0000"]}
        style={{
          position: "absolute",
          width,
          height,
        }}
      />

      {/* Floating particles */}
      {particles.map((_, i) => (
        <MotiView
          key={i}
          from={{
            opacity: 0.2,
            translateY: height,
          }}
          animate={{
            opacity: 0.8,
            translateY: -100,
          }}
          transition={{
            loop: true,
            duration: 4000 + i * 300,
            delay: i * 200,
          }}
          style={{
            position: "absolute",
            width: 3 + (i % 5),
            height: 3 + (i % 5),
            borderRadius: 999,
            backgroundColor: "#ff2d2d",
            left: (width / 15) * i,
          }}
        />
      ))}

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 20,
        }}
      >
        {/* Logo intro */}
        <MotiView
          from={{
            opacity: 0,
            translateY: -50,
          }}
          animate={{
            opacity: 1,
            translateY: 0,
          }}
          transition={{
            type: "timing",
            duration: 900,
          }}
          style={{
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255,0,0,0.12)",
              shadowColor: "#ff0000",
              shadowOpacity: 0.9,
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

        {/* 3D Glass login card */}
        <MotiView
          from={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            type: "timing",
            duration: 900,
          }}
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: 28,
            padding: 24,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
            shadowColor: "#ff0000",
            shadowOpacity: 0.4,
            shadowRadius: 30,
            elevation: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 22,
              fontWeight: "800",
              marginBottom: 20,
            }}
          >
            Command Access
          </Text>

          {/* Email */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 16,
              paddingHorizontal: 14,
              marginBottom: 14,
              height: 58,
            }}
          >
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
              style={{
                flex: 1,
                color: "white",
                marginLeft: 12,
              }}
            />
          </View>

          {/* Password */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 16,
              paddingHorizontal: 14,
              marginBottom: 24,
              height: 58,
            }}
          >
            <MaterialCommunityIcons
              name="lock-outline"
              size={22}
              color="#ff5c5c"
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              style={{
                flex: 1,
                color: "white",
                marginLeft: 12,
              }}
            />
          </View>

          {/* Pulsing button */}
          <MotiView
            animate={{
              scale: [1, 1.03, 1],
            }}
            transition={{
              loop: true,
              duration: 2200,
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/incident" as any)}
              style={{
                borderRadius: 18,
                overflow: "hidden",
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
                    fontSize: 16,
                    fontWeight: "900",
                    letterSpacing: 1,
                  }}
                >
                  LOGIN TO COMMAND CENTER
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
        </MotiView>
      </View>
    </View>
  );
}
