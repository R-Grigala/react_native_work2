import CartItem from "@/components/cartItem/CartItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CartCountContext } from "../_layout";

type Cart = {
  id: number;
  userId: number;
  date: string;
  products: {
    productId: number;
    quantity: number;
    price?: number;
  }[];
};

const emptyCart: Cart = {
  id: 1,
  userId: 1,
  date: new Date().toISOString().split("T")[0],
  products: [],
};

const cart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [productPrices, setProductPrices] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const cartContext = useContext(CartCountContext);

  const loadCart = async () => {
    try {
      const result = await AsyncStorage.getItem("cart");
      if (!result) {
        setCart(emptyCart);
        return;
      }
      const localCart: Cart = JSON.parse(result);
      setCart(
        localCart?.products && Array.isArray(localCart.products)
          ? localCart
          : { ...emptyCart, ...localCart, products: localCart?.products ?? [] }
      );
    } catch (error) {
      console.error("Error loading cart:", error);
      setCart(emptyCart);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadCart();
    setIsRefreshing(false);
  }, []);

  const updateCartQuantity = async (productId: number, newQuantity: number) => {
    if (!cart) return;

    const updatedProducts = cart.products.map((item) =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    );

    const updatedCart: Cart = {
      ...cart,
      products: updatedProducts,
    };

    setCart(updatedCart);

    try {
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!cart) return;

    const updatedProducts = cart.products.filter((item) => item.productId !== productId);
    const updatedCart: Cart = {
      ...cart,
      products: updatedProducts,
    };

    setCart(updatedCart);

    try {
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  useEffect(() => {
    if (cart && cartContext) {
      const total = cart.products.reduce((prev, item) => {
        return prev + item.quantity;
      }, 0);
      cartContext.setCartCount(total);
    }
  }, [cart, cartContext]);

  useEffect(() => {
    if (!cart?.products?.length) return;
    const ids = [...new Set(cart.products.map((p) => p.productId))];
    let cancelled = false;
    const prices: Record<number, number> = {};
    Promise.all(
      ids.map((id) =>
        fetch(`https://fakestoreapi.com/products/${id}`)
          .then((res) => res.json())
          .then((data: { price: number }) => {
            if (!cancelled) prices[id] = data.price;
          })
          .catch(() => {})
      )
    ).then(() => {
      if (!cancelled) setProductPrices((prev) => ({ ...prev, ...prices }));
    });
    return () => {
      cancelled = true;
    };
  }, [cart?.products]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.centerContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.emptyText}>კალათა ცარიელია</Text>
      </ScrollView>
    );
  }

  const totalAmount = cart.products.reduce(
    (sum, item) =>
      sum +
      item.quantity *
        (productPrices[item.productId] ?? item.price ?? 0),
    0
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {cart.products.map((item) => (
        <CartItem
          key={item.productId}
          productId={item.productId}
          quantity={item.quantity}
          onQuantityChange={(newQuantity: number) =>
            updateCartQuantity(item.productId, newQuantity)
          }
          onRequestRemove={() => removeFromCart(item.productId)}
        />
      ))}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
};

export default cart;

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  centerContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  listContent: {
    paddingBottom: 24,
  },
  totalContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  totalLabel: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
  },
});