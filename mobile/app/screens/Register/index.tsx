import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../../RootStackParamList";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NavigationProp>();

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      return Alert.alert("Atenção", "Preencha Nome, Email e Senha!");
    }

    try {
      setLoading(true);
      // REGRA 2: Não envia mais 'cargo'. Backend define como 'aluno'.
      const response = await fetch("http://10.0.2.2:3000/auth/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.mensagem || "Erro ao registrar");

      Alert.alert("Sucesso", "Conta criada! Fale com o Admin para permissões.");
      navigation.navigate("Login");

    } catch (err: any) {
      Alert.alert("Erro", err.message || "Falha na conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient style={styles.container} colors={["#6EA8FF", "#FFFFFF"]}>
      <View style={styles.box}>
        <Text style={styles.title}>Criar Conta</Text>

        <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
        
        {/* INPUT DE CARGO REMOVIDO AQUI */}

        <TextInput style={styles.input} placeholder="Seu e-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Sua senha" secureTextEntry value={senha} onChangeText={setSenha} />

        <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginLink}>
            <Text style={styles.loginText}>Já tenho conta</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  box: { padding: 25 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: 'center', color: "#333" },
  input: { height: 50, borderWidth: 1, borderColor: "#CCC", marginBottom: 15, paddingHorizontal: 10, borderRadius: 10, backgroundColor: "#FFF" },
  button: { backgroundColor: "#1A73E8", padding: 14, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#FFF", fontSize: 17, fontWeight: "600" },
  loginLink: { marginTop: 20, alignSelf: 'center' },
  loginText: { color: "#1A73E8", fontSize: 15, fontWeight: '600' }
});