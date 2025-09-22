import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import BtnEnviar from '../components/BtnEnviar';
import colors from "../design/colors";
import { cadastro } from "../services/autenticacaoService";
import RNPickerSelect from "react-native-picker-select";

// Função de validação de senha
function validarSenha(senha) {
    const requisitos = {
        minLength: senha.length >= 8,
        hasUpperCase: /[A-Z]/.test(senha),
        hasNumber: /[0-9]/.test(senha),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
    };

    return {
        valida: requisitos.minLength && requisitos.hasUpperCase && requisitos.hasNumber && requisitos.hasSpecial,
        requisitos: requisitos
    };
}

export default function CadastroScreen({ navigation }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cargo, setCargo] = useState("");
    const [senha, setSenha] = useState("");
    const [erroSenha, setErroSenha] = useState("");

    // Validação em tempo real
    const handleSenhaChange = (text) => {
        setSenha(text);
        if (text.length > 0) {
            const validacao = validarSenha(text);
            if (!validacao.valida) {
                setErroSenha("Senha deve ter: 8 caracteres, maiúscula, número e caractere especial");
            } else {
                setErroSenha("");
            }
        } else {
            setErroSenha("");
        }
    };

    const handleCadastro = async () => {
        console.log("VALORES PREENCHIDOS:", {
            nome: nome,
            email: email,
            cargo: cargo,
            senha: senha,
            nomeLength: nome.length,
            nomeTrimLength: nome.trim().length
        });

        // Validação simplificada para teste
        if (!nome || nome.trim().length === 0) {
            Alert.alert("Erro", "Por favor, preencha o nome.");
            return;
        }

        if (!email || email.trim().length === 0) {
            Alert.alert("Erro", "Por favor, preencha o email.");
            return;
        }

        if (!cargo) {
            Alert.alert("Erro", "Por favor, selecione um cargo.");
            return;
        }

        if (!senha || senha.trim().length === 0) {
            Alert.alert("Erro", "Por favor, preencha a senha.");
            return;
        }

        const validacao = validarSenha(senha);
        if (!validacao.valida) {
            Alert.alert("Erro na Senha", "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.");
            return;
        }

        try {
            const res = await cadastro(nome, email, cargo, senha);
            Alert.alert("Sucesso", res.mensagem);
            navigation.navigate("Login");
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
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Text style={styles.text}>Cadastre-se</Text>

                    {/* Input de Nome DIRETO (sem componente customizado) */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            placeholderTextColor={colors.cinza_medio}
                            value={nome}
                            onChangeText={setNome}
                            autoCapitalize="words"
                        />
                    </View>

                    {/* Input de Email DIRETO */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={colors.cinza_medio}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* SELECT de CARGO */}
                    <View style={styles.pickerContainer}>
                            <RNPickerSelect
                            onValueChange={(value) => setCargo(value)}
                            items={[
                                { label: "Vendedor", value: "Vendedor" },
                                { label: "Cliente", value: "Cliente" },
                            ]}
                            placeholder={{
                                label: "Selecione seu cargo...",
                                value: null
                            }}
                            style={pickerSelectStyles}
                            value={cargo}
                            useNativeAndroidPickerStyle={false}
                        />
                    </View>

                    {/* Input de Senha DIRETO */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Senha"
                            placeholderTextColor={colors.cinza_medio}
                            value={senha}
                            onChangeText={handleSenhaChange}
                            secureTextEntry
                        />
                    </View>

                    {erroSenha ? (
                        <Text style={styles.erroTexto}>{erroSenha}</Text>
                    ) : null}

                    <Text style={styles.termos}>
                        Ao continuar você concorda com nossos{" "}
                        <Text style={styles.bold}>Termos de Política e Privacidade</Text>
                    </Text>

                    <View style={styles.cadastroContainer}>
                        <Text style={styles.txt}>Já tem uma conta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.cadastroText}>Login</Text>
                        </TouchableOpacity>
                    </View>

                    <BtnEnviar onPress={handleCadastro} title="Cadastrar-se" />


                </View>

                <Image
                    source={require("../assets/logo.png")}
                    style={styles.logo}
                />
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    fundo: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 40,
    },
    container: {
        width: '85%',
        alignItems: 'center',
        backgroundColor: colors.cinza_claro,
        padding: 35,
        gap: 16,
        borderRadius: 20,
        marginTop: 160,
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
    },
    input: {
        height: 45,
        width: 280,
        borderRadius: 20,
        backgroundColor: colors.branco,
        paddingHorizontal: 15,
        fontSize: 14,
    },
    pickerContainer: {
        width: '100%',
        alignItems: 'center',
    },
    label: {
        alignSelf: 'flex-start',
        marginBottom: 5,
        fontWeight: 'bold',
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
        marginTop: 20,
        resizeMode: 'contain',
    },
    txt: {
        fontWeight: 'bold',

    },
    termos: {
        textAlign: 'center',
        fontSize: 12,
    },
    bold: {
        fontWeight: 'bold',
    },
    erroTexto: {
        color: 'red',
        fontSize: 12,
        textAlign: 'center',
        marginTop: -10,
    },

});

const pickerSelectStyles = StyleSheet.create({
    inputAndroid: {
        height: 45,
        width: 280,
        borderRadius: 20,
        backgroundColor: colors.branco,
        paddingHorizontal: 15,
        fontSize: 14,
        justifyContent: "center",
    },
    placeholder: {
        color: colors.cinza_medio,
    },
});