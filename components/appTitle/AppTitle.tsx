import { StyleSheet, Text } from "react-native";

const AppTitle = ({ title }: { title: string }) => {
  return <Text style={styles.title}>{title}</Text>;
};

export default AppTitle;

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    paddingVertical: 20,
    fontSize: 30,
    fontWeight: "600",
  },
});