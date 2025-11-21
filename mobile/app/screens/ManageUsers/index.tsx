import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { PrivateRoute } from "../../../components/PrivateRoute";

interface User {
  _id: string;
  nome: string;
  email: string;
  cargo: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://10.0.2.2:3000/usuarios");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => { loadUsers(); }, [])
  );

  const handleChangeRole = async (id: string, novoCargo: string, nome: string) => {
    Alert.alert("Alterar Cargo", `Deseja mudar ${nome} para ${novoCargo.toUpperCase()}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: async () => {
          try {
            const res = await fetch(`http://10.0.2.2:3000/usuarios/${id}/cargo`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ novoCargo })
            });

            if (res.ok) {
              Alert.alert("Sucesso", "Cargo atualizado!");
              loadUsers();
            } else {
              Alert.alert("Erro", "Falha ao atualizar.");
            }
          } catch (e) {
            Alert.alert("Erro", "Erro de conexão.");
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: User }) => {
    // Admin não pode mudar o próprio cargo ou de outros admins por segurança básica de UI
    const isSuperUser = item.cargo === "admin";

    return (
      <View style={styles.card}>
        <View>
            <Text style={styles.name}>{item.nome}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={[styles.role, item.cargo === 'admin' ? styles.roleAdmin : (item.cargo === 'professor' ? styles.roleProf : styles.roleAluno)]}>
                {item.cargo.toUpperCase()}
            </Text>
        </View>

        {!isSuperUser && (
            <View style={styles.actions}>
                {item.cargo !== "professor" && (
                    <TouchableOpacity 
                        style={styles.btnPromote} 
                        onPress={() => handleChangeRole(item._id, "professor", item.nome)}
                    >
                        <Text style={styles.btnText}>Virar Prof.</Text>
                    </TouchableOpacity>
                )}
                
                {item.cargo !== "aluno" && (
                    <TouchableOpacity 
                        style={styles.btnDemote} 
                        onPress={() => handleChangeRole(item._id, "aluno", item.nome)}
                    >
                        <Text style={styles.btnText}>Virar Aluno</Text>
                    </TouchableOpacity>
                )}
            </View>
        )}
      </View>
    );
  };

  return (
    <PrivateRoute role="admin">
      <View style={styles.container}>
        <Text style={styles.header}>Gestão de Usuários</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#1A73E8" />
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </PrivateRoute>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  card: { backgroundColor: "#FFF", padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  name: { fontSize: 16, fontWeight: "bold", color: "#333" },
  email: { fontSize: 14, color: "#666", marginBottom: 5 },
  role: { fontSize: 12, fontWeight: "bold" },
  roleAdmin: { color: "purple" },
  roleProf: { color: "green" },
  roleAluno: { color: "gray" },
  actions: { flexDirection: 'column', gap: 5 },
  btnPromote: { backgroundColor: "#28a745", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 5 },
  btnDemote: { backgroundColor: "#ffc107", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 5 },
  btnText: { color: "#FFF", fontSize: 12, fontWeight: "bold", textAlign: 'center' }
});