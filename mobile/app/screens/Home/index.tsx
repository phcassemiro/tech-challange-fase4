import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = "http://10.0.2.2:3000/api/posts"; // TROQUE PARA SUA API

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();

      // Filtra apenas posts ativos
      const ativos = data.filter((p) => p.postAtivo);

      setPosts(ativos);
    } catch (error) {
      console.log("Erro ao carregar posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const renderItem = ({ item }) => (
    <LinearGradient
      colors={["#e3f2fd", "#ffffff"]}
      style={styles.card}
    >
      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.description}>{item.descricao}</Text>

      <View style={styles.footer}>
        <Text style={styles.author}>@{item.autor}</Text>
        {item.dataCriacao && (
          <Text style={styles.date}>
            {item.dataCriacao}
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ver comentários</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={40} />
        <Text style={{ marginTop: 10 }}>Carregando posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Últimos Posts</Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  header: {
    fontSize: 26,
    fontWeight: "bold",
    padding: 20,
    color: "#1A1A1A",
  },

  card: {
    marginBottom: 16,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D5E3F0",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1A1A1A",
  },

  description: {
    fontSize: 15,
    color: "#505050",
    marginBottom: 12,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  author: {
    fontWeight: "600",
    color: "#1A73E8",
  },

  date: {
    color: "#666",
  },

  button: {
    backgroundColor: "#1A73E8",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});