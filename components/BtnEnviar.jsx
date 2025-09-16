import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ScrollView} from 'react-native';
import Input from "./Input";
import colors from "../design/colors";


export default function BtnEnviar() {
    return (
        <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnTxt}>Entrar</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn:{
        backgroundColor: colors.azul,
        paddingVertical: 10,
        borderRadius: 9,
        alignItems: 'center',
        width: '65%',
        marginTop: 40,
    },
    btnTxt:{
        color: colors.branco,
        fontSize: 16,
        fontWeight: 'bold',
    }
});
