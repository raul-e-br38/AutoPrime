import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import colors from "../design/colors";

export default function Input({ placeholder }) {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#888"
            textAlign="left"          // texto digitado alinhado à esquerda
            textAlignVertical="center" // placeholder vertical centralizado
            paddingHorizontal={15}     // margem interna
        />
    );
}

const styles = StyleSheet.create({
    input: {
        height: 45,
        width: '100%',
        borderRadius: 20,
        backgroundColor: colors.branco,
    },
});
