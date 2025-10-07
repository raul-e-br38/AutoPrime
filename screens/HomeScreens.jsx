import React, { useEffect, useState } from 'react'; // importa React e os hooks useEffect (efeitos colaterais) e useState (estado local)
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native'; // importa componentes do React Native usados na tela
import { useIsFocused } from '@react-navigation/native'; // hook que retorna true quando a tela está em foco (útil pra recarregar ao voltar)
import Header from '../components/Header'; // importa componente Header customizado (provavelmente contém a barra de pesquisa)
import Footer from '../components/Footer'; // importa componente Footer customizado
import colors from "../design/colors"; // importa objeto com cores do projeto
import Produto from '../components/Produto'; // importa componente que exibe cada produto individual
import produtoService from '../services/produtoService'; // importa serviço/API para listar produtos
import Marcas from '../components/Marcas'; // importa componente Marcas (provavelmente lista de logos/filtragem)
import Toast from 'react-native-toast-message'; // importa lib para mostrar notificações em toast

const HomeScreens = () => { // componente funcional principal desta tela (Home)
    const [produtos, setProdutos] = useState([]); // estado que guarda os produtos exibidos (pode ser filtrado)
    const [produtosOriginais, setProdutosOriginais] = useState([]); // estado que guarda a lista original (sem filtro)
    const [loading, setLoading] = useState(false); // estado que indica se está carregando (usado no RefreshControl)
    const isFocused = useIsFocused(); // verifica se a tela está em foco (true/false)

    useEffect(() => { // efeito que roda quando o componente monta e quando isFocused muda
        carregarProdutos(); // chama a função que busca os produtos na API
    }, [isFocused]); // dependência: sempre que a tela voltar ao foco, recarrega os produtos

    const carregarProdutos = async () => { // função assíncrona que busca produtos do backend
        setLoading(true); // indica início do carregamento (RefreshControl usa esse estado)
        try {
            const produtosApi = await produtoService.listarProdutos(); // chama o serviço que retorna a lista de produtos
            setProdutos(produtosApi || []); // atualiza produtos exibidos (proteção caso venha undefined/null)
            setProdutosOriginais(produtosApi || []); // mantém uma cópia original para filtrar depois
        } catch (error) {
            console.error("Erro ao carregar produtos:", error); // log de erro no console durante desenvolvimento
            Toast.show({ // mostra um toast de erro amigável pro usuário
                type: 'error',
                text1: 'Erro ao carregar produtos',
                text2: 'Tente novamente mais tarde '
            });
        } finally {
            setLoading(false); // garante que o loading será desligado independente do resultado
        }
    };

    const handleBuscarProdutos = (texto) => { // função que trata o texto da busca (passada ao Header)
        if (!texto) { // se campo de busca vazio
            setProdutos(produtosOriginais); // restaura a lista original (sem filtro)
        } else {
            const filtrados = produtosOriginais.filter(p =>
                p.nome.toLowerCase().includes(texto.toLowerCase()) || // filtra pelo nome (case-insensitive)
                (p.marca && p.marca.toLowerCase().includes(texto.toLowerCase())) // também filtra por marca, se existir
            );
            setProdutos(filtrados); // seta a lista filtrada para exibição
        }
    };

    return ( // JSX retornado pelo componente
        <ScrollView
            refreshControl={ // componente que habilita pull-to-refresh na ScrollView
                <RefreshControl refreshing={loading} onRefresh={carregarProdutos} /> // usa loading e chama carregarProdutos
            }
        >
            <Header onSearch={handleBuscarProdutos} /> {/* Header recebe prop onSearch para buscar produtos */}

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
                            key={item.id}
                            nome={item.nome}
                            preco={parseFloat(item.preco)}
                            descricao={item.descricao}
                            imagem={item.imagem}
                        />

                    ))
                )}
            </View>

            <View style={styles.fot}>
                <Footer />
            </View>

            <Toast />
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

export default HomeScreens; // exporta o componente como padrão do módulo