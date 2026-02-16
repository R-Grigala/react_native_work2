import { StyleSheet, Text, TouchableOpacity } from "react-native";

type AppButtonPropsType = {
  handlePress: () => void;
  title: string;
  activeOpacity?: number;
};

const AppButton = ({
  handlePress,
  title,
  activeOpacity,
}: AppButtonPropsType) => {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={handlePress}
      style={styles.button}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "black",
    marginHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  text: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});