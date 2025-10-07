import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TextInput, View, Image } from 'react-native';
import colors from "../design/colors";

export default function Footer() {
    return (
        <View style={styles.footer}>
            <Image style={styles.logo} source={require('../assets/logo.png')} />
        </View>
    )
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: colors.preto,
        height: 100,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    logo: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    }
})