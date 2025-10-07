import React, { useEffect, useState } from 'react';
// Importa os hooks 'useEffect' e 'useState' do React para gerenciar o estado e os efeitos colaterais (efeitos de ciclo de vida).

import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
// Importa componentes do React Native, como 'View', 'Text', 'StyleSheet', 'ScrollView' e 'RefreshControl', que são usados para construção da interface do usuário e interação com ela.

import { useIsFocused, useRoute } from '@react-navigation/native';
// Importa hooks do React Navigation:
// 'useIsFocused' verifica se a tela está em foco.
// 'useRoute' permite acessar informações sobre a rota atual, como parâmetros passados entre telas.

import Header from '../components/Header';
import Footer from '../components/Footer';
// Importa os componentes personalizados 'Header' e 'Footer', que representam o cabeçalho e rodapé da tela.

import colors from "../design/colors";
// Importa o arquivo de cores, onde estão definidas as cores usadas no aplicativo.

import Produto from '../components/Produto';
// Importa o componente 'Produto', usado para renderizar cada item de produto na tela.

import produtoService from '../services/produtoService';
// Importa o serviço 'produtoService', que contém funções para interagir com a API e obter dados sobre produtos.

import Marcas from '../components/Marcas';
// Importa o componente 'Marcas'.

const HomeScreens = () => {
    // Declaração do componente funcional 'HomeScreens' que representa a tela inicial do aplicativo.

    const [produtos, setProdutos] = useState([]);
    // 'produtos' é o estado que armazena os produtos a serem exibidos na tela. 'setProdutos' é a função para atualizar esse estado.

    const [produtosOriginais, setProdutosOriginais] = useState([]);
    // 'produtosOriginais' armazena todos os produtos recebidos da API, incluindo os que não foram filtrados.

    const [loading, setLoading] = useState(false);
    // 'loading' é um estado que indica se os produtos estão sendo carregados (em requisição).

    const isFocused = useIsFocused();
    // 'isFocused' é um hook que verifica se a tela está em foco (visível para o usuário).

    const route = useRoute();
    // 'route' acessa informações da rota atual, como parâmetros enviados entre telas.

    const carregarProdutos = async () => {
        // Função assíncrona para carregar os produtos da API.

        setLoading(true);
        // Define o estado 'loading' como verdadeiro para indicar que os produtos estão sendo carregados.

        try {
            const produtosApi = await produtoService.listarProdutos();
            // Chama o serviço 'produtoService.listarProdutos' para buscar a lista de produtos da API.

            setProdutos(produtosApi || []);
            // Atualiza o estado 'produtos' com a lista de produtos retornada pela API ou um array vazio caso a API não retorne produtos.

            setProdutosOriginais(produtosApi || []);
            // Atualiza o estado 'produtosOriginais' com a lista de produtos da API (copia a lista para permitir filtragem posterior).
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            // Se ocorrer algum erro ao buscar os produtos, ele será capturado e impresso no console.

            setProdutos([]);
            // Limpa o estado 'produtos' em caso de erro.
            setProdutosOriginais([]);
            // Limpa o estado 'produtosOriginais' também em caso de erro.
        } finally {
            setLoading(false);
            // Independentemente de ter ocorrido erro ou não, o estado 'loading' é definido como falso, indicando que o carregamento terminou.
        }
    };

    const handleBuscarProdutos = (texto) => {
        // Função para filtrar os produtos com base no texto fornecido na busca (nome ou marca).

        if (!texto) {
            setProdutos(produtosOriginais);
            // Se o texto de busca estiver vazio, exibe todos os produtos (volta para a lista original).
        } else {
            const filtrados = produtosOriginais.filter(p =>
                p.nome.toLowerCase().includes(texto.toLowerCase()) ||
                (p.marca && p.marca.toLowerCase().includes(texto.toLowerCase()))
            );
            // Filtra os produtos com base no nome ou marca que contém o texto de busca (ignorando maiúsculas/minúsculas).
            setProdutos(filtrados);
            // Atualiza o estado 'produtos' com os produtos filtrados.
        }
    };

    useEffect(() => {
        carregarProdutos();
    }, [isFocused, route.params?.refresh]);
    // 'useEffect' é chamado toda vez que a tela for focada ou o parâmetro 'refresh' da rota for alterado.
    // Isso garante que os produtos sejam recarregados quando o usuário voltar para a tela.

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
                    <Text style={{ color: colors.black, width: '100%', textAlign: 'center', }}>
                        Nenhum produto encontrado
                    </Text>
                ) : (
                    produtos.map(item => (
                        <Produto
                            key={item.id_produto}
                            nome={item.nome}
                            preco={parseFloat(item.preco)}
                            imagem={`http://192.168.1.117:5000/${item.imagem.replace(/\\/g, '/')}`}
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
    fot: {
        marginTop: 200,
    },
});

export default HomeScreens;
// Exporta o componente 'HomeScreens' como o componente padrão do arquivo, para ser usado em outras partes do aplicativo.
