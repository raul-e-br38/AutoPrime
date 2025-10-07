import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // <-- Importando o hook de navegação
import Header from '../components/Header';
import Footer from '../components/Footer';
import colors from "../design/colors";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Verifique se o AsyncStorage está importado corretamente

const PerfilScreen = () => {
    const navigation = useNavigation(); // <-- Usando o hook useNavigation para obter a navegação

    // Função para sair e redirecionar para a tela de Login
    const handleLogout = async () => {
        await AsyncStorage.clear(); // Limpa os dados de login no AsyncStorage
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }], // Redireciona para a tela de Login
        });
    };

    return (
        <ScrollView>
            <Header />
            <View style={styles.sairDiv}>
                <TouchableOpacity onPress={handleLogout} style={styles.sair}>
                    <Text style={styles.sairTxt}>Sair</Text>
                </TouchableOpacity>
            </View>
            <View style={{marginTop:520}} >
                <Footer />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    sairDiv: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    sair: {
        backgroundColor: colors.vermelho,
        paddingVertical: 10,
        borderRadius: 9,
        alignItems: 'center',
        width: '50%',
        marginTop: 10,
    },
    sairTxt: {
        color: colors.branco,
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default PerfilScreen;