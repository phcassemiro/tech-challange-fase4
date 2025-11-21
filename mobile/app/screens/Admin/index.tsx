import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { PrivateRoute } from "../../../components/PrivateRoute";
import { NavigationProp } from "../../../RootStackParamList"; 

export default function Admin() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  const loadPosts = async () => {
    try {
      setLoading(true);
      // 🔄 URL AJUSTADA: removido "/api"
      const res = await fetch("http://10.0.2.2:3000/posts/professor");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar posts.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => { loadPosts(); }, [])
  );

  const handleDelete = async (id: string) => {
    Alert.alert("Confirmar", "Deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Excluir", 
        style: "destructive", 
        onPress: async () => {
          try {
            // 🔄 URL AJUSTADA: removido "/api"
            await fetch(`http://10.0.2.2:3000/posts/${id}`, { method: "DELETE" });
            loadPosts(); 
          } catch (error) {
            Alert.alert("Erro", "Erro ao excluir.");
          }
        }
      }
    ]);
  };

  return (
    <PrivateRoute role="professor">
      <View style={styles.container}>
        <Text style={styles.header}>Painel Admin</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#1A73E8" />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.title}>{item.titulo}</Text>
                <Text style={item.postAtivo ? styles.active : styles.inactive}>
                  {item.postAtivo ? "Ativo" : "Inativo"}
                </Text>
                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={styles.btnEdit}
                    onPress={() => navigation.navigate("EditPost", { id: item._id })}
                  >
                    <Text style={styles.btnText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnDel} onPress={() => handleDelete(item._id)}>
                    <Text style={styles.btnText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={<Text>Nenhum post.</Text>}
          />
        )}
      </View>
    </PrivateRoute>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: { backgroundColor: "#FFF", padding: 15, borderRadius: 8, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "bold" },
  active: { color: "green", fontWeight: "bold", marginBottom: 10 },
  inactive: { color: "red", fontWeight: "bold", marginBottom: 10 },
  actions: { flexDirection: "row", gap: 10 },
  btnEdit: { backgroundColor: "#1A73E8", paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 },
  btnDel: { backgroundColor: "#DC3545", paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 },
  btnText: { color: "#FFF", fontWeight: "bold" }
});