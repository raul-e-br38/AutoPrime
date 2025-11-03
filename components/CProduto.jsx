import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import colors from "../design/colors";
import API_URL from '../services/apiConfig';

export default function CProduto({ nome, marca, quantidade, valor_unitario, valor_total, imagem }) {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <TouchableOpacity style={styles.produto}>
            <View style={styles.imageContainer}>
                {!imageError && imagem ? (
                    <Image
                        style={styles.foto}
                        source={{ uri: `${API_URL}/static/imagens/${imagem}` }}
                        onError={handleImageError}
                    />
                ) : (
                    <Image style={styles.foto} source={require('../assets/audi.png')} />
                )}
            </View>

            <Text style={styles.nome}>{nome}</Text>
            <Text style={styles.marca}>Marca: {marca}</Text>
            <Text style={styles.preco}>Preço Uni: R$ {valor_unitario.toFixed(2)}</Text>
            <Text style={styles.preco}>Preço Total: R$ {valor_total.toFixed(2)}</Text>
            <Text style={styles.quantidade}>Qtd: {quantidade}</Text>
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
    imageContainer: { alignItems: 'center', marginBottom: 15 },
    foto: { width: 100, height: 100, resizeMode: 'contain' },
    nome: { color: colors.azul_fonte, fontWeight: "500", marginBottom: 5 },
    marca: { color: colors.azul_fonte, marginBottom: 5 },
    preco: { color: colors.azul_fonte, fontWeight: "bold" },
    quantidade: { color: colors.azul_fonte, fontWeight: "500" },
});
