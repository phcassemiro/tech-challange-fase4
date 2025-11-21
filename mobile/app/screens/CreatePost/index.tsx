import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PrivateRoute } from "../../../components/PrivateRoute";
import { NavigationProp } from "../../../RootStackParamList";

export default function CreatePost() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigation = useNavigation<NavigationProp>();

  const handleCreate = async () => {
    if (!titulo.trim() || !descricao.trim()) return Alert.alert("Preencha tudo!");

    setLoading(true);
    const nome = await AsyncStorage.getItem("nome"); 
    
    try {
      // 🔄 URL AJUSTADA: removido "/api"
      const response = await fetch("http://10.0.2.2:3000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descricao,
          autor: nome || "Desconhecido",
          postAtivo: true
        })
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Post criado!");
        navigation.navigate("Home");
      } else {
        Alert.alert("Erro", "Falha ao criar post.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateRoute role="professor">
      <View style={styles.container}>
        <Text style={styles.label}>Título</Text>
        <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

        <Text style={styles.label}>Descrição</Text>
        <TextInput 
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
          value={descricao} 
          onChangeText={setDescricao} 
          multiline 
        />

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF"/> : <Text style={styles.buttonText}>Publicar</Text>}
        </TouchableOpacity>
      </View>
    </PrivateRoute>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF" },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#333" },
  input: { borderWidth: 1, borderColor: "#CCC", borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16, backgroundColor: '#F9F9F9'},
  button: { backgroundColor: "#E91E63", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10},
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" }
});