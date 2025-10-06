import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import colors from "../design/colors";

export default function ProdutoScreen() {
    const route = useRoute();
    const produto = route.params?.produto;

    if (!produto) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Produto não encontrado.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 24 }}>
            <Image
                style={{ width: 200, height: 200, alignSelf: 'center' }}
                source={{ uri: produto.imagemUrl }}
            />
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.azul_fonte }}>{produto.nome}</Text>
            <Text style={{ fontSize: 20, color: colors.azul_fonte }}>R${parseFloat(produto.preco).toFixed(2)}</Text>
            <Text style={{ marginTop: 16 }}>{produto.descricao}</Text>
        </ScrollView>
    );
}