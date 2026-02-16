import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DATA = [
  {
    id: 1,
    title: "Mathematics",
    icon: (
      <MaterialCommunityIcons name="math-compass" size={24} color="black" />
    ),
  },
  {
    id: 2,
    title: "Geography",
    icon: <Entypo name="globe" size={24} color="black" />,
  },
];

const Index = () => {
  return (
    <View style={styles.mainContainer}>
      <StatusBar hidden />
      <SafeAreaView>
        <Pressable style={styles.search}>
          <Feather name="search" size={20} color="white" />
        </Pressable>
        {/* <Image style={styles.image} source={require("../assets/globus.png")} /> */}
        <ScrollView style={styles.scrollView}>
          <Text style={styles.sectionTitle}>Subjects</Text>
          <Text style={styles.desc}>Recommendations for you</Text>
          <ScrollView horizontal style={styles.subjectScrollview} showsHorizontalScrollIndicator={false}>
            {DATA.map((item) => (
              <Pressable style={styles.subjectItem}>
                <Text>{item.title}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "rgb(1, 102, 80)",
    flex: 1,
    justifyContent: "flex-end",
  },
  search: {
    position: "absolute",
    top: 80,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 8,
    borderRadius: 10,
  },
  scrollView: {
    height: "60%",
    backgroundColor: "white",
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  image: {
    width: 200,
    height: 200,
    position: "absolute",
    zIndex: 10,
    bottom: "100%",
    right: 0,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 22,
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  desc: {
    fontWeight: "200",
    marginLeft: 16,
    fontSize: 12,
  },
  subjectItem: {
    height: 160,
    backgroundColor: "red",
    width: 200,
    borderRadius: 16,
    marginRight: 12,
  },
  subjectScrollview: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
});