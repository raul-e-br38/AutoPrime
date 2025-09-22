import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import Input from '../components/Input';
import BtnEnviar from '../components/BtnEnviar';
import colors from "../design/colors";
import { login } from "../services/autenticacaoService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = async () => {
        try {
            const userData = await login(email, senha);

            // Salva token no AsyncStorage
            await AsyncStorage.setItem("token", userData.token);

            Alert.alert("Sucesso", `Bem-vindo, ${userData.nome}`);
            navigation.navigate("Home");
        } catch (error) {
            Alert.alert("Erro", error.message);
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

                <Input placeholder="Email" value={email} onChangeText={setEmail} />
                <Input placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

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
