import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Header from '../components/Header';
import Footer from '../components/Footer';
import colors from "../design/colors";
import Produto from '../components/Produto';
import produtoService from '../services/produtoService';
import Marcas from '../components/Marcas';

const HomeScreens = () => {
    const [produtos, setProdutos] = useState([]);
    const [produtosOriginais, setProdutosOriginais] = useState([]); // todos os produtos
    const [loading, setLoading] = useState(false);
    const isFocused = useIsFocused();
    const route = useRoute();

    // Carrega todos os produtos da API
    const carregarProdutos = async () => {
        setLoading(true);
        try {
            const produtosApi = await produtoService.listarProdutos();
            setProdutos(produtosApi || []);
            setProdutosOriginais(produtosApi || []); // mantém cópia original
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            setProdutos([]);
            setProdutosOriginais([]);
        } finally {
            setLoading(false);
        }
    };

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

    useEffect(() => {
        carregarProdutos();
    }, [isFocused, route.params?.refresh]);

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={loading} onRefresh={carregarProdutos} />}
        >
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
                            descricao={item.descricao}
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
