import { CartCountContext } from "@/app/_layout";
import { Image } from "expo-image";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CartItemProps = {
  productId: number;
  quantity: number;
  onQuantityChange?: (q: number) => void;
  onRequestRemove?: () => void;
};

type Product = { image: string; price: number; title: string; description: string };

const CartItem = ({
  productId,
  quantity,
  onQuantityChange,
  onRequestRemove,
}: CartItemProps): React.ReactElement | null => {
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(quantity);
  const { setCartCount, cartCount } = useContext(CartCountContext) ?? {};

  useEffect(() => {
    setQty(quantity);
  }, [quantity]);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://fakestoreapi.com/products/${productId}`)
      .then((r) => r.json())
      .then((data) => !cancelled && setProduct(data))
      .catch((e) => console.error("CartItem fetch:", e));
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const updateQty = (delta: number) => {
    const next = Math.max(1, Math.min(10, qty + delta));
    if (next === qty) return;
    setQty(next);
    onQuantityChange?.(next);
    if (!onQuantityChange && setCartCount)
      setCartCount((cartCount ?? 0) + (next - qty));
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <View style={styles.skeleton} />
        <View style={[styles.skeleton, styles.skeletonText]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={product.image} style={styles.image} contentFit="contain" />
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>{product.title}</Text>
        <Text numberOfLines={1} style={styles.desc}>{product.description}</Text>
        <View style={styles.bottomRow}>
          <View style={styles.row}>
            <View>
              <Text style={styles.price}>${product.price} each</Text>
              <Text style={styles.total}>Total: ${(product.price * qty).toFixed(2)}</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity hitSlop={10} style={styles.btn} onPress={() => updateQty(-1)}>
                <Text>-</Text>
              </TouchableOpacity>
              <Text style={styles.qty}>{qty}</Text>
              <TouchableOpacity hitSlop={10} style={styles.btn} onPress={() => updateQty(1)}>
                <Text>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          {onRequestRemove && (
            <TouchableOpacity onPress={onRequestRemove} style={styles.removeBtn} activeOpacity={0.7}>
              <Text style={styles.removeText}>წაშლა</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 24,
    height: 140,
    paddingVertical: 16,
    marginHorizontal: 22,
    borderBottomWidth: 0.8,
    borderBottomColor: "black",
    position: "relative",
  },
  removeBtn: {
    alignSelf: "flex-end",
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#dc2626",
    borderRadius: 6,
  },
  removeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  image: { width: 80, height: 80, alignSelf: "center" },
  content: { flex: 1, justifyContent: "space-between", gap: 4 },
  title: { fontWeight: "600", fontSize: 17 },
  desc: { fontWeight: "300", fontSize: 12 },
  bottomRow: { gap: 0 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: 16 },
  total: { fontSize: 14, fontWeight: "600", color: "green", marginTop: 4 },
  stepper: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingVertical: 6,
    borderRadius: 16,
  },
  btn: { paddingHorizontal: 12 },
  qty: { width: 20, textAlign: "center" },
  skeleton: { width: 80, height: 80, backgroundColor: "#e0e0e0", borderRadius: 8 },
  skeletonText: { height: 16, width: "70%", marginTop: 8 },
});
