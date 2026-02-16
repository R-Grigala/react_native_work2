import AppButton from "@/components/appButton/AppButton";
import AppInput from "@/components/appInput/AppInput";
import AppTitle from "@/components/appTitle/AppTitle";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const register = () => {
  return (
    <View>
      <AppTitle title={"Register"} />
      <AppInput placeholder="username" onChangeText={() => {}} />
      <AppInput
        placeholder="email"
        onChangeText={() => {}}
        keyboardType="email-address"
      />
      <AppInput
        placeholder="password"
        secureTextEntry={true}
        onChangeText={() => {}}
      />
      <AppInput
        placeholder="re-password"
        secureTextEntry={true}
        onChangeText={() => {}}
      />
      <AppButton title="Register" handlePress={() => {}} />
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