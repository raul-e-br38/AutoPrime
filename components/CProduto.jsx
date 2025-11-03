import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import colors from "../design/colors";
import API_URL from '../services/apiConfig';

export default function CProduto({ nome, marca, quantidade, valor_unitario, valor_total, imagem, id_item, onRemover }) {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const handleRemover = () => {
        if (onRemover && id_item) {
            onRemover(id_item);
        }
    };

    return (
        <View style={styles.produto}>
            <View style={styles.imageContainer}>
                {!imageError && imagem ? (
                    <Image
                        style={styles.foto}
                        source={{ uri: `${API_URL}/static/imagens/${imagem}` }}
                        onError={handleImageError}
                    />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Erro ao carregar a imagem</Text>
                    </View>
                )}
            </View>

            <Text style={styles.nome}>{nome || 'Produto'}</Text>
            <Text style={styles.marca}>Marca: {marca || 'N/A'}</Text>
            <Text style={styles.preco}>Preço Uni: R$ {parseFloat(valor_unitario || 0).toFixed(2)}</Text>
            <Text style={styles.preco}>Preço Total: R$ {parseFloat(valor_total || 0).toFixed(2)}</Text>
            <Text style={styles.quantidade}>Qtd: {quantidade || 0}</Text>
            
            {onRemover && (
                <TouchableOpacity style={styles.btnRemover} onPress={handleRemover}>
                    <Text style={styles.btnRemoverText}>Remover</Text>
                </TouchableOpacity>
            )}
        </View>
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
    marca: { color: colors.azul_fonte,  fontWeight: "500", marginBottom: 5 },
    preco: { color: colors.azul_fonte, fontWeight: "bold", marginBottom: 5 },
    quantidade: { color: colors.azul_fonte, fontWeight: "500", marginBottom: 10 },
    btnRemover: {
        backgroundColor: colors.azul_vibrante,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 5,
    },
    btnRemoverText: {
        color: colors.branco,
        fontSize: 14,
        fontWeight: 'bold',
    },
    placeholderContainer: { width: 100, height: 100, backgroundColor: colors.cinza, justifyContent: 'center', alignItems: 'center', borderRadius: 5 },
    placeholderText: { color: colors.azul_fonte, fontSize: 12, textAlign: 'center' },
});
