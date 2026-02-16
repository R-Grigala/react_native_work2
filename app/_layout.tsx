import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { createContext, useEffect, useState } from "react";

export const CartCountContext = createContext(0);

export default function RootLayout() {
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  const checkUser = async () => {
    const result = await AsyncStorage.getItem("user");
    if (!result) return;
    const user = JSON.parse(result);
    if (user) {
      router.push("/(tabs)");
    }
  };

  useEffect(() => {
    checkUser();
  }, []);
  return (
    <CartCountContext value={{ cartCount, setCartCount }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tab)" />
      </Stack>
    </CartCountContext>
  );
}