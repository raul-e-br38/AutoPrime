import React, { useState } from 'react';
import { TouchableOpacity, TextInput, View, Image, StyleSheet, Text } from 'react-native';
import colors from "../design/colors";

export default function Header({ onSearch }) {
    const [searchText, setSearchText] = useState("");

    const handleSearch = () => {
        if (onSearch && searchText.trim() !== "") {
            onSearch(searchText.trim());
        }
    };
    const perfil = () => {
        navigation.navigate('PerfilScreen'); // <-- coloque o nome da tela que você quer ir
    };
    return (
        <View>
            <View style={styles.preto}><Text></Text></View>
            <View style={styles.container}>
                <Image style={styles.logo} source={require('../assets/logo.png')} />
                <View style={styles.search}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar na AutoPrime"
                        placeholderTextColor={colors.cinza}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Image source={require("../assets/search.png")} style={styles.searchIcon} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={perfil}>
                    <Image style={styles.user} source={require("../assets/user.png")} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

// Mantém seu styles igual


const styles = StyleSheet.create({
    preto: {
        padding: 5,
        backgroundColor: colors.preto,
    },
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
        paddingHorizontal: 25,
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
    user: {
        height: 30,
    },
    logo: {
        width: 80,
        height: 80,
        marginRight: -20,
    },
});