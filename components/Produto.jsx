import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import colors from "../design/colors";
import { useNavigation } from '@react-navigation/native';

export default function Produto({ nome, preco, imagem, marca, descricao }) {
    const navigation = useNavigation();
    const [imageError, setImageError] = useState(false);

    const produto = { nome, preco, imagemUrl: imagem, descricao, marca };


    const comprar = () => {
        console.log("Produto enviado para a tela:", produto);
        navigation.navigate('Produto', {
            produto: { nome, preco, descricao, imagem, marca }
        });
    };

    const handleImageError = () => {
        console.log("Erro ao carregar imagem do produto:", nome);
        setImageError(true);
    };

    const handleImageLoad = () => {
        console.log("Imagem carregada com sucesso:", nome);
        setImageError(false);
    };

    console.log("URL da imagem:", imagem ? `http://192.168.1.122:5000/static/imagens/${imagem}` : "placeholder")


    return (
        <TouchableOpacity style={styles.produto} onPress={comprar}>
            <View style={styles.imageContainer}>
                {!imageError && imagem ? (
                    <Image
                        style={styles.foto}
                        source={{
                            uri: `http://192.168.1.122:5000/static/imagens/${imagem}`
                        }}
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                    />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Erro ao carregar a imagem</Text>
                    </View>
                )}
            </View>

            <Text style={styles.nome}>{nome}</Text>
            <Text style={styles.preco}>R${preco.toFixed(2)}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    produto: {
        backgroundColor: colors.branco,
        padding: 20,
        width: '48%',
        borderRadius: 5,
        marginBottom: 10,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    foto: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    placeholderContainer: {
        width: 100,
        height: 100,
        backgroundColor: colors.cinza,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    placeholderText: {
        color: colors.azul_fonte,
        fontSize: 12,
        textAlign: 'center',
    },
    nome: {
        color: colors.azul_fonte,
        fontWeight: "500",
        marginBottom: 5,
    },
    preco: {
        color: colors.azul_fonte,
        fontWeight: "bold",
    },
});