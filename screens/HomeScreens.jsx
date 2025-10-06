import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import colors from "../design/colors";
import Produto from '../components/Produto';
import produtoService from '../services/produtoService';
import Marcas from '../components/Marcas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import ProdutoScreen from "./ProdutoScreen";

const HomeScreens = () => {
    const [produtos, setProdutos] = useState([]);
    const [produtosOriginais, setProdutosOriginais] = useState([]);
    const [loading, setLoading] = useState(false);
    const isFocused = useIsFocused();
    const route = useRoute();
    const navigation = useNavigation();

    const carregarProdutos = async () => {
        setLoading(true);
        try {
            const produtosApi = await produtoService.listarProdutos();
            setProdutos(produtosApi || []);
            setProdutosOriginais(produtosApi || []);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            setProdutos([]);
            setProdutosOriginais([]);
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Falha ao carregar produtos 😢' });
        } finally {
            setLoading(false);
        }
    };

    const handleBuscarProdutos = (texto) => {
        if (!texto) {
            setProdutos(produtosOriginais);
        } else {
            const filtrados = produtosOriginais.filter(p =>
                p.nome.toLowerCase().includes(texto.toLowerCase()) ||
                (p.marca && p.marca.toLowerCase().includes(texto.toLowerCase()))
            );
            setProdutos(filtrados);
        }
    };


    return (
        <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={carregarProdutos} />}>
            <Header onSearch={handleBuscarProdutos} />
            <View style={styles.container}>
                <Marcas />
                <Marcas />
                <Marcas />
            </View>
            <Text style={styles.titulo}>Explore Nosso Catálogo</Text>
            <View style={styles.produtos}>
                {produtos.length === 0 ? (
                    <Text style={{ color: colors.black, width: '100%', textAlign: 'center' }}>
                        Nenhum produto encontrado
                    </Text>
                ) : (
                    produtos.map(item => (
                        <Produto
                            key={item.id_produto}
                            nome={item.nome}
                            preco={parseFloat(item.preco)}
                            imagem={`http://192.168.1.119:5000/${item.imagem.replace(/\\/g, '/')}`}
                            navigation={navigation}
                            descricao={item.descricao}
                            produto={item}
                        />
                    ))
                )}
            </View>
            <View style={styles.fot}>
                <Footer />
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        gap: 25,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        flexDirection: 'row',
    },
    titulo: {
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: colors.black,
        padding: 20,
        color: colors.white,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    produtos: {
        backgroundColor: colors.cinza,
        padding: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 10,
        marginVertical: 20,
    },
    fot:{
        marginTop: 200,
    }
});

export default HomeScreens;
