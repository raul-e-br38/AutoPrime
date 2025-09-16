import React from 'react';
import {TextInput, View, StyleSheet, ScrollView} from 'react-native';
import colors from "../design/colors";

export default function Input({placeholder}) {
    return (
        <TextInput style={styles.input} placeholder={placeholder}/>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 35,
        width: '100%',
        borderRadius: 20,
        backgroundColor: colors.branco,
        color: colors.cinza_medio,
        paddingHorizontal: 15,    }
});


