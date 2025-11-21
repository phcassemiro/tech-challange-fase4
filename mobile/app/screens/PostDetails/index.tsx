import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator 
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../../RootStackParamList";

export default function PostDetails() {
  const route = useRoute<RouteProp<RootStackParamList, 'PostDetails'>>();
  const { id } = route.params;

  const [post, setPost] = useState<any>(null);
  const [novoComentario, setNovoComentario] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Estados do Usuário Logado
  const [userNome, setUserNome] = useState<string>("");
  const [userCargo, setUserCargo] = useState<string>("");

  // Estados para Edição de Comentário
  const [editingId, setEditingId] = useState<string | null>(null); // Qual ID está sendo editado?
  const [editedText, setEditedText] = useState(""); // O texto temporário da edição

  useEffect(() => { loadData(); }, [id]);

  const loadData = async () => {
    try {
      const storedName = await AsyncStorage.getItem("nome");
      const storedCargo = await AsyncStorage.getItem("cargo");
      if (storedName) setUserNome(storedName);
      if (storedCargo) setUserCargo(storedCargo);

      const resPost = await fetch(`http://10.0.2.2:3000/posts/${id}`);
      if(!resPost.ok) throw new Error("Erro");
      const dataPost = await resPost.json();
      setPost(dataPost);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar detalhes.");
    } finally {
      setLoading(false);
    }
  };

  // --- FORMATAÇÃO DE DATA ---
  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    // Formata para DD/MM/AAAA HH:MM
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()} às ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // --- AÇÕES ---

  const handleComentar = async () => {
    if (!novoComentario.trim()) return;
    try {
        const response = await fetch(`http://10.0.2.2:3000/posts/${id}/comentarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario: userNome, texto: novoComentario })
        });
        if (!response.ok) throw new Error("Erro");
        setNovoComentario("");
        loadData(); 
    } catch (e) { Alert.alert("Erro", "Não foi possível comentar."); }
  };

  const handleDeleteComentario = async (comentarioId: string) => {
    Alert.alert("Excluir", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sim", style: "destructive", onPress: async () => {
          try {
            await fetch(`http://10.0.2.2:3000/posts/${id}/comentarios/${comentarioId}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ usuario: userNome, cargo: userCargo })
            });
            loadData();
          } catch (error) { Alert.alert("Erro", "Falha na conexão."); }
        }
      }
    ]);
  };

  // Iniciar Edição
  const startEditing = (comentarioId: string, currentText: string) => {
    setEditingId(comentarioId);
    setEditedText(currentText);
  };

  // Cancelar Edição
  const cancelEditing = () => {
    setEditingId(null);
    setEditedText("");
  };

  // Salvar Edição
  const handleSaveEdit = async (comentarioId: string) => {
    if (!editedText.trim()) return alert("O comentário não pode ser vazio.");

    try {
        const response = await fetch(`http://10.0.2.2:3000/posts/${id}/comentarios/${comentarioId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                usuario: userNome, 
                cargo: userCargo, 
                novoTexto: editedText 
            })
        });

        if (response.ok) {
            setEditingId(null);
            setEditedText("");
            loadData(); // Recarrega para ver a mudança
        } else {
            Alert.alert("Erro", "Não foi possível editar.");
        }
    } catch (error) {
        Alert.alert("Erro", "Erro de conexão.");
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{flex:1}} color="#1A73E8"/>;
  if (!post) return <View style={styles.container}><Text>Post não encontrado</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.postCard}>
        <Text style={styles.title}>{post.titulo}</Text>
        {/* DATA FORMATADA AQUI */}
        <Text style={styles.meta}>Por {post.autor} em {formatDate(post.dataCriacao)}</Text>
        <Text style={styles.desc}>{post.descricao}</Text>
      </View>

      <Text style={styles.sectionTitle}>Comentários ({(post.comentarios || []).length})</Text>

      {(post.comentarios || []).map((c: any, index: number) => {
         // Permissões
         const isAutor = c.usuario === userNome;
         const isAdmin = userCargo.toLowerCase() === "admin";
         const canModify = isAutor || isAdmin;

         // Verifica se este comentário específico está sendo editado
         const isEditingThis = editingId === c._id;

         return (
          <View key={c._id || index} style={styles.commentCard}>
            
            {/* MODO EDIÇÃO */}
            {isEditingThis ? (
                <View>
                    <Text style={styles.commentUser}>Editando comentário de {c.usuario}</Text>
                    <TextInput 
                        style={styles.editInput} 
                        value={editedText} 
                        onChangeText={setEditedText} 
                        multiline 
                    />
                    <View style={styles.editActions}>
                        <TouchableOpacity onPress={() => handleSaveEdit(c._id)} style={styles.btnSave}>
                            <Text style={styles.btnTextSmall}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={cancelEditing} style={styles.btnCancel}>
                            <Text style={styles.btnTextSmall}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                // MODO VISUALIZAÇÃO
                <>
                    <View style={styles.commentHeader}>
                        <Text style={styles.commentUser}>{c.usuario}</Text>
                        <Text style={styles.commentDate}>{formatDate(c.data)}</Text>
                    </View>

                    <Text style={styles.commentText}>{c.texto}</Text>
                    
                    {/* Botões de Ação (Só aparecem se tiver permissão) */}
                    {canModify && (
                        <View style={styles.actionRow}>
                            <TouchableOpacity onPress={() => startEditing(c._id, c.texto)}>
                                <Text style={styles.editText}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteComentario(c._id)}>
                                <Text style={styles.deleteText}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}
          </View>
        );
      })}

      <View style={styles.inputContainer}>
        <TextInput 
            style={styles.input} 
            placeholder="Escreva um comentário..." 
            value={novoComentario} 
            onChangeText={setNovoComentario} 
            multiline 
        />
        <TouchableOpacity style={styles.button} onPress={handleComentar}>
            <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4FF", padding: 20 },
  postCard: { backgroundColor: "#FFF", padding: 20, borderRadius: 10, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#333" },
  meta: { color: "#666", fontSize: 12, marginVertical: 5 },
  desc: { fontSize: 16, color: "#444", lineHeight: 24, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  
  // Cartão de Comentário
  commentCard: { backgroundColor: "#FFF", padding: 15, borderRadius: 8, marginBottom: 10 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  commentUser: { fontWeight: "bold", color: "#1A73E8" },
  commentDate: { fontSize: 10, color: "#999" },
  commentText: { color: "#555", marginBottom: 10 },
  
  // Ações (Editar/Excluir)
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 8 },
  deleteText: { color: "#DC3545", fontSize: 13, fontWeight: "600" },
  editText: { color: "#1A73E8", fontSize: 13, fontWeight: "600" },

  // Modo Edição
  editInput: { backgroundColor: "#F9F9F9", borderWidth: 1, borderColor: "#DDD", borderRadius: 5, padding: 8, minHeight: 50, marginVertical: 10 },
  editActions: { flexDirection: 'row', gap: 10 },
  btnSave: { backgroundColor: "#28a745", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5 },
  btnCancel: { backgroundColor: "#6c757d", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5 },
  btnTextSmall: { color: "#FFF", fontSize: 12, fontWeight: "bold" },

  // Input Novo Comentário
  inputContainer: { marginTop: 20, marginBottom: 50 },
  input: { backgroundColor: "#FFF", borderRadius: 8, padding: 10, minHeight: 60, textAlignVertical: 'top', borderWidth: 1, borderColor: "#DDD" },
  button: { backgroundColor: "#1A73E8", padding: 12, borderRadius: 8, marginTop: 10, alignItems: "center" },
  buttonText: { color: "#FFF", fontWeight: "bold" }
});