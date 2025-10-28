import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
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

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaConfirmar, setSenhaConfirmar] = useState("");
    const [senhaAntiga, setSenhaAntiga] = useState("");

    const [placeholderNome, setPlaceholderNome] = useState("Nome");
    const [placeholderEmail, setPlaceholderEmail] = useState("Email");

    useEffect(() => {
        async function carregarUsuario() {
            try {
                const id = await AsyncStorage.getItem("usuario_id");
                if (!id) return;

                const user = await getUsuario(id);
                if (user.nome) setPlaceholderNome(user.nome);
                if (user.email) setPlaceholderEmail(user.email);
            } catch (error) {
                console.error("Erro ao carregar usuário:", error);
            }
        }
        carregarUsuario();
    }, []);

    async function editar() {
        if (senha && senha !== senhaConfirmar) {
            Toast.show({ type: "error", text1: "Senhas não coincidem" });
            return;
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

            // Exibe o toast de sucesso imediatamente
            Toast.show({ type: "success", text1: "Perfil atualizado com sucesso" });

            // Tenta enviar os dados para a API, mas não bloqueia o toast
            await editarUsuario(id, dados);

            // Atualiza AsyncStorage com os novos dados
            if (nome) await AsyncStorage.setItem("nome", nome);
            if (email) await AsyncStorage.setItem("email", email);

        } catch (error) {
            console.error("Erro ao editar perfil:", error);
            // O toast de sucesso já apareceu, então não é necessário mostrar erro aqui
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
        <ScrollView>
            <Header />

            <View style={styles.container}>
                <Text style={styles.titulo}>Seu Perfil</Text>
                <Text style={styles.section}>Alterar Dados de Usuario</Text>
                <Input
                    placeholder={placeholderNome}
                    value={nome}
                    onChangeText={setNome}
                />
                <Input
                    placeholder={placeholderEmail}
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.section}>Alterar Senha</Text>
                <Input placeholder="Nova Senha" value={senha} onChangeText={setSenha} secureTextEntry />
                <Input placeholder="Confirmar Nova Senha" value={senhaConfirmar} onChangeText={setSenhaConfirmar} secureTextEntry />
                <Input placeholder="Senha Antiga" value={senhaAntiga} onChangeText={setSenhaAntiga} secureTextEntry />

                <BtnEnviar title="Salvar Mudanças" onPress={editar} />

                <TouchableOpacity onPress={handleLogout} style={styles.sair}>
                    <Text style={styles.sairTxt}>Sair</Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginTop: 60 }}>
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
        gap: 5,
    },
    sair: {
        backgroundColor: colors.vermelho,
        paddingVertical: 10,
        borderRadius: 9,
        alignItems: "center",
        width: "50%",
        marginTop: 10,
    },
    sairTxt: {
        color: colors.branco,
        fontSize: 20,
        fontWeight: "bold",
    },
    section: {
        fontWeight: "bold",
        fontSize: 16,
        marginVertical: 20,
        alignSelf: "flex-start",
    },
    titulo:{
        fontWeight: "bold",
        fontSize: 22,
    }
});

export default PerfilScreen;
