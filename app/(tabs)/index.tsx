import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
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

const Index = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setError(null);
    try {
      const resp = await fetch("https://fakestoreapi.com/products");
      if (!resp.ok) {
        throw new Error(`Request failed (${resp.status})`);
      }
      const data: Product[] = await resp.json();
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    }
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await fetchProducts();
      setIsLoading(false);
    })();
  }, [fetchProducts]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchProducts();
    setIsRefreshing(false);
  }, [fetchProducts]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.centerText}>იტვირთება პროდუქტები...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>ვერ ჩაიტვირთა პროდუქტები</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryText}>თავიდან ცდა</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => String(item.id)}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: "/products/[id]",
              params: { id: String(item.id) },
            })
          }
        >
          <Image source={item.image} style={styles.image} contentFit="contain" />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {item.category} • ⭐ {item.rating?.rate ?? 0} ({item.rating?.count ?? 0})
            </Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        </Pressable>
      )}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.centerText}>პროდუქტები ვერ მოიძებნა</Text>
        </View>
      }
    />
  );
};

export default Index;

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    gap: 12,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  centerText: {
    marginTop: 10,
    color: "#4b5563",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    textAlign: "center",
  },
  errorText: {
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: "white",
    fontWeight: "700",
  },
  card: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  image: {
    width: 72,
    height: 72,
    alignSelf: "center",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  meta: {
    fontSize: 12,
    color: "#6b7280",
  },
  price: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
});