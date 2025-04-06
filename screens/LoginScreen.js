import { useState, useContext, useEffect, useRef } from "react";
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
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // Validate form whenever username or password changes
    setIsFormValid(username.length > 0 && password.length > 0);
  }, [username, password, fadeAnim, scaleAnim, translateYAnim, logoRotate]);

  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleLogin = async () => {
    if (!isFormValid) return;
    
    setError("");
    setIsLoading(true);
    
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || "Error al iniciar sesión. Intente nuevamente.");
      
      // Shake animation on error
      Animated.sequence([
        Animated.timing(translateYAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View 
          style={[
            styles.topSection,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: translateYAnim }
              ]
            }
          ]}
        >
          <View style={styles.logoContainer}>
            <Animated.Image 
              source={require("../assets/icon.png")} 
              style={[
                styles.profileImage,
                { transform: [{ rotate: spin }] }
              ]} 
              resizeMode="contain"
            />
            <View style={styles.logoGlow} />
          </View>
          
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu usuario"
              autoCapitalize="none"
              placeholderTextColor="rgba(180, 120, 255, 0.5)"
              value={username}
              onChangeText={(text) => {
                setUsername(text.trim().toLowerCase());
                setError("");
              }}
              accessibilityLabel="Campo de usuario"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              secureTextEntry
              placeholderTextColor="rgba(180, 120, 255, 0.5)"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError("");
              }}
              accessibilityLabel="Campo de contraseña"
            />
          </View>
          
          {error ? (
            <Animated.Text 
              style={[styles.errorText, { transform: [{ translateY: translateYAnim }] }]}
            >
              {error}
            </Animated.Text>
          ) : null}

          <TouchableOpacity 
            style={[
              styles.button, 
              !isFormValid && styles.buttonDisabled
            ]} 
            onPress={handleLogin}
            disabled={!isFormValid || isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
                <View style={styles.buttonGlow} />
              </>
            )}
          </TouchableOpacity>
          
        
        </Animated.View>

        <Animated.View 
          style={[
            styles.bottomSection,
            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
          ]}
        >
          <Text style={styles.footerText}>SIGVIB</Text>
          <Text style={styles.versionText}>v1.0.2</Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.03,
  },
  topSection: {
    width: width * 0.9,
    backgroundColor: "#1E1E1E", // Dark card background
    alignItems: "center",
    padding: width * 0.08,
    borderRadius: 24,
    shadowColor: "#9D4EDD", // Lighter purple for shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 1,
    borderColor: "#2D2D2D", // Subtle border
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  logoGlow: {
    position: 'absolute',
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    backgroundColor: 'rgba(157, 78, 221, 0.25)', // Brighter purple glow
    top: 0,
    left: 0,
    zIndex: -1,
    transform: [{ scale: 1.4 }], // Larger glow
  },
  profileImage: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    borderWidth: 3,
    borderColor: "#9D4EDD", // Brighter purple
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "700",
    marginBottom: 8,
    color: "#FFFFFF", // White text
    textShadowColor: 'rgba(157, 78, 221, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#BBBBBB", // Light gray text
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: width * 0.035,
    fontWeight: "600",
    color: "#B478FF", // Light purple
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: "100%",
    height: height * 0.065,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(157, 78, 221, 0.4)", // Brighter purple border
    paddingHorizontal: 15,
    fontSize: width * 0.045,
    color: "#FFFFFF", // White text
    backgroundColor: "rgba(30, 30, 30, 0.8)", // Slightly lighter than background
  },
  button: {
    backgroundColor: "#9D4EDD", // Brighter purple
    width: "100%",
    paddingVertical: height * 0.022,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#9D4EDD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
    minHeight: height * 0.065,
    position: 'relative',
    overflow: 'hidden',
  },
  buttonGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Brighter glow
    zIndex: -1,
  },
  buttonDisabled: {
    backgroundColor: "#444444", // Dark gray when disabled
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: "#FFFFFF", // White text
    fontSize: width * 0.045,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  forgotPassword: {
    marginTop: 16,
    padding: 8,
  },
  forgotPasswordText: {
    color: "#B478FF", // Light purple
    fontSize: width * 0.035,
    fontWeight: "500",
  },
  bottomSection: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#9D4EDD", // Brighter purple
    letterSpacing: 1,
    textShadowColor: 'rgba(157, 78, 221, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  versionText: {
    fontSize: width * 0.03,
    color: "#BBBBBB", // Light gray
    marginTop: 4,
  },
  errorText: {
    color: "#FF5252", // Red error text
    marginTop: 10,
    fontSize: width * 0.04,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default LoginScreen;