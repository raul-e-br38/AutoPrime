import React from 'react';
// Importa o React para usar os recursos do React, como componentes e hooks.

import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
// Importa componentes do React Native para a construção da interface, como 'View', 'Text', 'StyleSheet', 'ScrollView', e 'Image'.

import { useRoute } from '@react-navigation/native';
// Importa o hook 'useRoute' do React Navigation, usado para acessar os parâmetros da rota atual (dados passados entre telas).

import colors from "../design/colors";
// Importa um arquivo de cores para manter a consistência das cores ao longo do aplicativo.

import Header from '../components/Header';
import Footer from '../components/Footer';
// Importa os componentes 'Header' e 'Footer', que são usados para exibir o cabeçalho e o rodapé na tela.

import BtnEnviar from "../components/BtnEnviar";
// Importa o componente 'BtnEnviar', que é um botão usado para interagir com o produto, como adicionar ao carrinho.

export default function ProdutoScreen() {
    // Declara o componente funcional 'ProdutoScreen', que exibe os detalhes de um produto.

    const route = useRoute();
    // Usa o hook 'useRoute' para acessar os parâmetros passados pela navegação (como o produto selecionado).

    const produto = route.params?.produto;
    // Recupera o produto a partir dos parâmetros da rota. Se o parâmetro 'produto' não existir, será undefined.

    if (!produto) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Produto não encontrado.</Text>
            </View>
        );
        // Se o produto não for encontrado, exibe uma mensagem indicando que o produto não foi encontrado,
        // e a tela será renderizada com um texto centralizado.
    }

    return (
        // Se o produto for encontrado, exibe os detalhes do produto.

        <ScrollView>

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
    imagem: {
        width: '80%',
        padding: 40,
    },
    nome: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.azul_fonte,
        margin: 5,
    },
    preco: {
        fontSize: 20,
        color: colors.azul_fonte,
        margin: 5,
    },
    descricao: {
        marginTop: 16,
    },
    carrinho: {
        alignItems: 'center',
        margin: 10,
    }
});
// Define os estilos para os diferentes elementos da tela usando 'StyleSheet' do React Native.
