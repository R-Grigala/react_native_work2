
import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";
import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CartCountContext } from "../_layout";

const _layout = () => {
  const cart = useContext(CartCountContext);
  return (
    <Tabs
      screenOptions={{
        animation: "shift",
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "პროდუქტები",
          tabBarLabel: "products",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="shop" size={focused ? 24 : 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          headerTitle: "საყიდლები",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign
              name="shopping-cart"
              size={focused ? 24 : 22}
              color={color}
            />
          ),
          headerRight: () => (
            <View style={styles.bellIcon}>
              <AntDesign name="bell" size={20} color="black" />
              <Text>{cart?.cartCount ?? 0}</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "პროფილი",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign
              name="user-switch"
              size={focused ? 24 : 22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({
  bellIcon: {
    marginRight: 16,
  },
});