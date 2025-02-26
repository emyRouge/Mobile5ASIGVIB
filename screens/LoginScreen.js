import { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { AuthContext } from "../context/AuthContext";

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image 
          source={require("../assets/AdminIcon.png")} 
          style={styles.profileImage} 
        />
        <Text style={styles.title}>Administrador</Text>
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          autoCapitalize="none"
          onChangeText={(text) => setUsername(text.trim().toLowerCase())}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={() => login(username, password)}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.sgvibText}>SIGVIB</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topSection: {
    flex: 1,
    backgroundColor: "#6B38E3",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 100,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#ffffff", 
    justifyContent: "flex-end", 
    alignItems: "flex-start",   
    paddingLeft: 20,            
    paddingBottom: 20,    
  },
  profileImage: {
    width: 100, 
    height: 100,
    borderRadius: 50,
    marginBottom: 20, 
    paddingVertical: 40,
  },
  title: { fontSize: 35, fontWeight: "bold", marginBottom: 20, color: "#fff" },
  input: {
    width: "70%",
    height: 35, 
    borderBottomWidth: 1, 
    borderBottomColor: "#000",
    marginVertical: 8,
    padding: 6,  
    backgroundColor: "transparent",
    borderRadius: 0, 
  },
  button: {
    backgroundColor: "#B0E338",
    width: "50%",  
    paddingVertical: 10, 
    borderRadius: 19,
    marginTop: 20, 
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold", textAlign: "center" },
  sgvibText: {
    fontSize: 40,    
    fontWeight: "bold",
    color: "#000",   
  },
});

export default LoginScreen;
