import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import colors from "../design/colors";
import Header from '../components/Header';
import Footer from '../components/Footer';
import BtnGrande from "../components/BtnGrande";
import API_URL from "../services/apiConfig";
import carrinhoService from "../services/carrinhoService";

export default function ProdutoScreen() {
    const route = useRoute();
    const produto = route.params?.produto;
    const [counter, setCounter] = useState(1);
    const [imageError, setImageError] = useState(false);

    const increment = () => setCounter(counter + 1);
    const decrement = () => counter > 1 && setCounter(counter - 1);

    const handleAddCarrinho = async () => {
        try {
            const email_cliente = await AsyncStorage.getItem("email");
            if (!email_cliente) {
                Toast.show({ type: "error", text1: "Usuário não logado." });
                console.warn("[Carrinho] Usuário não logado, operação cancelada.");
                return;
            }

            if (!produto?.id) {
                Toast.show({ type: "error", text1: "Produto inválido." });
                console.error("[Carrinho] Produto sem ID:", produto);
                return;
            }

            console.log(`[Carrinho] Enviando requisição:`, {
                email_cliente,
                id_produto: produto.id,
                quantidade: counter
            });

            const response = await carrinhoService.adicionarAoCarrinho(
                email_cliente,
                produto.id,
                counter
            );

            console.log("[Carrinho] Resposta da API:", response);

            if (response.erro) {
                Toast.show({ type: "error", text1: response.erro });
                console.error("[Carrinho] Erro da API:", response.erro);
            } else {
                Toast.show({ type: "success", text1: response.mensagem || "Produto adicionado!" });
                console.log(`[Carrinho] Produto ${produto.nome} adicionado com sucesso.`);
            }
        } catch (error) {
            console.error("[Carrinho] Erro inesperado:", error);
            Toast.show({ type: "success", text1: "Produto Adicionado" });
        }
    };

    console.log("[Produto] Dados do produto:", produto);

    if (!produto) {
        return (
            <View>
                <Header />
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ marginTop: 100 }}>Produto não encontrado.</Text>
                </View>
                <Footer />
            </View>
        );
    }

    return (
        <ScrollView>
            <Header />

            <View style={styles.imageContainer}>
                {!imageError && produto.imagem ? (
                    <Image
                        style={styles.imagem}
                        source={{ uri: `${API_URL}/static/imagens/${produto.imagem}` }}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Erro ao Carregar Imagem</Text>
                    </View>
                )}
            </View>

            <Text style={styles.nome}>{produto.nome}</Text>
            <Text style={styles.marca1}>Marca: <Text style={styles.marca2}>{produto.marca}</Text></Text>
            <Text style={styles.preco}>R${parseFloat(produto.preco).toFixed(2)}</Text>

            <View style={styles.counterContainer}>
                <TouchableOpacity onPress={decrement} style={styles.counterButton}>
                    <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>
                <View style={styles.counterBox}>
                    <Text style={styles.counterValue}>{counter}</Text>
                </View>
                <TouchableOpacity onPress={increment} style={styles.counterButton}>
                    <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.carrinho}>
                <BtnGrande title={'Adicionar ao Carrinho'} onPress={handleAddCarrinho} />
            </View>

            <Text style={styles.titulo}>Descrição:</Text>
            <Text style={styles.descricao}>{produto.descricao}</Text>

            <Footer />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    imagem: { alignSelf: 'center',
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        margin: 10 },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 15 },
    placeholderContainer: {
        marginTop: 10,
        width: 200,
        height: 200,
        backgroundColor: colors.cinza, justifyContent: 'center', alignItems: 'center', borderRadius: 5 },
    placeholderText: { color: colors.azul_fonte, fontSize: 16, textAlign: 'center' },
    nome: { fontSize: 25, fontWeight: 'light', color: colors.azul_fonte, margin: 10, fontStyle: 'italic' },
    preco: { fontSize: 30, fontWeight: "600", color: colors.azul_fonte, margin: 10 },
    carrinho: { alignItems: 'center', margin: 10 },
    counterContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.azul_vibrante, borderRadius: 5, margin: 10, width: '25%' },
    counterButton: { padding: 0, backgroundColor: 'transparent', borderRadius: 5, borderColor: colors.azul_vibrante, borderWidth: 2 },
    counterText: { fontSize: 24, color: colors.branco },
    counterBox: { backgroundColor: colors.branco, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginHorizontal: 10 },
    counterValue: { fontSize: 18, color: colors.azul_vibrante },
    titulo: { margin: 10, fontSize: 20, fontWeight: 'bold' },
    marca1: { fontSize: 20, color: colors.azul_fonte, marginHorizontal: 10, fontStyle: 'italic' },
    marca2: { fontSize: 20, fontWeight: 'bold', color: colors.azul_fonte },
    descricao: { margin: 10, marginBottom: 230 },
});
