import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Produto from '../components/Produto';
import Marcas from '../components/Marcas';
import colors from "../design/colors";
import produtoService from '../services/produtoService';
import Toast from 'react-native-toast-message';

const HomeScreens = () => {
    // 🧩 Estado com os produtos atualmente exibidos na tela
    const [produtos, setProdutos] = useState([]);

    // 🗃️ Guarda a lista completa vinda da API (usada pra restaurar depois de filtros/busca)
    const [produtosOriginais, setProdutosOriginais] = useState([]);

    // 🔄 Controla o estado de carregamento (usado no pull-to-refresh)
    const [loading, setLoading] = useState(false);

    // ⚠️ Guarda o erro (caso algo falhe ao carregar produtos)
    const [erro, setErro] = useState(null);

    // 👀 Detecta se a tela está visível (útil pra recarregar quando volta ao foco)
    const isFocused = useIsFocused();

    // 📦 Acessa parâmetros vindos de outras telas (ex: texto da busca)
    const route = useRoute();

    // 🎯 Função que filtra produtos por marca (usada nos botões do componente <Marcas />)
    const handleFiltrarPorMarca = (marcaSelecionada) => {
        // Se não há marca selecionada, restaura lista original
        if (!marcaSelecionada) {
            setProdutos(produtosOriginais);
            return;
        }

        // Filtra produtos pela marca, ignorando maiúsculas/minúsculas
        const filtrados = produtosOriginais.filter(
            p => p.marca && p.marca.toLowerCase() === marcaSelecionada.toLowerCase()
        );

        // Atualiza o estado exibindo só os produtos dessa marca
        setProdutos(filtrados);
    };

    // 📲 useEffect executado sempre que a tela for aberta ou voltar ao foco
    useEffect(() => {
        carregarProdutos(); // Chama função que busca produtos da API
    }, [isFocused]);

    // 🔍 useEffect disparado quando o parâmetro "searchQuery" muda (texto da busca)
    useEffect(() => {
        if (route.params?.searchQuery) {
            // Quando há texto de busca, chama função de filtragem
            handleBuscarProdutos(route.params.searchQuery);
        }
    }, [route.params?.searchQuery]);

    // ⚙️ Função que busca produtos da API Flask
    const carregarProdutos = async () => {
        setLoading(true); // Ativa indicador de carregamento
        setErro(null);    // Reseta erro anterior

        try {
            // Faz requisição para API e obtém lista de produtos
            const produtosApi = await produtoService.listarProdutos();

            // Salva produtos no estado (ou array vazio, se não vier nada)
            setProdutos(produtosApi || []);
            setProdutosOriginais(produtosApi || []);

        } catch (error) {
            // Mostra no console para debug
            console.error("Erro ao carregar produtos:", error);

            // Guarda o erro no estado (usado pelo Toast)
            setErro(error);

            // Evita quebra da tela: deixa produtos vazios
            setProdutos([]);

        } finally {
            // Desativa o carregamento, mesmo que haja erro
            setLoading(false);
        }
    };

    // ⚠️ useEffect para mostrar toast automático sempre que o estado "erro" mudar
    useEffect(() => {
        if (erro && isFocused) {
            Toast.show({
                type: 'error',
                text1: 'Erro ao carregar produtos',
                text2: erro.message?.includes('Network request failed')
                    ? 'Verifique sua conexão com a internet.'
                    : 'Tente novamente mais tarde',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
            });
        }
    }, [erro, isFocused]);


    // 🔎 Função chamada quando o usuário busca algo no campo de pesquisa
    const handleBuscarProdutos = (texto) => {
        if (!texto) {
            // Se o campo de busca está vazio, mostra todos os produtos novamente
            setProdutos(produtosOriginais);
        } else {
            // Filtra produtos cujo nome ou marca contenham o texto digitado
            const filtrados = produtosOriginais.filter(p =>
                p.nome.toLowerCase().includes(texto.toLowerCase()) ||
                (p.marca && p.marca.toLowerCase().includes(texto.toLowerCase()))
            );

            // Atualiza a lista da tela
            setProdutos(filtrados);
        }
    };

    // 🖼️ Renderização da tela principal
    return (
        <ScrollView
            // Permite atualizar os produtos ao puxar a tela pra baixo
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={carregarProdutos} />
            }
        >
            {/* Cabeçalho (contém o campo de pesquisa) */}
            <Header onSearch={handleBuscarProdutos} />

            {/* Linha horizontal com várias marcas clicáveis */}
            <ScrollView
                horizontal
                contentContainerStyle={styles.marcasContainer}
                style={styles.container}
            >
                {/* Cada <Marcas /> é um botão com nome e imagem da marca */}
                <Marcas nome="Fiat" imagem={require('../assets/fiat.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Volkswagen" imagem={require('../assets/volkswagen.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Chevrolet" imagem={require('../assets/chevrolet.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Ford" imagem={require('../assets/ford.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Renault" imagem={require('../assets/renault.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Peugeot" imagem={require('../assets/peugeot.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Citroen" imagem={require('../assets/citroen.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Toyota" imagem={require('../assets/toyota.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Honda" imagem={require('../assets/honda.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Nissan" imagem={require('../assets/nissan.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Hyundai" imagem={require('../assets/hyundai.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="BMW" imagem={require('../assets/bmw.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Mercedes" imagem={require('../assets/mercedes.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Audi" imagem={require('../assets/audi.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Volvo" imagem={require('../assets/volvo.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Land Rover" imagem={require('../assets/landrover.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Porsche" imagem={require('../assets/porsche.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Lexus" imagem={require('../assets/lexus.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Mitsubishi" imagem={require('../assets/mitsubishi.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Subaru" imagem={require('../assets/subaru.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Kia" imagem={require('../assets/kia.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Jeep" imagem={require('../assets/jeep.png')} onPress={handleFiltrarPorMarca} />
                <Marcas nome="Dodge" imagem={require('../assets/dodge.png')} onPress={handleFiltrarPorMarca} />
            </ScrollView>

            {/* Título da seção */}
            <Text style={styles.titulo}>Explore Nosso Catálogo</Text>

            {/* Lista de produtos */}
            <View style={styles.produtos}>
                {produtos.length === 0 ? (
                    // Caso nenhum produto tenha sido encontrado
                    <Text style={{ color: colors.black, width: '100%', textAlign: 'center' }}>
                        Nenhum produto encontrado
                    </Text>
                ) : (
                    // Renderiza cada produto individualmente
                    produtos.map(item => (
                        <Produto
                            id={item.id}           // <- ESSENCIAL
                            key={item.id}
                            nome={item.nome}
                            preco={parseFloat(item.preco)}
                            descricao={item.descricao}
                            imagem={item.imagem}
                            marca={item.marca}
                        />

            ))
                )}
            </View>

            {/* Rodapé do app */}
            <View style={styles.fot}>
                <Footer />
            </View>
        </ScrollView>
    );
};

// 🎨 Estilos da tela
const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
    },
    marcasContainer: {
        paddingHorizontal: 20,
        gap: 20,
        alignItems: 'center',
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
