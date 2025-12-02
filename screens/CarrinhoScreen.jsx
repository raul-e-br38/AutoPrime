import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Alert,
    StyleSheet,
    Image,
    TextInput
} from "react-native";

import Colors from "../design/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import carrinhoService from "../services/carrinhoService";
import vendaService from "../services/vendaService";
import Toast from "react-native-toast-message";
import Footer from "../components/Footer";
import Header from "../components/Header";
import API_URL from "../services/apiConfig";

export default function CarrinhoScreen({ navigation }) {
    const [emailLogado, setEmailLogado] = useState("");
    const [emailCliente, setEmailCliente] = useState(""); // input continua vazio
    const [carrinhoItems, setCarrinhoItems] = useState([]);
    const [totalCarrinho, setTotalCarrinho] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuying, setIsBuying] = useState(false);

    const toastQueue = useRef([]);

    const showToast = (toastObj) => {
        toastQueue.current.push(toastObj);
        if (toastQueue.current.length === 1) displayNextToast();
    };

    const displayNextToast = () => {
        if (!toastQueue.current.length) return;
        const current = toastQueue.current[0];
        setTimeout(() => {
            Toast.show({
                ...current,
                onHide: () => {
                    toastQueue.current.shift();
                    displayNextToast();
                }
            });
        }, 100);
    };

    useEffect(() => {
        async function carregarEmail() {
            try {
                const storedEmail = await AsyncStorage.getItem("email");
                if (!storedEmail) return;
                setEmailLogado(storedEmail.trim());
            } catch (e) {
                console.log("Erro ao carregar email:", e);
                showToast({ type: "error", text1: "Erro ao carregar usuário", position: "top" });
            }
        }
        carregarEmail();
    }, []);

    useEffect(() => {
        if (emailLogado) carregarCarrinho(emailLogado);
    }, [emailLogado]);

    const carregarCarrinho = async (emailBase) => {
        try {
            setIsLoading(true);
            const data = await carrinhoService.buscarCarrinho(emailBase);
            const itens = Array.isArray(data.carrinho) ? data.carrinho : [];

            const itensTratados = itens.map((item, i) => ({
                id_item: item.id_item ?? item.ID_ITEM ?? i + 1,
                id_produto: item.id_produto ?? item.ID_PRODUTO ?? item.produto_id,
                nome_produto: item.nome_produto ?? item.NOME_PRODUTO,
                quantidade: Number(item.quantidade) || 1,
                valor_unitario: Number(item.valor_unitario) || 0,
                valor_total: Number(item.valor_total) || 0,
                imagem_produto: item.imagem_produto || item.IMAGEM
            }));

            setCarrinhoItems(itensTratados);
            const total = itensTratados.reduce((s, item) => s + item.valor_total, 0);
            setTotalCarrinho(total);
        } catch (e) {
            console.log("Erro ao carregar carrinho:", e);
            showToast({ type: "error", text1: "Erro ao carregar carrinho", position: "top", visibilityTime: 3000 });
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
                        carregarCarrinho(emailLogado);
                        showToast({ type: "success", text1: "Item removido", position: "top", visibilityTime: 2000 });
                    } catch (e) {
                        console.log("Erro ao remover item:", e);
                        showToast({ type: "error", text1: "Erro ao remover item", position: "top", visibilityTime: 3000 });
                    }
                }
            }
        ]);
    };

    const atualizarQuantidade = async (id_item, novaQtd) => {
        if (novaQtd <= 0) {
            removerItem(id_item);
            return;
        }
        try {
            await carrinhoService.atualizarQuantidade(id_item, novaQtd);
            carregarCarrinho(emailLogado);
        } catch (e) {
            console.log("Erro ao atualizar quantidade:", e);
            showToast({ type: "error", text1: "Erro ao atualizar quantidade", position: "top", visibilityTime: 3000 });
        }
    };

    const comprarTudo = async () => {
        setIsBuying(true);
        try {
            // sempre finaliza usando o carrinho do usuário logado
            const data = await vendaService.finalizarVenda(emailLogado);

            showToast({
                type: "success",
                text1: "Compra finalizada!",
                text2: `${data.total_itens_comprados || 0} itens vendidos`,
                position: "top",
                visibilityTime: 3000
            });

            carregarCarrinho(emailLogado);

        } catch (e) {
            console.log("Erro ao finalizar compra:", e);
            let mensagem = e.message;
            try { mensagem = JSON.parse(e.message).erro || e.message; } catch (_) {}
            showToast({ type: "error", text1: mensagem || "Erro na compra", position: "top", visibilityTime: 3000 });
        } finally {
            setIsBuying(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image
                source={{ uri: `${API_URL}/static/imagens/${item.imagem_produto}` }}
                style={styles.image}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.itemName}>{item.nome_produto}</Text>
                <Text style={styles.itemPrice}>R$ {item.valor_total.toFixed(2)}</Text>
                <View style={styles.qtdContainer}>
                    <TouchableOpacity style={styles.qtdButton} onPress={() => atualizarQuantidade(item.id_item, item.quantidade - 1)}>
                        <Text style={styles.qtdText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtdNumber}>{item.quantidade}</Text>
                    <TouchableOpacity style={styles.qtdButton} onPress={() => atualizarQuantidade(item.id_item, item.quantidade + 1)}>
                        <Text style={styles.qtdText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => removerItem(item.id_item)}>
                <Image
                    source={require("../assets/trash.png")}
                    style={{ width: 24, height: 24, tintColor: Colors.red }}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <>
            <View style={{ flex: 1, backgroundColor: Colors.background }}>
                <Header />
                <TextInput
                    style={styles.inputEmail}
                    placeholder="E-mail do cliente"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={setEmailCliente} // captura o que digitar
                    value={emailCliente} // mantém input visível
                />
                {carrinhoItems.length > 0 && (
                    <Text style={styles.totalText}>Total do Carrinho: R$ {totalCarrinho.toFixed(2)}</Text>
                )}
                {isLoading ? (
                    <Text style={styles.loading}>Carregando...</Text>
                ) : carrinhoItems.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={styles.emptyCart}>Seu carrinho está vazio.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={carrinhoItems}
                        keyExtractor={(item) => String(item.id_item)}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 50 }}
                    />
                )}
                {carrinhoItems.length > 0 && (
                    <TouchableOpacity style={styles.buyButton} onPress={comprarTudo} disabled={isBuying}>
                        <Text style={styles.buyButtonText}>{isBuying ? "Processando..." : "Finalizar Compra"}</Text>
                    </TouchableOpacity>
                )}
                <Footer />
            </View>
            <Toast />
        </>
    );
}

const styles = StyleSheet.create({
    inputEmail: {
        backgroundColor: Colors.white,
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 12,
        marginTop: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: Colors.cinza_claro,
        marginBottom: 10,
    },
    totalText: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 12,
        marginBottom: 10,
        color: Colors.azul_vibrante,
    },
    loading: { marginTop: 50, fontSize: 18, textAlign: "center" },
    emptyCart: { fontSize: 18, textAlign: "center", color: Colors.cinza_medio },
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
    image: { width: 70, height: 70, borderRadius: 8, backgroundColor: Colors.cinza_claro },
    itemName: { fontSize: 16, fontWeight: "bold" },
    itemPrice: { fontSize: 14, color: "#1E88E5" },
    qtdContainer: { flexDirection: "row", alignItems: "center", marginTop: 6 },
    qtdButton: { width: 28, height: 28, borderRadius: 6, backgroundColor: Colors.cinza_claro, alignItems: "center", justifyContent: "center" },
    qtdText: { fontSize: 18, fontWeight: "bold" },
    qtdNumber: { marginHorizontal: 10, fontSize: 16, fontWeight: "bold" },
    buyButton: { backgroundColor: Colors.azul_vibrante, padding: 16, borderRadius: 10, marginVertical: 20, marginHorizontal: 12 },
    buyButtonText: { color: Colors.white, fontSize: 18, textAlign: "center", fontWeight: "bold" }
});
