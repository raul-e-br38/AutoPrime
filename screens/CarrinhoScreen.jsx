import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Alert,
    StyleSheet,
    Image
} from "react-native";
import Colors from "../design/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import carrinhoService from "../services/carrinhoService";
import vendaService from "../services/vendaService";
import Toast from "react-native-toast-message";
import Footer from "../components/Footer";
import Header from "../components/Header";
import API_URL from "../services/apiConfig";

export default function CarrinhoScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [carrinhoItems, setCarrinhoItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        carregarEmail();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            if (email) carregarCarrinho(email);
        });
        return unsubscribe;
    }, [navigation, email]);

    const carregarEmail = async () => {
        try {
            const storedEmail = await AsyncStorage.getItem("email");
            if (storedEmail) {
                const clean = storedEmail.trim();
                setEmail(clean);
                carregarCarrinho(clean);
            }
        } catch (error) {
            console.log("Erro ao carregar e-mail:", error);
        }
    };

    const carregarCarrinho = async (emailCliente) => {
        try {
            setIsLoading(true);
            const data = await carrinhoService.listarCarrinho(emailCliente);
            // Garante que o estado seja atualizado com os novos dados
            setCarrinhoItems(data.carrinho || []);
        } catch (error) {
            // Log do erro de carregamento (pode ser problema de API_URL)
            console.log("ERRO AO CARREGAR CARRINHO:", error);
            Toast.show({
                type: "error",
                text1: "Erro de Conexão",
                text2: "Não foi possível carregar o carrinho. Verifique sua conexão/API URL."
            });
        } finally {
            setIsLoading(false);
        }
    };

    const removerItem = (id_item) => {
        Alert.alert("Remover item", "Deseja remover este item?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Remover",
                style: "destructive",
                onPress: async () => {
                    try {
                        await carrinhoService.removerItem(id_item);
                        // Recarrega o carrinho após a remoção
                        carregarCarrinho(email);
                        Toast.show({ type: "success", text1: "Item removido!" });
                    } catch (error) {
                        // Log do erro de remoção
                        console.log("ERRO AO REMOVER ITEM:", error);
                        Toast.show({
                            type: "error",
                            text1: `Erro: ${error.message}`,
                            text2: "Falha ao remover item."
                        });
                    }
                }
            }
        ]);
    };

    // 💡 Alteração: Adicionado log detalhado do erro.
    const atualizarQuantidade = async (id_item, novaQtd) => {
        if (novaQtd <= 0) {
            removerItem(id_item);
            return;
        }

        try {
            await carrinhoService.atualizarQuantidade(id_item, novaQtd);
            // Chama a função que busca os dados ATUALIZADOS no servidor
            carregarCarrinho(email);
        } catch (e) {
            // 🚨 LOG CRÍTICO para ver o erro 404/500 ou Network request failed
            console.log("ERRO AO ATUALIZAR QUANTIDADE:", e);
            // Mostra uma mensagem de erro útil
            Toast.show({
                type: "error",
                text1: `Erro: ${e.message}`,
                text2: "Falha ao atualizar quantidade. Verifique o console."
            });
        }
    };

    const comprarTudo = async () => {
        try {
            const res = await vendaService.finalizarCompra(email);

            Toast.show({
                type: "success",
                text1: "Compra finalizada!",
                text2: `Itens comprados: ${res.total_itens_comprados}`
            });

            carregarCarrinho(email);
        } catch (error) {
            console.log("ERRO AO FINALIZAR COMPRA:", error);
            Toast.show({
                type: "error",
                text1: error.message || "Erro ao finalizar compra"
            });
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image
                // ✅ CORREÇÃO: Usando o mesmo padrão da Home/ProdutoScreen: /static/imagens/ + nome_do_arquivo
                // Isso requer que a rota Flask 'listar_carrinho' retorne APENAS o nome do arquivo (ex: "104.png").
                source={{ uri: `${API_URL}/static/imagens/${item.imagem_produto}` }}
                style={styles.image}
                onError={(e) => console.log('Erro ao carregar imagem:', e.nativeEvent.error)}
            />

            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.itemName}>{item.nome_produto}</Text>
                <Text style={styles.itemPrice}>
                    R$ {item.valor_total.toFixed(2)}
                </Text>

                <View style={styles.qtdContainer}>
                    <TouchableOpacity
                        style={styles.qtdButton}
                        onPress={() =>
                            atualizarQuantidade(item.id_item, item.quantidade - 1)
                        }
                    >
                        <Text style={styles.qtdText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtdNumber}>{item.quantidade}</Text>

                    <TouchableOpacity
                        style={styles.qtdButton}
                        onPress={() =>
                            atualizarQuantidade(item.id_item, item.quantidade + 1)
                        }
                    >
                        <Text style={styles.qtdText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity onPress={() => removerItem(item.id_item)}>
                <Image source={require("../assets/trash.png")} style={{ width: 24, height: 24, tintColor: Colors.red }}/>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <Header />

            {isLoading ? (
                <Text style={styles.loading}>Carregando...</Text>
            ) : carrinhoItems.length === 0 ? (
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={styles.emptyCart}>Seu carrinho está vazio.</Text>
                </View>
            ) : (
                <FlatList
                    data={carrinhoItems}
                    keyExtractor={(item) => item.id_item.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 50 }}
                />
            )}

            {carrinhoItems.length > 0 && (
                <TouchableOpacity style={styles.buyButton} onPress={comprarTudo}>
                    <Text style={styles.buyButtonText}>Finalizar Compra</Text>
                </TouchableOpacity>
            )}

            <View style={{ marginTop: carrinhoItems.length === 0 ? "auto" : 0 }}>
                <Footer />
            </View>

            <Toast />
        </View>
    );
}

const styles = StyleSheet.create({
    loading: {
        marginTop: 50,
        fontSize: 18,
        textAlign: "center"
    },
    emptyCart: {
        fontSize: 18,
        textAlign: "center",
        color: Colors.cinza_medio
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        marginHorizontal: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 8,
        // Garante que a imagem seja renderizada, mesmo que o source falhe
        backgroundColor: Colors.cinza_claro,
    },
    itemName: {
        fontSize: 16,
        fontWeight: "bold"
    },
    itemPrice: {
        fontSize: 14,
        color: "#1E88E5"
    },
    qtdContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6
    },
    qtdButton: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: Colors.cinza_claro,
        alignItems: "center",
        justifyContent: "center"
    },
    qtdText: {
        fontSize: 18,
        fontWeight: "bold"
    },
    qtdNumber: {
        marginHorizontal: 10,
        fontSize: 16,
        fontWeight: "bold"
    },
    buyButton: {
        backgroundColor: Colors.azul_vibrante,
        padding: 16,
        borderRadius: 10,
        marginVertical: 20,
        marginHorizontal: 12
    },
    buyButtonText: {
        color: Colors.white,
        fontSize: 18,
        textAlign: "center",
        fontWeight: "bold"
    }
});