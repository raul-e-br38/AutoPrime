import React, { useState } from 'react';  // Importando React e useState para gerenciar o estado
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';  // Componentes do React Native
import BtnEnviar from '../components/BtnEnviar';  // Componente personalizado de botão de envio
import colors from "../design/colors";  // Arquivo de cores para o design da app
import { cadastro } from "../services/autenticacaoService";  // Função de cadastro do serviço de autenticação
import RNPickerSelect from "react-native-picker-select";  // Componente de seleção (dropdown) para escolher cargo
import Toast from 'react-native-toast-message';  // Componente para mostrar mensagens de sucesso ou erro

// Função de validação da senha
function validarSenha(senha) {
    const requisitos = {
        minLength: senha.length >= 8,  // A senha deve ter pelo menos 8 caracteres
        hasUpperCase: /[A-Z]/.test(senha),  // Deve conter uma letra maiúscula
        hasNumber: /[0-9]/.test(senha),  // Deve conter um número
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),  // Deve conter um caractere especial
    };

    return {
        valida: requisitos.minLength && requisitos.hasUpperCase && requisitos.hasNumber && requisitos.hasSpecial,  // Retorna se a senha é válida ou não
        requisitos: requisitos  // Retorna todos os requisitos para uso posterior, caso necessário
    };
}

// Componente principal da tela de Cadastro
export default function CadastroScreen({ navigation }) {
    // Estado dos campos de entrada do formulário
    const [nome, setNome] = useState("");  // Nome do usuário
    const [email, setEmail] = useState("");  // Email do usuário
    const [cargo, setCargo] = useState("Vendedor");  // Cargo do usuário
    const [senha, setSenha] = useState("");  // Senha do usuário
    const [erroSenha, setErroSenha] = useState("");  // Erro de validação da senha

    // Função para lidar com a mudança de senha
    const handleSenhaChange = (text) => {
        setSenha(text);  // Atualiza o estado da senha
        if (text.length > 0) {
            const validacao = validarSenha(text);  // Valida a senha à medida que o usuário digita
            if (!validacao.valida) {
                setErroSenha("Senha deve ter: 8 caracteres, maiúscula, número e caractere especial");
            } else {
                setErroSenha("");  // Se a senha for válida, limpa a mensagem de erro
            }
        } else {
            setErroSenha("");  // Se a senha estiver vazia, limpa a mensagem de erro
        }
    };

    // Função para lidar com o envio do formulário de cadastro
    const handleCadastro = async () => {
        // Validações dos campos antes de enviar o formulário
        if (!nome || nome.trim().length === 0) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Por favor, preencha o nome.' });
            return;
        }

        if (!email || email.trim().length === 0) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Por favor, preencha o email.' });
            return;
        }

        if (!cargo) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Por favor, selecione um cargo.' });
            return;
        }

        if (!senha || senha.trim().length === 0) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Por favor, preencha a senha.' });
            return;
        }

        // Validação da senha
        const validacao = validarSenha(senha);
        if (!validacao.valida) {
            Toast.show({ type: 'error', text1: 'Erro na Senha', text2: 'A senha deve ter 8 caracteres, maiúscula, número e caractere especial.' });
            return;
        }

        try {
            // Envia os dados para o serviço de cadastro

            const res = await cadastro(nome, email, cargo, senha);
            Toast.show({ type: 'success', text1: 'Sucesso!', text2: res.mensagem });
            navigation.navigate("Login");  // Navega para a tela de login após sucesso
        } catch (error) {
            console.log('Senha:',senha,"Nome:", nome,"Email:", email,"Cargo:", cargo);
            console.log(error);
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Erro de Conexão, Tente Novamente' });
        }
    };

    return (
        // Tela de fundo com imagem
        <ImageBackground
            source={require("../assets/fundoLogin.jpg")}
            style={styles.fundo}
            resizeMode="cover"
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Text style={styles.text}>Cadastre-se</Text>

                    {/* Campo de nome */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            placeholderTextColor={colors.cinza_medio}
                            value={nome}
                            onChangeText={setNome}
                            autoCapitalize="words"  // Capitaliza automaticamente a primeira letra de cada palavra
                        />
                    </View>

                    {/* Campo de email */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={colors.cinza_medio}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"  // Formato de teclado adequado para e-mail
                            autoCapitalize="none"  // Não capitaliza o e-mail
                        />
                    </View>


                    {/* Campo de senha */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Senha"
                            placeholderTextColor={colors.cinza_medio}
                            value={senha}
                            onChangeText={handleSenhaChange}  // Chama a função de validação da senha
                            secureTextEntry  // Torna o campo de senha oculto
                        />
                    </View>

                    {/* Exibe a mensagem de erro se a senha for inválida */}
                    {erroSenha ? <Text style={styles.erroTexto}>{erroSenha}</Text> : null}

                    {/* Termos de Política e Privacidade */}
                    <Text style={styles.termos}>
                        Ao continuar você concorda com nossos <Text style={styles.bold}>Termos de Política e Privacidade</Text>
                    </Text>

                    {/* Link para a tela de login caso já tenha conta */}
                    <View style={styles.cadastroContainer}>
                        <Text style={styles.txt}>Já tem uma conta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.cadastroText}>Login</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Botão de envio para cadastro */}
                    <BtnEnviar onPress={handleCadastro} title="Cadastrar-se" />
                </View>

                {/* Logo da aplicação */}
                <Image source={require("../assets/logo.png")} style={styles.logo} />
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