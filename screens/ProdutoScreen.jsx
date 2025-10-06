import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import colors from "../design/colors";
import Header from '../components/Header';
import Footer from '../components/Footer';
import BtnEnviar from "../components/BtnEnviar";

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

        <ScrollView >
            <Header/>
            <Image
                style={{ width: 200, height: 200, alignSelf: 'center' }}
                source={{ uri: produto.imagemUrl }}
            />
            <Text style={styles.nome}>{produto.nome}</Text>
            <Text style={styles.preco}>R${parseFloat(produto.preco).toFixed(2)}</Text>
            <View style={styles.carrinho}>
                <BtnEnviar title={'Adicionar ao Carrinho'}/>
            </View>
            <Text style={styles.descricao}>{produto.descricao}</Text>
            <Footer/>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    imagem:{
      width: '80%',
      padding: 40,

    },
    nome: {
        fontSize: 24, fontWeight: 'bold', color: colors.azul_fonte,
        margin: 5,
    },
    preco:{
        fontSize: 20, color: colors.azul_fonte,
        margin: 5,
    },
    descricao: {
        marginTop: 16
    },
    carrinho: {
        alignItems: 'center',
        margin: 10,
    }
})