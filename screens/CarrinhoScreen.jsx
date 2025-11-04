import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
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
    const isFocused = useIsFocused();

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
                // Log detalhado dos itens para debug
                console.log("[Carrinho] Itens do carrinho:", dados.carrinho);
                dados.carrinho.forEach((item, index) => {
                    console.log(`[Carrinho] Item ${index}:`, {
                        id_item: item.id_item,
                        nome: item.nome_produto,
                        imagem: item.imagem,
                        imagem_produto: item.imagem_produto,
                        todas_props: Object.keys(item)
                    });
                });
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
        if (isFocused) {
            carregarCarrinho();
        }
    }, [isFocused]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        carregarCarrinho();
    }, []);

    const removerItem = async (id_item) => {
        // Salva o item antes de remover para poder restaurar em caso de erro
        const itemRemovido = itens.find(item => item.id_item === id_item);
        
        try {
            // Remove o item da lista localmente primeiro (atualização otimista)
            setItens(prevItens => prevItens.filter(item => item.id_item !== id_item));
            
            const response = await carrinhoService.removerItem(id_item);
            console.log("[Carrinho] Resposta ao remover:", response);
            
            if (response.erro) {
                // Se houver erro, restaura o item na lista
                if (itemRemovido) {
                    setItens(prevItens => [...prevItens, itemRemovido]);
                }
                Toast.show({ 
                    type: "error", 
                    text1: "Erro ao remover", 
                    text2: response.erro || "Não foi possível remover o produto."
                });
            } else {
                // Exibe toast de sucesso
                Toast.show({ 
                    type: "success", 
                    text1: "Produto removido", 
                    text2: itemRemovido?.nome_produto ? `${itemRemovido.nome_produto} foi removido do carrinho` : "Produto removido do carrinho com sucesso!"
                });
                // Recarrega a lista para garantir sincronização
                await carregarCarrinho();
            }
        } catch (error) {
            console.error("[Carrinho] Erro ao remover item:", error);
            // Restaura o item em caso de erro
            if (itemRemovido) {
                setItens(prevItens => [...prevItens, itemRemovido]);
            }
            Toast.show({ 
                type: "error", 
                text1: "Erro", 
                text2: "Não foi possível remover o produto. Tente novamente."
            });
        }
    };

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
            <Text style={styles.titulo}>Seu Carrinho 🛒</Text>
            {itens.length === 0 ? (
                <View style={styles.center}>
                    <Text style={{ fontSize: 18 }}>Carrinho vazio</Text>
                </View>
            ) : (
                <View style={styles.listaProdutos}>
                    {itens.map(item => (
                        <CProduto
                            key={item.id_item}
                            id_item={item.id_item}
                            nome={item.nome_produto}
                            marca={item.marca}
                            quantidade={item.quantidade}
                            valor_unitario={parseFloat(item.valor_unitario) || 0}
                            valor_total={parseFloat(item.valor_total) || 0}
                            imagem={item.imagem || item.imagem_produto}
                            onRemover={removerItem}
                        />
                    ))}
                </View>
            )}
            {itens.length === 0 ? (
            <View style={styles.fot}>
                <Footer />
            </View>
            ) : (
                <Footer />
            )}))
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50
    },
    listaProdutos: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 10 },
    fot:{
        marginTop:300},
    titulo:{
        fontSize: 20,
        alignSelf: "center",
        margin: 10,
        fontWeight: "bold"},
});
