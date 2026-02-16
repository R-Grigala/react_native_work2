import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

type ProductsType = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: "men's clothing" | "jewelery" | "electronics" | "women's clothing";
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

export default function Index() {
  const [products, setProducts] = useState<ProductsType[] | null>(null);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((resp) => resp.json())
      .then((result) => setProducts(result))
      .catch((err) => console.error(err));
  }, []);

  if (!products) {
    return (
      <View style={styles.loader}>
        <Text>პროდუქტები იტვირთება</Text>
        <ActivityIndicator size="small" color="blue" />
      </View>
    );
  }
  return (
    <ScrollView
      horizontal={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollview}
    >
      {products.map((item) => (
        <View style={styles.itemWrapper} key={item.id}>
          <Image
            style={styles.image}
            source={item.image}
            contentFit="contain"
            transition={1000}
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text numberOfLines={3} style={styles.desc}>
            {item.description}
          </Text>
          <Button title="details" />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollview: {
    backgroundColor: "pink",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  itemWrapper: {
    borderWidth: 1,
    borderColor: "black",
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    height: 200,
    width: 200,
  },
  image: {
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  desc: {
    fontWeight: "300",
    marginBottom: 12,
  },
});