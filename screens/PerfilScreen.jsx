import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import colors from "../design/colors";


// Filtra produtos localmente por nome ou marca
const handleBuscarProdutos = (texto) => {
    if (!texto) {
        setProdutos(produtosOriginais); // mostra todos se busca vazia
    } else {
        const filtrados = produtosOriginais.filter(p =>
            p.nome.toLowerCase().includes(texto.toLowerCase()) ||
            (p.marca && p.marca.toLowerCase().includes(texto.toLowerCase()))
        );
        setProdutos(filtrados);
    }
};

export default function PerfilScreen({ navigation }) {
    return(
        <ScrollView style={styles.container}>
            <Header onSearch={handleBuscarProdutos} />
        
            <Footer/>
        </ScrollView>
    )
}