import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    ScrollView,
    RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Marcas from "../components/Marcas";
import BtnEnviar from "../components/BtnEnviar";
import colors from "../design/colors";
import Produto from "../components/Produto";
import Footer from "../components/Footer";
import produtoService from '../services/produtoService'; // import default

const HomeScreens = ({ navigation }) => {
    const [nome, setNome] = useState("");
    const [token, setToken] = useState("");
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false);

    const isFocused = useIsFocused();
    const route = useRoute();

    useEffect(() => {
        const loadUser = async () => {
            const t = await AsyncStorage.getItem('token');
            const n = await AsyncStorage.getItem('nome');
            setToken(t || "");
            setNome(n || "");
        };
        loadUser();
    }, []);

    useEffect(() => {
        carregarProdutos();
    }, [isFocused, route.params?.refresh]);

    const carregarProdutos = async () => {
        setLoading(true);
        try {
            const produtosApi = await produtoService.listarProdutos();
            setProdutos(produtosApi || []);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            setProdutos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.clear();
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        });
    };

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={carregarProdutos} />
            }
        >
            <Header />
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
                    produtos.map((item) => (
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

            <Button title="Sair" onPress={handleLogout} />
            <Footer />
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
});

export default HomeScreens;
