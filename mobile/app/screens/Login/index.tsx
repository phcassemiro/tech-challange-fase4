import Header from "@/components/Shared/Header";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!user || !password) {
      return Alert.alert("Erro", "Preencha todos os campos!");
    }

    try {
      setLoading(true);

      const response = await fetch("http://10.0.2.2:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user,
          senha: password,
        }),
      });

      // Se o backend retornar erro (ex: 401)
      if (!response.ok) {
        const err = await response.json();
        return Alert.alert("Erro", err.mensagem || "Credenciais inválidas.");
      }

      const data = await response.json();

      if (!data.token) {
        return Alert.alert("Erro", "Token inválido retornado pela API.");
      }

      // Salvar token e dados do usuário no AsyncStorage
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("nome", data.nome);
      await AsyncStorage.setItem("cargo", data.cargo);

      Alert.alert("Sucesso", "Login realizado com sucesso!");

      navigation.navigate("screens/Home/index", { userName: data.nome });

    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={["#6EA8FF", "#FFFFFF"]}
    >
      <StatusBar barStyle="light-content" />
      <Header />

      <View style={styles.content}>
        <Text style={styles.subtitle}>Entre para acessar os posts</Text>

        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#666"
          onChangeText={setUser}
          keyboardType="email-address"
          autoCapitalize="none"
          value={user}
        />

        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          placeholderTextColor="#666"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#444",
    marginBottom: 30,
  },

  input: {
    height: 50,
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CCC",
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },

  button: {
    backgroundColor: "#1A73E8",
    paddingVertical: 14,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});