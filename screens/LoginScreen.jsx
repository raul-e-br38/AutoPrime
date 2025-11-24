import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import Input from '../components/Input';
import BtnEnviar from '../components/BtnEnviar';
import colors from "../design/colors";
import { login } from "../services/autenticacaoService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = async () => {

        console.log("EMAIL:", email, "SENHA:", senha); // Debug!

        try {
            if (!email || !senha) {
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: 'Preencha email e senha',
                });
                return;
            }

            const userData = await login(email, senha);

            if (userData.error) {
                Toast.show({ type: 'error', text1: 'Erro', text2: userData.error });
                return;
            }

            if (!userData.token) {
                Toast.show({ type: 'error', text1: 'Erro', text2: 'Token não recebido do servidor' });
                return;
            }

            // Salva dados no AsyncStorage
            await AsyncStorage.setItem("token", userData.token);
            await AsyncStorage.setItem("nome", userData.nome);
            await AsyncStorage.setItem("email", email); // <<< Correção: salva email
            if (userData.id_cadastro) {
                await AsyncStorage.setItem("usuario_id", String(userData.id_cadastro));
            } else {
                console.warn("ID do usuário não recebido do servidor");
            }

            console.log("TOKEN, NOME, EMAIL e ID SALVOS:", userData.token, userData.nome, email, userData.id_cadastro);

            Toast.show({
                type: 'success',
                text1: `Bem-vindo, ${userData.nome}!`,
                text2: 'Login realizado com sucesso.',
            });

            navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
            });

        } catch (error) {
            let mensagemErro = 'Erro ao fazer login, tente novamente.';
            console.error("[LoginScreen] Erro completo:", error);
            console.error("[LoginScreen] Mensagem de erro:", error.message);
            
            // Usa a mensagem específica do erro se disponível
            if (error.message) {
                mensagemErro = error.message;
            } else if (error.message && error.message.includes('Network request failed')) {
                mensagemErro = 'Erro de conexão. Verifique se a API está rodando.';
            }

            Toast.show({
                type: 'error',
                text1: 'Erro no Login',
                text2: mensagemErro,
                visibilityTime: 4000,
            });
        }
    };

    return (
        <ImageBackground
            source={require("../assets/fundoLogin.jpg")}
            style={styles.fundo}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Text style={styles.text}>Login</Text>
                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Input
                    placeholder="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                />

                <View style={styles.cadastroContainer}>
                    <Text style={styles.txt}>Não tem uma conta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                        <Text style={styles.cadastroText}>Cadastre-se</Text>
                    </TouchableOpacity>
                </View>

                <BtnEnviar onPress={handleLogin} title="Entrar" />
            </View>

            <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    fundo: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        alignItems: 'center',
        backgroundColor: colors.cinza_claro,
        padding: 35,
        gap: 15,
        borderRadius: 20,
        marginTop: 250,
    },
    text: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 25,
    },
    cadastroContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
    },
    cadastroText: {
        color: colors.azul_vibrante,
        fontWeight: 'bold',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 40,
        resizeMode: 'contain',
    },
    txt: {
        fontWeight: 'bold',
    }
});
