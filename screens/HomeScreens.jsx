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
    // Estado para armazenar os produtos exibidos na tela
    const [produtos, setProdutos] = useState([]);
    // Estado para armazenar a lista completa original (para restaurar após filtro)
    const [produtosOriginais, setProdutosOriginais] = useState([]);
    // Estado que controla o loading/pull-to-refresh
    const [loading, setLoading] = useState(false);
    // Estado para armazenar erros ocorridos ao carregar produtos
    const [erro, setErro] = useState(null);

    // Hook que retorna true quando a tela está em foco
    const isFocused = useIsFocused();
    // Hook para acessar parâmetros da navegação
    const route = useRoute();
    const handleFiltrarPorMarca = (marcaSelecionada) => {
        if (!marcaSelecionada) {
            setProdutos(produtosOriginais);
            return;
        }

        const filtrados = produtosOriginais.filter(
            p => p.marca && p.marca.toLowerCase() === marcaSelecionada.toLowerCase()
        );
        setProdutos(filtrados);
    };


    // useEffect que dispara ao montar a tela ou quando ela volta ao foco
    useEffect(() => {
        carregarProdutos(); // Carrega os produtos da API
    }, [isFocused]);

    // useEffect que dispara quando o parâmetro searchQuery muda (vindo da navegação)
    useEffect(() => {
        if (route.params?.searchQuery) {
            handleBuscarProdutos(route.params.searchQuery); // Filtra produtos com base na busca
        }
    }, [route.params?.searchQuery]);

    // Função para buscar produtos da API
    const carregarProdutos = async () => {
        setLoading(true); // Ativa o loading
        setErro(null);    // Reseta erro antes da requisição
        try {
            // Chama o service que retorna a lista de produtos
            const produtosApi = await produtoService.listarProdutos();

            // Atualiza estados com a lista retornada ou array vazio se não houver
            setProdutos(produtosApi || []);
            setProdutosOriginais(produtosApi || []);
        } catch (error) {
            // Loga erro no console
            console.error("Erro ao carregar produtos:", error);

            // Salva o erro no estado para disparar toast
            setErro(error);

            // Fallback: lista de produtos vazia para não quebrar a tela
            setProdutos([]);
        } finally {
            // Desativa loading independentemente do sucesso ou erro
            setLoading(false);
        }
    };

    // useEffect que dispara sempre que o estado "erro" muda
    useEffect(() => {
        if (erro) {
            // Mostra toast personalizado na tela
            Toast.show({
                type: 'error', // Tipo de mensagem
                text1: 'Erro ao carregar produtos', // Título do toast
                text2: erro.message.includes('Network request failed')
                    ? 'Verifique sua conexão com a internet.' // Mensagem para erro de rede
                    : 'Tente novamente mais tarde',           // Mensagem genérica para outros erros
                position: 'top',      // Toast aparece no topo da tela
                visibilityTime: 3000, // Duração em ms
                autoHide: true,       // Desaparece sozinho
            });
        }
    }, [erro]);

    // Função para filtrar produtos com base no texto da busca
    const handleBuscarProdutos = (texto) => {
        if (!texto) {
            // Se busca vazia, restaura a lista original
            setProdutos(produtosOriginais);
        } else {
            // Filtra produtos pelo nome ou marca que contenham o texto
            const filtrados = produtosOriginais.filter(p =>
                p.nome.toLowerCase().includes(texto.toLowerCase()) ||
                (p.marca && p.marca.toLowerCase().includes(texto.toLowerCase()))
            );
            setProdutos(filtrados); // Atualiza estado com produtos filtrados
        }
    };

    // Render da tela
    return (
        <ScrollView
            // Pull-to-refresh para recarregar produtos
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={carregarProdutos} />
            }
        >
            {/* Header com funcionalidade de pesquisa */}
            <Header onSearch={handleBuscarProdutos} />

            {/* Seção de marcas */}
            <ScrollView
                horizontal
                contentContainerStyle={styles.marcasContainer}
                style={styles.container}
            >
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
                    // Caso não haja produtos
                    <Text style={{ color: colors.black, width: '100%', textAlign: 'center' }}>
                        Nenhum produto encontrado
                    </Text>
                ) : (
                    // Mapeia produtos existentes e renderiza componente Produto
                    produtos.map(item => (
                        <Produto
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

            {/* Rodapé */}
            <View style={styles.fot}>
                <Footer />
            </View>
        </ScrollView>
    );
};

// Estilos da tela
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
