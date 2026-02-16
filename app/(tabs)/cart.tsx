import CartItem from "@/components/cartItem/CartItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { CartCountContext } from "../_layout";

type Cart = {
  id: number;
  userId: number;
  date: string;
  products: {
    productId: number;
    quantity: number;
  }[];
};

const cart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const cartContext = useContext(CartCountContext);
  console.log(cartContext);

  const fetchCart = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/carts/1");
      const result = await response.json();
      setCart(result);
      await AsyncStorage.setItem("cart", JSON.stringify(result));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkCart = async () => {
    try {
      const result = await AsyncStorage.getItem("cart");
      if (!result) {
        return fetchCart();
      }
      const localCart = JSON.parse(result);
      if (localCart?.products && localCart.products.length > 0) {
        setCart(localCart);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      // Fallback to fetching from API
      fetchCart();
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartQuantity = async (productId: number, newQuantity: number) => {
    if (!cart) return;

    const updatedProducts = cart.products.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );

    const updatedCart: Cart = {
      ...cart,
      products: updatedProducts,
    };

    setCart(updatedCart);

    // Persist to AsyncStorage
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  useEffect(() => {
    checkCart();
  }, []);

  useEffect(() => {
    if (cart && cartContext) {
      const total = cart.products.reduce((prev, item) => {
        return prev + item.quantity;
      }, 0);
      cartContext.setCartCount(total);
    }
  }, [cart, cartContext]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!cart || cart.products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View>
      {cart.products.map((item) => (
        <CartItem
          key={item.productId}
          productId={item.productId}
          quantity={item.quantity}
          onQuantityChange={(newQuantity: number) =>
            updateCartQuantity(item.productId, newQuantity)
          }
        />
      ))}
    </View>
  );
};

export default cart;

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
  },
});