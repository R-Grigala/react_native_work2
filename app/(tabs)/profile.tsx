import AppButton from "@/components/appButton/AppButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const Profile = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const registered = await AsyncStorage.getItem("user");
        if (registered) {
          const data = JSON.parse(registered);
          setUsername(data.username ?? null);
        }
      } catch {
        setUsername(null);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      router.replace("/(auth)");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{username ?? "მომხმარებელი არ მოიძებნა"}</Text>
      <AppButton
        title="გასვლა"
        handlePress={handleLogout}
        activeOpacity={0.8}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  username: {
    textAlign: "center",
    fontSize: 24,
    color: "#4b5563",
    fontWeight: "600",
    marginBottom: 24,
  },
});