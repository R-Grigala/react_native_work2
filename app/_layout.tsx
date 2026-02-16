import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { createContext, useEffect, useState } from "react";

interface CartCountContextType {
  cartCount: number;
  setCartCount: (count: number) => void;
}

export const CartCountContext = createContext<CartCountContextType | null>(null);

export default function RootLayout() {
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  const checkUser = async () => {
    try {
      const result = await AsyncStorage.getItem("user");
      if (!result) {
        router.replace("/(auth)");
        return;
      }
      const user = JSON.parse(result);
      if (user?.token) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)");
      }
    } catch (error) {
      console.error("Error checking user:", error);
      router.replace("/(auth)");
    }
  };

  useEffect(() => {
    checkUser();
  }, [router]);
  
  return (
    <CartCountContext.Provider value={{ cartCount, setCartCount }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </CartCountContext.Provider>
  );
}