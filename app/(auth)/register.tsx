import AppButton from "@/components/appButton/AppButton";
import AppInput from "@/components/appInput/AppInput";
import AppTitle from "@/components/appTitle/AppTitle";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, View } from "react-native";
import * as yup from "yup";

const registerSchema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

type RegisterFormValues = yup.InferType<typeof registerSchema>;

const Register = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // Note: fakestoreapi.com doesn't have a registration endpoint
      // This is a mock registration that stores user locally
      const userData = {
        username: data.username,
        email: data.email,
        password: data.password, // In production, never store plain passwords!
      };

      // Store user data locally (mock registration)
      await AsyncStorage.setItem("registeredUser", JSON.stringify(userData));

      // Auto-login after registration (mock token)
      const mockToken = `mock_token_${Date.now()}`;
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({ token: mockToken, username: data.username })
      );

      Alert.alert("Success", "Registration successful!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)"),
        },
      ]);
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Registration failed. Please try again.");
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <AppTitle title={"Register"} />

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
          name="email"
          render={({ field }: { field: any }) => (
            <AppInput
              placeholder="Email"
              value={field.value}
              onChangeText={field.onChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email?.message && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
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

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }: { field: any }) => (
            <AppInput
              placeholder="Repeat password"
              value={field.value}
              onChangeText={field.onChange}
              secureTextEntry
            />
          )}
        />
        {errors.confirmPassword?.message && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}

        <AppButton
          title={isSubmitting ? "Registering..." : "Register"}
          handlePress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Already have an account? </Text>
          <Link href={"/(auth)"} replace={true} style={styles.switchLink}>
            Login
          </Link>
        </View>
      </View>
    </View>
  );
};

export default Register;

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