import AppButton from "@/components/appButton/AppButton";
import AppInput from "@/components/appInput/AppInput";
import AppTitle from "@/components/appTitle/AppTitle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

const register = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    if (!username.trim()) {
      Alert.alert("Error", "Username is required");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Error", "Email is required");
      return false;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email");
      return false;
    }
    if (!password) {
      Alert.alert("Error", "Password is required");
      return false;
    }
    if (password.length < 4) {
      Alert.alert("Error", "Password must be at least 4 characters");
      return false;
    }
    if (password !== rePassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Note: fakestoreapi.com doesn't have a registration endpoint
      // This is a mock registration that stores user locally
      // In production, you would call your actual registration API
      const userData = {
        username,
        email,
        password, // In production, never store plain passwords!
      };

      // Store user data locally (mock registration)
      await AsyncStorage.setItem("registeredUser", JSON.stringify(userData));
      
      // Auto-login after registration (mock token)
      // In production, your API would return a token
      const mockToken = `mock_token_${Date.now()}`;
      await AsyncStorage.setItem("user", JSON.stringify({ token: mockToken }));
      
      Alert.alert("Success", "Registration successful!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)"),
        },
      ]);
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <AppTitle title={"Register"} />
      <AppInput
        placeholder="username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <AppInput
        placeholder="email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <AppInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <AppInput
        placeholder="re-password"
        value={rePassword}
        onChangeText={setRePassword}
        secureTextEntry={true}
      />
      <AppButton
        title={isLoading ? "Registering..." : "Register"}
        handlePress={handleRegister}
        activeOpacity={0.4}
      />
      <Link href={"/(auth)"} style={styles.link} replace={true}>
        Go To Login
      </Link>
    </View>
  );
};

export default register;

const styles = StyleSheet.create({
  link: {
    textAlign: "center",
    marginTop: 12,
    color: "blue",
  },
});