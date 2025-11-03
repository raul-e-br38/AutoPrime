import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import carrinhoService from "../services/carrinhoService";
import colors from "../design/colors";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CProduto from "../components/CProduto";

export default function CarrinhoScreen() {
    const [itens, setItens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const carregarCarrinho = async () => {
        try {
            const email = await AsyncStorage.getItem("email");
            if (!email) {
                Toast.show({ type: "error", text1: "Erro", text2: "Usuário não logado." });
                setItens([]);
                setLoading(false);
                return;
            }

            const dados = await carrinhoService.listarCarrinho(email);
            console.log("[Carrinho] Dados recebidos:", dados);

            if (dados && Array.isArray(dados.carrinho)) {
                setItens(dados.carrinho);
            } else {
                console.error("[Carrinho] Resposta inválida:", dados);
                setItens([]);
                Toast.show({ type: "error", text1: "Erro", text2: "Não foi possível carregar os itens." });
            }
        } catch (err) {
            console.error("[Carrinho] Erro ao buscar carrinho:", err);
            Toast.show({ type: "error", text1: "Erro", text2: "Não foi possível carregar o carrinho." });
            setItens([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        carregarCarrinho();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        carregarCarrinho();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.azul_vibrante} />
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Header />

            {itens.length === 0 ? (
                <View style={styles.center}>
                    <CProduto/>
                    <Text style={{ fontSize: 18 }}>Carrinho vazio</Text>
                </View>
            ) : (
                <CProduto/>
            )}

            <Footer />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
});
