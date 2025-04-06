import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, Image, Animated, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { API_BASE_URL } from '@env';

export default function Scanner() {
  const [facing, setFacing] = useState("back");
  const [scanned, setScanned] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [bienInfo, setBienInfo] = useState(null);
  const [token, setToken] = useState(null);

  // Animación de la línea de escaneo
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (isCameraActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isCameraActive]);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const fetchBienInfo = async (data) => {
    try {
      if (!token) {
        Alert.alert("Error", "No se encontró un token válido. Inicia sesión nuevamente.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/bienes/buscar/${data}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setBienInfo(result.result);
      } else {
        const error = await response.json();
        Alert.alert("Error", error.message || "No se encontró información del bien");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setIsCameraActive(false);
      setScanned(false);
    }
  };

  const handleBarCodeScanned = async ({ data }) => {
    if (!scanned) {
      setScanned(true);
      setIsCameraActive(false);
      await fetchBienInfo(data);
    }
  };

  const resetScanner = () => {
    setBienInfo(null);
    setIsCameraActive(true);
    setScanned(false);
  };

  // Interpolación de la animación
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  return (
    <View style={styles.container}>
      {isCameraActive ? (
        <View style={styles.cameraContainer}>
          <View style={styles.scannerHeader}>
            <Text style={styles.scannerTitle}>Escanear Código</Text>
          </View>
          <CameraView
            style={styles.camera}
            facing={facing}
            barcodeScannerSettings={{
              barcodeTypes: [
                "qr",
                "ean13",
                "ean8",
                "upc_a",
                "upc_e",
                "code128",
                "code39",
                "code93",
                "itf14",
                "pdf417",
              ],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerTarget}>
                <Animated.View
                  style={[
                    styles.scanLine,
                    { transform: [{ translateY }] },
                  ]}
                />
              </View>
            </View>
          </CameraView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <MaterialIcons name="flip-camera-android" size={24} color="white" />
              <Text style={styles.text}>Cambiar Cámara</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {bienInfo && (
            <View style={styles.infoContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.title}>Detalle del Bien</Text>
                <TouchableOpacity style={styles.backButton} onPress={resetScanner}>
                  <MaterialIcons name="qr-code-scanner" size={24} color="white" />
                  <Text style={styles.backButtonText}>Escanear Otro</Text>
                </TouchableOpacity>
              </View>
              
              <Image
                source={{
                  uri: bienInfo.modelo?.foto || "https://via.placeholder.com/150",
                }}
                style={styles.image}
                resizeMode="contain"
              />
              
              <View
                style={[
                  styles.estadoContainer,
                  bienInfo.lugar ? styles.ocupado : styles.libre,
                ]}
              >
                <MaterialIcons
                  name={bienInfo.lugar ? "block" : "check-circle"}
                  size={24}
                  color="white"
                />
                <Text style={styles.estadoTexto}>
                  {bienInfo.lugar ? "Ocupado" : "Libre"}
                </Text>
                {bienInfo.lugar && (
                  <Text style={styles.ubicacionTexto}>
                    {bienInfo.lugar.lugar}
                  </Text>
                )}
              </View>
              
              {/* Información adicional */}
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Modelo:</Text>
                  <Text style={styles.detailValue}>{bienInfo.modelo?.nombreModelo || "N/A"}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Marca:</Text>
                  <Text style={styles.detailValue}>{bienInfo.marca?.nombre || "N/A"}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tipo de Bien:</Text>
                  <Text style={styles.detailValue}>{bienInfo.tipoBien?.nombre || "N/A"}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Número de Serie:</Text>
                  <Text style={styles.detailValue}>{bienInfo.nSerie || "N/A"}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Responsable:</Text>
                  <Text style={styles.detailValue}>{bienInfo.usuario?.nombre || "N/A"}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ubicación:</Text>
                  <Text style={styles.detailValue}>{bienInfo.usuario?.lugar?.lugar || "N/A"}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#121212" 
  },
  scrollView: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    overflow: "hidden",
  },
  scannerHeader: {
    backgroundColor: "#6a1b9a",
    padding: 15,
    alignItems: "center",
  },
  scannerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  camera: { 
    flex: 1 
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerTarget: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: "#6a1b9a",
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  scanLine: {
    position: "absolute",
    width: "100%",
    height: 3,
    backgroundColor: "#00ff00",
    shadowColor: "#00ff00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonContainer: {
    backgroundColor: "#1c1c1e",
    padding: 15,
  },
  button: {
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#6a1b9a",
    padding: 12,
    borderRadius: 10,
    width: 200,
    justifyContent: "center",
  },
  text: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold",
    marginLeft: 8,
  },
  infoContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    margin: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContainer: {
    backgroundColor: "#6a1b9a",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { 
    fontSize: 20, 
    color: "#fff", 
    fontWeight: "bold", 
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    marginLeft: 4,
    fontSize: 14,
  },
  image: { 
    width: "100%", 
    height: 200, 
    backgroundColor: "#2c2c2c",
  },
  estadoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  ocupado: { 
    backgroundColor: "#d32f2f" 
  },
  libre: { 
    backgroundColor: "#388e3c" 
  },
  estadoTexto: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold",
    marginLeft: 8,
  },
  ubicacionTexto: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginLeft: 8,
  },
  detailsContainer: {
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingVertical: 12,
  },
  detailLabel: {
    width: "40%",
    fontSize: 16,
    color: "#9e9e9e",
    fontWeight: "bold",
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
  },
  message: {
    color: "#fff",
    textAlign: "center",
    margin: 20,
  },
});