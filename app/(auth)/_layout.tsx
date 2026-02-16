import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "flip" }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: "ავტორიზაცია",
          title: "Login",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: true,
          title: "რეგისტრაცია",
          headerBackTitle: "ავტ",
        }}
      />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});