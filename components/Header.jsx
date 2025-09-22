import React from 'react';
import {TouchableOpacity, Text, StyleSheet, TextInput, View, Image} from 'react-native';
import colors from "../design/colors";

export default function Header() {
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../assets/logo.png')} />
            <View style={styles.search}>
                {/* O TextInput e o botão de pesquisa ficam lado a lado */}
                <TextInput
                    style={styles.searchInput} // Estilo para o campo de texto
                    placeholder="Buscar na AutoPrime"
                    placeholderTextColor={colors.cinza_escuro}
                />
                <TouchableOpacity style={styles.searchButton}>
                    {/* A imagem do ícone de pesquisa */}
                    <Image
                        source={require("../assets/search.png")} // Substitua pelo caminho da sua imagem
                        style={styles.searchIcon}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity >
                <Image style={styles.user}  source={require("../assets/user.png")}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.preto,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 60,
    },
    search: {
        margin: 5,
        marginRight: -40,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.branco,
        borderRadius: 20,
        height: 35,
    },
    searchInput: {
        height: '100%',
        paddingHorizontal: 30,
    },
    searchButton: {
        backgroundColor: colors.azul_vibrante,
        height: '80%',
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    searchIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    user:{
        height: 30,
    },
    logo:{
        width: 80,
        height: 80,
        marginRight:-20,
    },
});