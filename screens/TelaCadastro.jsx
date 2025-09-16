import React, { useState } from 'react';
import {View, Image, TextInput, TouchableOpacity, Text, StyleSheet, ImageBackground,} from 'react-native';

export default function TelaCadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cargo, setCargo] = useState('');
    const [senha, setSenha] = useState('');


    return (
        <ImageBackground source={require("../assets/CarroPreto.png")} style={styles.container}>
            <View style={styles.bg}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    placeholderTextColor="#888"
                    value={nome}
                    onChangeText={setNome}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="cargo"
                    placeholderTextColor="#888"
                    value={cargo}
                    onChangeText={setCargo}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#888"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={true}

                />
                <Text style={styles.politica}>Ao  continuar você concorda com nossos Termos de Política e Privacidade</Text>
                <TouchableOpacity style={styles.btn}>
                    <Text style={styles.btnTexto}>Cadastrar</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'black', // fundo preto
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    image: {
        width: 200,
        height: 120,
        marginBottom: 32,
    },
    input: {
        width: '90%',
        backgroundColor: '#666666',
        color: '#666666',
        borderRadius: 30,
        padding: 15,
        marginVertical: 8,
        fontSize: 16,
    },
    btn: {
        width: '70%',
        backgroundColor: '#008CFF',
        padding: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 16,
    },
    btnTexto: {
        color: '#666666',
        fontSize: 18,
        fontWeight: 'bold',
    },

    bg: {
        width: '90%',
        backgroundColor: '#666666',
        borderRadius: 24,
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',

    },
    politica: {
        textAlign: 'center',
        color: '#666666',
        marginVertical: 10,
    }
});