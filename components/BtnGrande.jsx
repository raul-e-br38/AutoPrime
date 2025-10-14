import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from "../design/colors";

export default function BtnGrande({ onPress, title }) {
    return (
        <TouchableOpacity style={styles.btn} onPress={onPress}>
            <Text style={styles.btnTxt}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: colors.azul_vibrante,
        paddingVertical: 15,
        borderRadius: 9,
        alignItems: 'center',
        width: '100%',
        margin: 10,
    },
    btnTxt: {
        color: colors.branco,
        fontSize: 20,
        fontWeight: 'bold',
    }
});
