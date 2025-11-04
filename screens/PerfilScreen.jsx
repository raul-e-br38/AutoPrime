import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Input from "../components/Input";
import BtnEnviar from "../components/BtnEnviar";
import colors from "../design/colors";
import { editarUsuario, getUsuario } from "../services/usuarioService";

const PerfilScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaConfirmar, setSenhaConfirmar] = useState("");
    const [placeholderNome, setPlaceholderNome] = useState("Nome");
    const [placeholderEmail, setPlaceholderEmail] = useState("Email");
    const [refreshing, setRefreshing] = useState(false);

    const carregarUsuario = async () => {
        try {
            const id = await AsyncStorage.getItem("usuario_id");
            if (!id) return;
            const user = await getUsuario(id);
            if (user.nome) setPlaceholderNome(user.nome);
            if (user.email) setPlaceholderEmail(user.email);
        } catch (error) {
            console.error("Erro ao carregar usuário:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            carregarUsuario();
        }
    }, [isFocused]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        carregarUsuario();
    }, []);

    async function editar() {
        if (senha) {
            if (senha !== senhaConfirmar) {
                Toast.show({ type: "error", text1: "Senhas não coincidem" });
                return;
            }
            const senhaRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
            if (!senhaRegex.test(senha)) {
                Toast.show({
                    type: "error",
                    text1: "Senha fraca",
                    text2: "Use pelo menos 8 caracteres, 1 maiúscula e 1 caractere especial"
                });
                return;
            }
        }

        if (email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim())) {
                Toast.show({ type: "error", text1: "Email inválido" });
                return;
            }
        }

        try {
            const id = await AsyncStorage.getItem("usuario_id");
            if (!id) {
                Toast.show({ type: "error", text1: "ID do usuário não encontrado" });
                return;
            }

            const dados = {};
            if (nome.trim()) dados.nome = nome;
            if (email.trim()) dados.email = email;
            if (senha.trim()) dados.senha = senha;

            await editarUsuario(id, dados);
            Toast.show({ type: "success", text1: "Perfil atualizado com sucesso" });

            if (nome) await AsyncStorage.setItem("nome", nome);
            if (email) await AsyncStorage.setItem("email", email);
            
            // Recarrega os dados do usuário após editar
            await carregarUsuario();
            
            // Limpa os campos após salvar
            setNome("");
            setEmail("");
            setSenha("");
            setSenhaConfirmar("");
        } catch (error) {
            console.error("Erro ao editar perfil:", error);
            Toast.show({ type: "success", text1: "Perfil atualizado com sucesso" });
        }
    }

    async function handleLogout() {
        await AsyncStorage.clear();
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        });
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Header />

            <View style={styles.container}>
                <Text style={styles.titulo}>Seu Perfil</Text>
                {/* Botão para ir ao carrinho */}
                <TouchableOpacity
                    style={styles.carrinho}
                    onPress={() => navigation.navigate("Carrinho")}
                >
                    <Text style={styles.carrinhoTxt}>Ir para o Carrinho</Text>
                </TouchableOpacity>
                <Text style={styles.section}>Alterar Dados de Usuário</Text>
                <Input placeholder={placeholderNome} value={nome} onChangeText={setNome} />
                <Input placeholder={placeholderEmail} value={email} onChangeText={setEmail} />

                <Text style={styles.section}>Alterar Senha</Text>
                <Input placeholder="Nova Senha" value={senha} onChangeText={setSenha} secureTextEntry />
                <Input placeholder="Confirmar Nova Senha" value={senhaConfirmar} onChangeText={setSenhaConfirmar} secureTextEntry />

                <BtnEnviar title="Salvar Mudanças" onPress={editar} />



                <TouchableOpacity onPress={handleLogout} style={styles.sair}>
                    <Text style={styles.sairTxt}>Sair</Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginTop: 110 }}>
                <Footer />
            </View>

            <Toast />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        margin: 20,
        gap: 5 },
    titulo: {
        fontWeight: "bold",
        fontSize: 22},
    section: {
        fontWeight: "bold",
        fontSize: 16,
        marginVertical: 20,
        alignSelf: "flex-start" },
    sair: {
        backgroundColor: colors.vermelho,
        paddingVertical: 10,
        borderRadius: 9,
        alignItems: "center",
        width: "50%",
        marginTop: 10 },
    sairTxt: {
        color: colors.branco,
        fontSize: 20,
        fontWeight: "bold" },
    carrinho: {
        backgroundColor: colors.azul,
        paddingVertical: 10,
        borderRadius: 9,
        alignItems: "center",
        width: "50%",
        marginTop: 10 },
    carrinhoTxt: {
        color: colors.branco,
        fontSize: 20,
        fontWeight: "bold" },
});

export default PerfilScreen;
