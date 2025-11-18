import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from "../design/colors";
import API_URL from "../services/apiConfig";

export default function CProduto({
                                     nome,
                                     quantidade,
                                     valor_total,
                                     imagem,
                                     id_item,
                                     onIncrement,
                                     onDecrement,
                                     onRemover
                                 }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const imagemLimpa =
        imagem && typeof imagem === "string" && imagem.trim() !== "" && imagem !== "null"
            ? imagem.trim()
            : null;

    const imageUrl = imagemLimpa ? `${API_URL}/static/imagens/${imagemLimpa}` : null;

    return (
        <View style={styles.container}>
            <View style={styles.imageWrapper}>
                {loading && !error && (
                    <ActivityIndicator size="small" color={Colors.azul_vibrante} />
                )}

                {!error && imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={[styles.image, loading && { opacity: 0.4 }]}
                        onLoad={() => setLoading(false)}
                        onError={() => {
                            setError(true);
                            setLoading(false);
                        }}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={styles.fallback}>
                        <Text style={styles.fallbackText}>Erro ao carregar imagem</Text>
                    </View>
                )}
            </View>

            <View style={styles.info}>
                <Text style={styles.name}>{nome}</Text>
                <Text style={styles.price}>R$ {valor_total.toFixed(2)}</Text>

                <View style={styles.row}>
                    <TouchableOpacity
                        style={styles.qtdBtn}
                        onPress={() => onDecrement(id_item, quantidade)}
                    >
                        <Text style={styles.qtdText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtdNumber}>{quantidade}</Text>

                    <TouchableOpacity
                        style={styles.qtdBtn}
                        onPress={() => onIncrement(id_item, quantidade)}
                    >
                        <Text style={styles.qtdText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity onPress={() => onRemover(id_item)}>
                <Ionicons name="trash-bin" size={26} color={Colors.red} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        marginHorizontal: 10
    },
    imageWrapper: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: 70,
        height: 70
    },
    fallback: {
        width: 70,
        height: 70,
        backgroundColor: Colors.cinza_claro,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8
    },
    fallbackText: {
        fontSize: 9,
        color: Colors.cinza_medio,
        textAlign: "center"
    },
    info: {
        flex: 1
    },
    name: {
        fontSize: 16,
        fontWeight: "bold"
    },
    price: {
        fontSize: 14,
        color: Colors.azul_vibrante
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6
    },
    qtdBtn: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: Colors.cinza_claro,
        alignItems: "center",
        justifyContent: "center"
    },
    qtdText: {
        fontSize: 18,
        fontWeight: "bold"
    },
    qtdNumber: {
        fontSize: 16,
        fontWeight: "bold",
        marginHorizontal: 10
    }
});
