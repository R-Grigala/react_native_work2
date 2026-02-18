import { CartCountContext } from "@/app/_layout";
import { Image } from "expo-image";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CartItemPropsType = {
  productId: number;
  quantity: number;
  onQuantityChange?: (newQuantity: number) => void;
  onRequestRemove?: () => void;
};

type Product = {
  category: string;
  description: string;
  id: number;
  image: string;
  price: number;
  rating: { count: number; rate: number };
  title: string;
};

const CartItem = ({ productId, quantity, onQuantityChange, onRequestRemove }: CartItemPropsType) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState<number>(quantity);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const cartContext = useContext(CartCountContext);

  // Sync local state with prop changes
  useEffect(() => {
    setQty(quantity);
  }, [quantity]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://fakestoreapi.com/products/${productId}`)
      .then((resp) => resp.json())
      .then((result) => setProduct(result))
      .catch((err) => {
        console.error("Error fetching product:", err);
      })
      .finally(() => setIsLoading(false));
  }, [productId]);

  const handleIncrease = () => {
    if (qty >= 10) return;
    const next = qty + 1;
    setQty(next);
    onQuantityChange?.(next);
    if (!onQuantityChange) cartContext?.setCartCount((cartContext?.cartCount ?? 0) + 1);
  };

  const handleDecrease = () => {
    if (qty <= 1) return;
    const next = qty - 1;
    setQty(next);
    onQuantityChange?.(next);
    if (!onQuantityChange) cartContext?.setCartCount((cartContext?.cartCount ?? 0) - 1);
  };

  if (isLoading || !product) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingPlaceholder} />
        <View style={styles.contentWrapper}>
          <View style={styles.textContainer}>
            <View style={styles.loadingText} />
            <View style={styles.loadingText} />
          </View>
        </View>
      </View>
    );
  }

  const totalPrice = (product.price * qty).toFixed(2);

  return (
    <View style={styles.container}>
      {onRequestRemove && (
        <TouchableOpacity
          onPress={onRequestRemove}
          style={styles.removeBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.removeText}>წაშლა</Text>
        </TouchableOpacity>
      )}
      <Image source={product.image} style={styles.image} contentFit="contain" />
      <View style={styles.contentWrapper}>
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {product.title}
          </Text>
          <Text style={styles.desc} numberOfLines={1}>
            {product.description}
          </Text>
        </View>
        <View style={styles.priceWrapper}>
          <View>
            <Text style={styles.price}>${product.price} each</Text>
            <Text style={styles.totalPrice}>Total: ${totalPrice}</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              hitSlop={10}
              activeOpacity={0.4}
              style={styles.button}
              onPress={handleDecrease}
            >
              <Text>-</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{qty}</Text>
            <TouchableOpacity
              hitSlop={10}
              onPress={handleIncrease}
              activeOpacity={0.4}
              style={styles.button}
            >
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomColor: "black",
    borderBottomWidth: 0.8,
    marginHorizontal: 22,
    flexDirection: "row",
    gap: 24,
    height: 140,
    justifyContent: "center",
    position: "relative",
  },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#dc2626",
    borderRadius: 6,
  },
  removeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  contentWrapper: {
    justifyContent: "space-between",
    gap: 24,
  },
  image: {
    width: 80,
    height: 80,
    alignSelf: "center",
  },
  textContainer: {
    width: 240,
    gap: 4,
  },
  title: {
    fontWeight: "600",
    maxWidth: "80%",
    fontSize: 17,
    wordWrap: "wrap",
  },
  desc: {
    fontWeight: "300",
    maxWidth: "100%",
    fontSize: 12,
  },
  priceWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonWrapper: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    paddingVertical: 6,
    borderRadius: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: "400",
  },
  button: {
    paddingHorizontal: 12,
  },
  qty: {
    width: 20,
    textAlign: "center",
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "green",
    marginTop: 4,
  },
  loadingPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  loadingText: {
    height: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 8,
    width: "80%",
  },
});