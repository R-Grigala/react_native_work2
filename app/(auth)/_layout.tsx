import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: true, animation: "flip" }}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Login",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerTitle: "Register",
          headerBackTitle: "Login",
        }}
      />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});