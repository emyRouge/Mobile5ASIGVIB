import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topSection}>
          <Image source={require("../assets/logo1.png")} style={styles.profileImage} />
          <Text style={styles.title}>Bienvenido</Text>

          <TextInput
            style={styles.input}
            placeholder="Usuario"
            autoCapitalize="none"
            placeholderTextColor="#d9b3ff"
            onChangeText={(text) => setUsername(text.trim().toLowerCase())}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            placeholderTextColor="#d9b3ff"
            onChangeText={setPassword}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.footerText}>SIGVIB</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.03,
  },
  topSection: {
    width: width * 0.9,
    backgroundColor: "#7d2bd3",
    alignItems: "center",
    padding: width * 0.08,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
    elevation: 8,
  },
  profileImage: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#c084f5",
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "700",
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    width: "100%",
    height: height * 0.06,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d9b3ff",
    marginVertical: 10,
    paddingHorizontal: 15,
    fontSize: width * 0.045,
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  button: {
    backgroundColor: "#c084f5",
    width: "100%",
    paddingVertical: height * 0.02,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    color: "#d9b3ff",
    fontSize: width * 0.04,
    textDecorationLine: "underline",
  },
  bottomSection: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#7d2bd3",
  },
  errorText: {
    color: "#ff6b6b",
    marginTop: 10,
    fontSize: width * 0.04,
  },
});

export default LoginScreen;