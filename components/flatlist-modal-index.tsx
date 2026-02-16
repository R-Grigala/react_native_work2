import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
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
  const [modalVisible, setModalVisible] = useState(false);

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
    <>
      <FlatList
        horizontal={false}
        showsVerticalScrollIndicator={false}
        data={products}
        contentContainerStyle={styles.scrollview}
        initialNumToRender={2}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              console.log(item.id);
              setModalVisible(!modalVisible);
            }}
            style={styles.itemWrapper}
            key={item.id}
          >
            <Image style={styles.image} src={item.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text numberOfLines={3} style={styles.desc}>
              {item.description}
            </Text>
            <Button title="details" />
          </Pressable>
        )}
      />
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable
          onPress={() => setModalVisible(false)}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text>this is modal content</Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollview: {
    backgroundColor: "pink",
    paddingBottom: 120,
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
    flex: 0.5,
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
  modalContainer: {
    backgroundColor: "rgba(0, 0,0,0.5)",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "50%",
    height: "30%",
    backgroundColor: "white",
  },
});