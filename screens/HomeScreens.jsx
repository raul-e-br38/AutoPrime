import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Button, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import Marcas from "../components/Marcas";

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
        <ScrollView>
            <Header/>
            <View style={styles.container}>
                <Marcas/>
                <Button title="Sair" onPress={handleLogout} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    text: { fontSize: 16, textAlign: 'center', marginBottom: 20 }
});

export default HomeScreens;
