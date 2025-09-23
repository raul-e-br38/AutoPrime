import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import colors from "../design/colors";

export default function Input({
                                  placeholder,
                                  value,
                                  onChangeText,
                                  secureTextEntry = false,
                                  keyboardType = "default",
                                  ...props
                              }) {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#888"
            textAlign="left"
            textAlignVertical="center"
            paddingHorizontal={15}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        height: 45,
        width: '100%',
        borderRadius: 20,
        backgroundColor: colors.branco,
        marginBottom: 5,
        padding: 10,
    },
});