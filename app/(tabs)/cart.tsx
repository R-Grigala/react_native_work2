import CartItem from "@/components/cartItem/CartItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { CartCountContext } from "../_layout";

type Cart = {
  id: number;
  userId: number;
  date: string;
  products: [
    {
      productId: number;
      quantity: number;
    },
  ];
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
    const result = await AsyncStorage.getItem("cart");
    if (!result) {
      return fetchCart();
    }
    const localCart = JSON.parse(result);
    if (localCart?.products.length > 0) {
      setCart(localCart);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkCart();
  }, []);

  useEffect(() => {
    const total = cart?.products.reduce((prev, item) => {
      return prev + item.quantity;
    }, 0);
    cartContext?.setCartCount(total);
  }, [cart]);

  if (isLoading) return <ActivityIndicator />;

  return (
    <View>
      {cart?.products.map((item) => (
        <CartItem
          key={item.productId}
          productId={item.productId}
          quantity={item.quantity}
        />
      ))}
    </View>
  );
};

export default cart;

const styles = StyleSheet.create({});