import NetInfo from "@react-native-community/netinfo";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { initDB } from "../services/offlineDB";
import { syncOfflineReports } from "../services/syncService";

export default function RootLayout() {
  useEffect(() => {
    initDB();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        syncOfflineReports();
      }
    });

    const interval = setInterval(() => {
      syncOfflineReports();
    }, 10000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Stack
        initialRouteName="login"
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
          contentStyle: { backgroundColor: "#050505" },
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="volunteerHome" />
        <Stack.Screen name="victimReport" />
        <Stack.Screen name="incident" />
        <Stack.Screen name="incidentDetails" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="tacticalMap" />
        <Stack.Screen name="offlineQueue" />
        <Stack.Screen name="modal" />
        <Stack.Screen name="(tabs)" />
      </Stack>

      <StatusBar style="light" />
    </>
  );
}
