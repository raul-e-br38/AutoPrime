import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import Input from '../components/Input';
import BtnEnviar from '../components/BtnEnviar';
import colors from "../design/colors";
import { login } from "../services/autenticacaoService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message'; // <--- novo

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = async () => {

        console.log("EMAIL:", email, "SENHA:", senha); // Debug!
        // Bloco "try" para capturar possíveis erros durante o login.


        try {

            if (!email || !senha) {
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: 'Preencha email e senha 😤',
                });
                return;
            }

            // Chama a função assíncrona "login" enviando email e senha.
            // Espera a resposta do servidor e armazena em "userData".
            const userData = await login(email, senha);

            if (userData.error) {
                Toast.show({ type: 'error', text1: 'Erro', text2: userData.error });
                return;
            }
            // Verifica se o servidor não enviou um token de autenticação.
            if (!userData.token) {
                Toast.show({ type: 'error', text1: 'Erro', text2: 'Token não recebido do servidor' });
                return;
            }
            // Salva o token do usuário no armazenamento local do app (persistência).
            await AsyncStorage.setItem("token", userData.token);
            await AsyncStorage.setItem("nome", userData.nome);

            console.log("TOKEN E NOME SALVOS:", userData.token, userData.nome);// Mostra no console os dados salvos



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
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: error.message || 'Erro ao fazer login 😢',
            });
        }
    };

    return (
        <ImageBackground
            source={require("../assets/fundoLogin.jpg")}//importa o arquivo local
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
        fontSize: 22,
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