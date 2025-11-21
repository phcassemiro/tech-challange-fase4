import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch, ActivityIndicator } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../RootStackParamList";
import { PrivateRoute } from "../../../components/PrivateRoute";

export default function EditPost() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [postAtivo, setPostAtivo] = useState(true);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'EditPost'>>();
  const { id } = route.params;

  useEffect(() => {
    // 🔄 URL AJUSTADA: removido "/api"
    fetch(`http://10.0.2.2:3000/posts/${id}`)
      .then(res => res.json())
      .then(data => {
        setTitulo(data.titulo);
        setDescricao(data.descricao);
        setPostAtivo(data.postAtivo);
      })
      .catch(() => Alert.alert("Erro", "Erro ao carregar"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async () => {
    try {
      // 🔄 URL AJUSTADA: removido "/api"
      const response = await fetch(`http://10.0.2.2:3000/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao, postAtivo })
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Atualizado!");
        navigation.navigate("Admin");
      } else {
        Alert.alert("Erro", "Falha ao atualizar");
      }
    } catch (error) {
      Alert.alert("Erro", "Conexão");
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{marginTop: 50}} color="#1A73E8"/>;

  return (
    <PrivateRoute role="professor">
      <View style={styles.container}>
        <Text style={styles.label}>Título</Text>
        <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

        <Text style={styles.label}>Descrição</Text>
        <TextInput style={[styles.input, {height: 100, textAlignVertical:'top'}]} value={descricao} onChangeText={setDescricao} multiline />

        <View style={styles.row}>
          <Text style={styles.label}>Ativo?</Text>
          <Switch value={postAtivo} onValueChange={setPostAtivo} />
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
          <Text style={styles.btnText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </PrivateRoute>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF" },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15, backgroundColor: '#f9f9f9' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  btn: { backgroundColor: '#1A73E8', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});