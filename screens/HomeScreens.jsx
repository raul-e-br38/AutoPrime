import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import Marcas from "../components/Marcas";
import BtnEnviar from "../components/BtnEnviar"
import colors from "../design/colors";
import Produto from "../components/Produto";
import Footer from "../components/Footer";

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
            <Header />
            <View style={styles.container}>
                <Marcas />
                <Marcas />
                <Marcas />
            </View>
            <View style={styles.cadastrar}>
            <BtnEnviar title={"Cadastrar Produto"} />
            </View>
            <Text style={styles.titulo}>Explore Nosso Catálogo</Text>
            <View style={styles.produtos}>
                <Produto/>
                <Produto/>
                <Produto/>
                <Produto/>
            </View>


            <Button title="Sair" onPress={handleLogout} />
            <Footer/>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 25,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        flexDirection: 'row',
    },
    titulo:{
        fontSize: 16,
        textAlign: 'center',
        backgroundColor:colors.black,
        padding: 20,
        color: colors.white,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    cadastrar:{
        alignItems: 'center',
        justifyContent: 'center',
        margin: 30,
    },
    produtos: {
        backgroundColor:colors.cinza,
        padding: 20,
        boxShadow: colors.black,
        justifyContent: 'space-between',
        flexDirection: 'row',
        display: 'flex',
        flexWrap: 'wrap',
        rowGap: 10,
        marginVertical: 20,
    }
});

export default HomeScreens;
