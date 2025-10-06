import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import colors from "../design/colors";

export default function Produto({ nome, preco, imagem, descricao, navigation, produto }) {
    const comprar = () => {
        navigation.navigate('Produto', { produto });
    };
    return (
        <TouchableOpacity style={styles.produto} onPress={comprar}>
            <Image style={styles.foto} source={{ uri: imagem }} />
            <Text style={styles.nome}>{nome}</Text>
            <Text style={styles.preco}>R${preco.toFixed(2)}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    produto: {
        backgroundColor: colors.branco,
        padding: 20,
        width: '50%',
        height: 200,
        borderRadius: 5,
        marginLeft: -5,
    },
    foto: {
        alignSelf: 'center',
        marginBottom: 15,
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    nome: {
        color: colors.azul_fonte,
        fontWeight: "400",
        marginBottom: 5,
    },
    preco: {
        color: colors.azul_fonte,
        fontWeight: "bold",
    },
});