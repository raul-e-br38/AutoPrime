import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from "../design/colors";

export default function BtnEnviar({ onPress, title }) {
    return (
        <TouchableOpacity style={styles.btn} onPress={onPress}>
            <Text style={styles.btnTxt}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: colors.azul,
        paddingVertical: 10,
        borderRadius: 9,
        alignItems: 'center',
        width: '65%',
        marginTop: 10,
    },
    btnTxt: {
        color: colors.branco,
        fontSize: 16,
        fontWeight: 'bold',
    }
});
