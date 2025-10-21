import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import colors from "../design/colors";

export default function Marcas({ nome, imagem, onPress }) {
    return (
        <TouchableOpacity style={styles.circle} onPress={() => onPress(nome)}>
            <Image source={imagem} style={styles.logo} resizeMode="contain" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    circle: {
        width: 100,
        height: 100,
        borderRadius: 60,
        backgroundColor: colors.branco,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    logo: {
        width: 60,
        height: 60,
    },
});
