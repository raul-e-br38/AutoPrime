import React from 'react';
import {TouchableOpacity, Text, StyleSheet, TextInput, View, Image} from 'react-native';
import colors from "../design/colors";

export default function Marcas(){
    return (
            <TouchableOpacity style={styles.circle}>
                <Image source={require('../assets/fiat.png')} style={styles.logo} resizeMode="contain" />
            </TouchableOpacity>


    )
}

const styles = StyleSheet.create({

    circle: {
        width: 100,
        height: 100,
        borderRadius: 60,
        backgroundColor: colors.branco,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    logo: {
        width: 60,
        height: 60,
    },
})