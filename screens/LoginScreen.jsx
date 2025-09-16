import React, { useState } from 'react';
import {View, Text, StyleSheet,ImageBackground, ScrollView, Image} from 'react-native';
import Input from '../components/Input';
import BtnEnviar from '../components/BtnEnviar';
import colors from "../design/colors";

export default function LoginScreen() {
    return (
        <ImageBackground source={require("../assets/fundoLogin.jpg")} style={styles.fundo}>
            <View style={styles.container}>
                <Text style={styles.text}>Login</Text>
                <Input placeholder={"Email"}/>
                <Input placeholder={"Senha"}/>
                <BtnEnviar/>
            </View>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    fundo: {
        resizeMode: "contain",
        flex: 1,
    },
    container: {
        alignItems: 'center',
        margin: 50,
        backgroundColor: colors.cinza_claro,
        padding: 35,
        gap: 15,
        borderRadius: 20,
        marginTop: 300  ,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 25,
        marginTop: -30,
    },
    logo:{
        alignSelf: 'center',
        marginTop: 200,
    },

})