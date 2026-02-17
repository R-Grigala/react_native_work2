import AppButton from "@/components/appButton/AppButton";
import AppInput from "@/components/appInput/AppInput";
import AppTitle from "@/components/appTitle/AppTitle";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import * as yup from "yup";

const loginSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

type LoginFormValues = yup.InferType<typeof loginSchema>;

const Index = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "johnd",
      password: "m38rmF$",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      const result = await response.json();
      if (result?.token) {
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({ token: result.token })
        );
        router.replace("/(tabs)");
      } else {
        console.error("Login failed: No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <AppTitle title="Log In" />

        <Controller
          control={control}
          name="username"
          render={({ field }: { field: any }) => (
            <AppInput
              placeholder="Username"
              value={field.value}
              onChangeText={field.onChange}
              autoCapitalize="none"
            />
          )}
        />
        {errors.username?.message && (
          <Text style={styles.errorText}>{errors.username.message}</Text>
        )}

        <Controller
          control={control}
          name="password"
          render={({ field }: { field: any }) => (
            <AppInput
              placeholder="Password"
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
            />
          )}
        />
        {errors.password?.message && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        <AppButton
          activeOpacity={0.8}
          handlePress={handleSubmit(onSubmit)}
          title={isSubmitting ? "Logging in..." : "Login"}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Don't have an account? </Text>
          <Link href={"/(auth)/register"} replace={true} style={styles.switchLink}>
            Register
          </Link>
        </View>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f3f4f6",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 12,
    marginHorizontal: 16,
    marginTop: -4,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  switchLabel: {
    fontSize: 14,
    color: "#4b5563",
  },
  switchLink: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
  },
});