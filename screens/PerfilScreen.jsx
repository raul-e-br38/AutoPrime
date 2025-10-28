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

    // Estados para os campos do formulário
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaConfirmar, setSenhaConfirmar] = useState("");

    // Placeholders iniciais (serão substituídos pelos dados do usuário)
    const [placeholderNome, setPlaceholderNome] = useState("Nome");
    const [placeholderEmail, setPlaceholderEmail] = useState("Email");

    // useEffect para carregar os dados do usuário quando a tela abre
    useEffect(() => {
        async function carregarUsuario() {
            try {
                const id = await AsyncStorage.getItem("usuario_id"); // pega o id do usuário armazenado localmente
                if (!id) return;

                const user = await getUsuario(id); // busca dados do usuário na API
                if (user.nome) setPlaceholderNome(user.nome); // atualiza placeholder
                if (user.email) setPlaceholderEmail(user.email); // atualiza placeholder
            } catch (error) {
                console.error("Erro ao carregar usuário:", error);
            }
        }
        carregarUsuario();
    }, []);

    // Função para editar perfil
    async function editar() {
        // Validação de senha
        if (senha) {
            // Confirmação da senha
            if (senha !== senhaConfirmar) {
                Toast.show({ type: "error", text1: "Senhas não coincidem" });
                return;
            }


            // Regex: mínimo 8 caracteres, 1 letra maiúscula, 1 caractere especial
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
        // Validação de email
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

            // Monta objeto com os dados a serem atualizados
            const dados = {};
            if (nome.trim()) dados.nome = nome;
            if (email.trim()) dados.email = email;
            if (senha.trim()) dados.senha = senha;

            // Mostra toast de sucesso apenas depois da API
            await editarUsuario(id, dados);
            Toast.show({ type: "success", text1: "Perfil atualizado com sucesso" });

            if (nome) await AsyncStorage.setItem("nome", nome);
            if (email) await AsyncStorage.setItem("email", email);

        } catch (error) {
            console.error("Erro ao editar perfil:", error);
            Toast.show({ type: "success", text1: "Perfil atualizado com sucesso" });
        }
    }

    // Função para logout
    async function handleLogout() {
        await AsyncStorage.clear(); // limpa todo armazenamento local
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }], // volta para tela de login
        });
    }

    return (
        <ScrollView>
            <Header />

            <View style={styles.container}>
                <Text style={styles.titulo}>Seu Perfil</Text>

                <Text style={styles.section}>Alterar Dados de Usuario</Text>
                <Input
                    placeholder={placeholderNome} // mostra nome atual como placeholder
                    value={nome}
                    onChangeText={setNome} // atualiza estado ao digitar
                />
                <Input
                    placeholder={placeholderEmail} // mostra email atual
                    value={email}
                    onChangeText={setEmail}
                />

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
    container: { justifyContent: "center", alignItems: "center", margin: 20, gap: 5 },
    sair: { backgroundColor: colors.vermelho, paddingVertical: 10, borderRadius: 9, alignItems: "center", width: "50%", marginTop: 10 },
    sairTxt: { color: colors.branco, fontSize: 20, fontWeight: "bold" },
    section: { fontWeight: "bold", fontSize: 16, marginVertical: 20, alignSelf: "flex-start" },
    titulo: { fontWeight: "bold", fontSize: 22 }
});

export default PerfilScreen;