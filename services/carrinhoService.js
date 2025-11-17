import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, Image } from "react-native";
import Colors from "../design/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import carrinhoService from "../services/carrinhoService";
import vendaService from "../services/vendaService";
import Toast from "react-native-toast-message";

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
        setIsLoading(true);
        try {
            const data = await carrinhoService.listarCarrinho(emailCliente);
            if (data?.itens) {
                setCarrinhoItems(data.itens);
            } else {
                setCarrinhoItems([]);
            }
        } catch (error) {
            console.log("Erro ao carregar carrinho:", error);
            setCarrinhoItems([]);
            Toast.show({
                type: "error",
                text1: "Erro ao carregar carrinho",
                text2: error.message || "Tente novamente"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const removerItem = (idItem) => {
        Alert.alert("Remover item", "Você tem certeza que deseja remover este item?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Remover",
                style: "destructive",
                onPress: async () => {
                    try {
                        await carrinhoService.removerItem(idItem);
                        carregarCarrinho(email);
                        Toast.show({
                            type: "success",
                            text1: "Item removido do carrinho!"
                        });
                    } catch (error) {
                        Toast.show({
                            type: "error",
                            text1: "Erro ao remover",
                            text2: error.message || "Tente novamente"
                        });
                    }
                },
            },
        ]);
    };

    const comprarTudo = async () => {
        try {
            const res = await vendaService.finalizarCompra(email);

            if (res.erro) {
                Toast.show({ type: "error", text1: res.erro });
                return;
            }

            const total =
                res.total_itens_comprados ??
                res.total ??
                res.itens ??
                0;

            Toast.show({
                type: "success",
                text1: "Compra finalizada!",
                text2: `Itens comprados: ${total}`
            });

            carregarCarrinho(email);

        } catch (err) {
            console.log("Erro ao finalizar compra", err);
            Toast.show({
                type: "error",
                text1: "Erro ao finalizar compra",
                text2: err.message || "Tente novamente"
            });
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.foto }} style={styles.image} />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemPrice}>R$ {item.valor_total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => removerItem(item.id_item)}>
                <Ionicons name="trash-bin" size={26} color={Colors.red} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Carrinho de Compras</Text>

            {isLoading ? (
                <Text style={styles.loading}>Carregando...</Text>
            ) : carrinhoItems.length === 0 ? (
                <Text style={styles.emptyCart}>Seu carrinho está vazio.</Text>
            ) : (
                <FlatList
                    data={carrinhoItems}
                    keyExtractor={(item) => item.id_item.toString()}
                    renderItem={renderItem}
                />
            )}

            {carrinhoItems.length > 0 && (
                <TouchableOpacity style={styles.buyButton} onPress={comprarTudo}>
                    <Text style={styles.buyButtonText}>Finalizar Compra</Text>
                </TouchableOpacity>
            )}

            <Toast />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, paddingTop: 20, paddingHorizontal: 20 },
    header: { fontSize: 24, fontWeight: "bold", color: Colors.black, marginBottom: 20 },
    loading: { marginTop: 50, fontSize: 18, textAlign: "center" },
    emptyCart: { marginTop: 50, fontSize: 18, textAlign: "center", color: Colors.cinza_medio },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 3,
    },
    image: { width: 70, height: 70, borderRadius: 8 },
    itemName: { fontSize: 16, fontWeight: "bold", color: Colors.black },
    itemPrice: { fontSize: 14, color: Colors.azul_vibrante },
    buyButton: {
        backgroundColor: Colors.azul_vibrante,
        padding: 16,
        borderRadius: 10,
        marginVertical: 20,
    },
    buyButtonText: { color: Colors.white, fontSize: 18, textAlign: "center", fontWeight: "bold" },
});
