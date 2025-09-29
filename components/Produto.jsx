import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TextInput, View, Image } from 'react-native';
import colors from "../design/colors";

export default function Produto() {
    return (
        <TouchableOpacity style={styles.produto}>
            <Image style={styles.foto} source={require('../assets/ponta.png')} />
            <Text style={styles.nome}>Ponteira bolada</Text>
            <Text style={styles.preco}>R$69,90</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    produto: {
        backgroundColor: colors.branco,
        padding: 20,
        width: '50%',
        height: 200,
        borderRadius: 5,
        marginLeft: -5
    },
    foto:{
        alignSelf: 'center',
        marginBottom: 15,
    },
    nome:{
        color: colors.azul_fonte,
        fontWeight: "light",
        marginBottom: 5,
    },
    preco:{
        color: colors.azul_fonte,
        fontWeight: "bold",
    },
})