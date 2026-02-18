import AppButton from "@/components/appButton/AppButton";
import { CartCountContext } from "@/app/_layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Product = {
  category: string;
  description: string;
  id: number;
  image: string;
  price: number;
  rating: { count: number; rate: number };
  title: string;
};

type Cart = {
  id: number;
  userId: number;
  date: string;
  products: { productId: number; quantity: number }[];
};

const defaultCart: Cart = {
  id: 1,
  userId: 1,
  date: new Date().toISOString().split("T")[0],
  products: [],
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cartContext = useContext(CartCountContext);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data: Product) => setProduct(data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!product || !cartContext) return;
    setAdding(true);
    try {
      const raw = await AsyncStorage.getItem("cart");
      const cart: Cart = raw ? JSON.parse(raw) : { ...defaultCart };
      if (!cart.products) cart.products = [];
      const existing = cart.products.find((p) => p.productId === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.products.push({ productId: product.id, quantity: 1 });
      }
      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      const total = cart.products.reduce((sum, p) => sum + p.quantity, 0);
      cartContext.setCartCount(total);
    } catch (e) {
      console.error("Add to cart error:", e);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.centerText}>იტვირთება...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? "პროდუქტი ვერ მოიძებნა"}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={product.image} style={styles.image} contentFit="contain" />
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.title}>{product.title}</Text>
      <View style={styles.ratingRow}>
        <Text style={styles.rating}>
          ⭐ {product.rating?.rate ?? 0} ({product.rating?.count ?? 0} reviews)
        </Text>
      </View>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <AppButton
        title={adding ? "იგზავნება..." : "კალათში დამატება"}
        handlePress={addToCart}
        activeOpacity={0.8}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  centerText: { marginTop: 10, color: "#6b7280" },
  errorText: { color: "#dc2626", textAlign: "center" },
  image: {
    width: "100%",
    height: 280,
    marginBottom: 16,
  },
  category: {
    textTransform: "capitalize",
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  ratingRow: { marginBottom: 8 },
  rating: { fontSize: 14, color: "#4b5563" },
  price: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4b5563",
  },
});
