import { CartCountContext } from "@/app/_layout";
import { Image } from "expo-image";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CartItemPropsType = {
  productId: number;
  quantity: number;
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

const CartItem = ({ productId, quantity }: CartItemPropsType) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState<number>(quantity);
  const cartContext = useContext(CartCountContext);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${productId}`)
      .then((resp) => resp.json())
      .then((result) => setProduct(result))
      .catch((err) => console.error(err));
  }, []);

  const handleIncrease = () => {
    if (qty === 10) return;
    setQty(qty + 1);
    cartContext?.setCartCount(cartContext?.cartCount + 1);
  };

  const handleDecrease = () => {
    if (qty === 1) return;
    setQty(qty - 1);
    cartContext?.setCartCount(cartContext.cartCount - 1);
  };

  if (!product) return;
  return (
    <View style={styles.container}>
      <Image source={product.image} style={styles.image} />
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
          <Text style={styles.price}>${product.price}</Text>
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
});