import AppButton from "@/components/appButton/AppButton";
import AppInput from "@/components/appInput/AppInput";
import AppTitle from "@/components/appTitle/AppTitle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const Index = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("johnd");
  const [password, setPassword] = useState<string>("m38rmF$");

  const handleSubmit = async () => {
    if (username.length === 0 || password.length === 0) return;

    const response = await fetch("https://fakestoreapi.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    if (result?.token) {
      router.replace("/(tabs)");
      await AsyncStorage.setItem("user", JSON.stringify(result.token));
    }
  };
  return (
    <View>
      <AppTitle title="Log In" />
      <AppInput
        placeholder="username"
        value="johnd"
        onChangeText={setUsername}
      />
      <AppInput
        placeholder="password"
        value="m38rmF$"
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <AppButton
        activeOpacity={0.4}
        handlePress={handleSubmit}
        title={"Submit"}
      />
      <Link href={"/(auth)/register"} style={styles.link} replace={true}>
        Go To Register
      </Link>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  link: {
    textAlign: "center",
    marginTop: 12,
    color: "blue",
  },
});