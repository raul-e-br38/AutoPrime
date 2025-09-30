import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from "../design/colors";

const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
    });
};


export default function Btn2({ title }) {
    return (
        <TouchableOpacity style={styles.btn} onPress={handleLogout}>
            <Text style={styles.btnTxt}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: colors.vermelho,
        paddingVertical: 10,
        borderRadius: 9,
        alignItems: 'center',
        width: '65%',
        marginTop: 10,
    },
    btnTxt: {
        color: colors.branco,
        fontSize: 16,
        fontWeight: 'bold',
    }
});
