import React, { Dispatch, SetStateAction } from "react";
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from "react-native";

type AppInputPropsType = {
  placeholder: string;
  value?: string | undefined;
  inputStyles?: ViewStyle | undefined;
  onChangeText: Dispatch<SetStateAction<string>>;
} & TextInputProps &
  ViewStyle;

const AppInput = ({
  placeholder,
  value,
  inputStyles,
  onChangeText,
  ...props
}: AppInputPropsType) => {
  return (
    <View style={[styles.inputContainer, inputStyles]}>
      <TextInput
        {...props}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default AppInput;

const styles = StyleSheet.create({
  inputContainer: {
    paddingVertical: 8,
    marginHorizontal: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 8,
  },
});