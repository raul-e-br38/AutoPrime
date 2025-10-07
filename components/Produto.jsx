import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import colors from "../design/colors";
import { useNavigation } from '@react-navigation/native';

export default function Produto({ nome, preco, imagem, descricao }) {
    const navigation = useNavigation();

    const produto = {
        nome,
        preco,
        imagemUrl: imagem,
        descricao,
    };

    const comprar = () => {
        navigation.navigate('Produto', {
            produto: { nome, preco, descricao, imagem }
        });
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
        width: '48%',
        borderRadius: 5,
        marginBottom: 10,
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
        fontWeight: "500",
        marginBottom: 5,
    },
    preco: {
        color: colors.azul_fonte,
        fontWeight: "bold",
    },
});
