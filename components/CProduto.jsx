import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import colors from "../design/colors";
import { useNavigation } from '@react-navigation/native';
import API_URL from '../services/apiConfig';

export default function CProduto() {

    return (
        <TouchableOpacity style={styles.produto}>
            <View style={styles.imageContainer}>
            <Image style={styles.foto} source={require('../assets/audi.png')} />
            </View>

            <Text style={styles.nome}>Tadalafila</Text>
            <Text style={styles.preco}>Preço Total: R$ 999</Text>
            <Text style={styles.quantidade}>10</Text>

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
    imageContainer: { alignItems: 'center', marginBottom: 15 },
    foto: { width: 100, height: 100, resizeMode: 'contain' },
    placeholderContainer: { width: 100, height: 100, backgroundColor: colors.cinza, justifyContent: 'center', alignItems: 'center', borderRadius: 5 },
    placeholderText: { color: colors.azul_fonte, fontSize: 12, textAlign: 'center' },
    nome: { color: colors.azul_fonte, fontWeight: "500", marginBottom: 5 },
    preco: { color: colors.azul_fonte, fontWeight: "bold" },
    quantidade: { color: colors.azul_fonte, fontWeight: "500" },
});
