import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreens = ({ navigation }) => {
    const [nome, setNome] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            const t = await AsyncStorage.getItem('token');
            const n = await AsyncStorage.getItem('nome');
            setToken(t || "");
            setNome(n || "");
        };
        loadUser();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.clear();
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo, {nome || "usuário"}!</Text>
            <Text style={styles.text}>Seu token: {token || "não encontrado"}</Text>
            <Button title="Sair" onPress={handleLogout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    text: { fontSize: 16, textAlign: 'center', marginBottom: 20 }
});

export default HomeScreens;
