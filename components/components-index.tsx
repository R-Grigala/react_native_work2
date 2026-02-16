import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    Button,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const Index = () => {
  const [input, setInput] = useState("");

  console.log(input);

  return (
    <View>
      <StatusBar style="dark" backgroundColor="red" hidden/>
      <Text>index</Text>
      <TextInput
        style={styles.input}
        placeholder="input..."
        placeholderTextColor="red"
        keyboardType="email-address"
        secureTextEntry
        onChangeText={setInput}
        multiline={true}
        numberOfLines={4}
        defaultValue="snaiubdiusa"
        editable={true}
        // onChangeText={(text) => setInput(text)}
      />

      <Button title="this is button" />
      <Pressable onPress={() => console.log("first")} style={styles.pressable}>
        <Text style={{ color: "white" }}>this is pressable</Text>
      </Pressable>
      <TouchableOpacity
        onPress={() => console.log("first")}
        style={styles.pressable}
        activeOpacity={0.7}
        disabled={false}
        hitSlop={10}
      >
        <Text style={{ color: "white" }}>this is opacity</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  input: {
    marginHorizontal: 24,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "black",
    padding: 12,
    borderRadius: 8,
    height: 120,
  },
  pressable: {
    backgroundColor: "black",
    marginHorizontal: 24,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});