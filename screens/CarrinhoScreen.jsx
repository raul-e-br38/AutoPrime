import React, { useEffect, useState } from "react";
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
    const [emailCliente, setEmailCliente] = useState("");

    const [carrinhoItems, setCarrinhoItems] = useState([]);
    const [totalCarrinho, setTotalCarrinho] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function carregarEmail() {
            try {
                const storedEmail = await AsyncStorage.getItem("email");
                if (!storedEmail) return;
                setEmailLogado(storedEmail.trim());
            } catch (e) {
                console.log("Erro ao carregar email:", e);
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
                id_produto: item.id_produto ?? item.ID_PRODUTO,
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
                        Toast.show({ type: "success", text1: "Item removido!" });
                    } catch (e) {
                        console.log("ERRO REMOVER:", e);
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
            console.log("ERRO AO ATUALIZAR QTD:", e);
        }
    };

    const comprarTudo = async () => {
        if (!emailCliente.trim()) {
            Toast.show({ type: "error", text1: "Digite o e-mail do cliente" });
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Toast.show({ type: "error", text1: "Vendedor não logado" });
                return;
            }

            const resCliente = await fetch(`${API_URL}/cadastro/nome/${emailCliente}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!resCliente.ok) {
                Toast.show({ type: "error", text1: "Cliente não encontrado" });
                return;
            }

            const clienteData = await resCliente.json();
            if (!clienteData.cadastro || clienteData.cadastro.length === 0) {
                Toast.show({ type: "error", text1: "Cliente não encontrado" });
                return;
            }

            const cliente = clienteData.cadastro[0];
            const id_cliente = cliente.ID_CADASTRO;

            const id_vendedor = Number(await AsyncStorage.getItem("usuario_id"));
            if (!id_vendedor) {
                Toast.show({ type: "error", text1: "Vendedor não logado" });
                return;
            }

            for (const item of carrinhoItems) {
                console.log("DEBUG venda:", {
                    id_cliente,
                    id_vendedor,
                    id_produto: item.id_produto,
                    quantidade: item.quantidade,
                    valor_unitario: item.valor_unitario
                });
                await vendaService.registrarVenda({
                    id_cliente,
                    id_vendedor,
                    id_produto: item.id_produto,
                    quantidade: item.quantidade,
                    valor_unitario: item.valor_unitario
                });
            }

            await carrinhoService.limparCarrinho(emailLogado);

            Toast.show({
                type: "success",
                text1: "Compra finalizada!",
                text2: `${carrinhoItems.length} itens vendidos`
            });

            carregarCarrinho(emailLogado);

        } catch (e) {
            console.log("ERRO FINALIZAR:", e);
            Toast.show({ type: "error", text1: e.message || "Erro na compra" });
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
                    <TouchableOpacity
                        style={styles.qtdButton}
                        onPress={() => atualizarQuantidade(item.id_item, item.quantidade - 1)}
                    >
                        <Text style={styles.qtdText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtdNumber}>{item.quantidade}</Text>
                    <TouchableOpacity
                        style={styles.qtdButton}
                        onPress={() => atualizarQuantidade(item.id_item, item.quantidade + 1)}
                    >
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
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            <Header />
            <TextInput
                style={styles.inputEmail}
                placeholder="E-mail do cliente para compra"
                value={emailCliente}
                onChangeText={setEmailCliente}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            {carrinhoItems.length > 0 && (
                <Text style={styles.totalText}>
                    Total do Carrinho: R$ {totalCarrinho.toFixed(2)}
                </Text>
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
                <TouchableOpacity style={styles.buyButton} onPress={comprarTudo}>
                    <Text style={styles.buyButtonText}>Finalizar Compra</Text>
                </TouchableOpacity>
            )}
            <Footer />
            <Toast />
        </View>
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
