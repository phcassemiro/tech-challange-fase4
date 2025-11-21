import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "../../../RootStackParamList"; 

interface Post {
  _id: string;
  titulo: string;
  descricao: string;
  autor: string;
  postAtivo: boolean;
  dataCriacao: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cargo, setCargo] = useState("");

  const navigation = useNavigation<NavigationProp>();

  // --- FORMATAÇÃO DE DATA (Igual ao PostDetails) ---
  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()} às ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const loadData = async () => {
    try {
      const storedCargo = await AsyncStorage.getItem("cargo");
      const currentCargo = storedCargo || "";
      setCargo(currentCargo);

      // LÓGICA DE FETCH INTELIGENTE
      // Se for Admin ou Professor, busca na rota que traz TUDO (inclusive inativos)
      // Se for Aluno (ou sem cargo), busca na rota padrão (só ativos)
      const isAdminOrProf = currentCargo.toLowerCase() === 'admin' || currentCargo.toLowerCase() === 'professor';
      const endpoint = isAdminOrProf ? "/posts/professor" : "/posts";

      const response = await fetch(`http://10.0.2.2:3000${endpoint}`);
      
      if (!response.ok) throw new Error("Falha ao buscar posts");

      const data = await response.json();
      
      // Não filtramos mais aqui, confiamos no backend para entregar a lista certa
      setPosts(data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const filtrados = posts.filter(p =>
    p.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    p.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  // --- LÓGICA DE PERMISSÕES VISUAIS ---
  const cargoLower = cargo.toLowerCase();
  const isAdmin = cargoLower === "admin";
  const isProfessor = cargoLower === "professor";
  const canManagePosts = isAdmin || isProfessor;

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.author}>{item.autor}</Text>
        {/* DATA FORMATADA AQUI */}
        <Text style={styles.date}>{formatDate(item.dataCriacao)}</Text>
      </View>
      
      {/* Título com indicador visual se estiver inativo (apenas para quem pode ver) */}
      <Text style={styles.postTitle}>
        {item.titulo} 
        {!item.postAtivo && <Text style={{color: 'red', fontSize: 14}}> (Inativo)</Text>}
      </Text>
      
      <Text style={styles.postDescription} numberOfLines={3}>
        {item.descricao}
      </Text>

      <TouchableOpacity 
        style={styles.detailsButton}
        onPress={() => navigation.navigate("PostDetails", { id: item._id })}
      >
        <Text style={styles.detailsButtonText}>Ver mais...</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient style={styles.container} colors={["#6EA8FF", "#F0F4FF"]}>
      
      <View style={styles.header}>
        <View>
            <Text style={styles.headerTitle}>Feed de Posts</Text>
            <Text style={{color: '#FFF', fontSize: 12}}>
                {cargo ? `Logado como: ${cargo}` : "Sem cargo"}
            </Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {canManagePosts && (
        <View style={styles.adminContainer}>
          <TouchableOpacity 
            style={styles.adminButton} 
            onPress={() => navigation.navigate("CreatePost")}
          >
            <Text style={styles.adminButtonText}>+ Post</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.adminButton, { backgroundColor: "#333" }]} 
            onPress={() => navigation.navigate("Admin")}
          >
            <Text style={styles.adminButtonText}>Painel Admin</Text>
          </TouchableOpacity>

          {isAdmin && (
            <TouchableOpacity 
                style={[styles.adminButton, { backgroundColor: "#6200ea" }]} 
                onPress={() => navigation.navigate("ManageUsers")}
            >
                <Text style={styles.adminButtonText}>Usuários</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar posts..."
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1A73E8" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1A73E8"]} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum post encontrado.</Text>
          }
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600"
  },
  adminContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 8,
    flexWrap: 'wrap'
  },
  adminButton: {
    backgroundColor: "#E91E63",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
    marginBottom: 5
  },
  adminButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: "#FFF",
    height: 45,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A73E8",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  postDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  detailsButton: {
    alignSelf: "flex-start",
    paddingVertical: 5,
  },
  detailsButtonText: {
    color: "#1A73E8",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 50,
    fontSize: 16,
  },
});