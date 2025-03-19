import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Barcode from 'react-native-barcode-svg';
import { MaterialIcons } from "@expo/vector-icons";

export default function Scanner() {
  const [facing, setFacing] = useState("back");
  const [scanned, setScanned] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [bienInfo, setBienInfo] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
    };
    fetchToken();
  }, []);

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
      
      const response = await fetch(`http://192.168.0.37:8080/bienes/buscar/${data}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Bien escaneado:", result); // Debugging
        setBienInfo(result.result);
      } else {
        const error = await response.json();
        Alert.alert("Error", error.message || "No se encontró información del bien");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setIsCameraActive(true);
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

  return (
    <View style={styles.container}>
      {isCameraActive && (
        <CameraView
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code128", "code39", "code93", "itf14", "pdf417"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}

      {bienInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Detalle del Bien</Text>
          <Image
            source={{ uri: bienInfo.modelo?.foto || "https://via.placeholder.com/150" }}
            style={styles.image}
          />
          <View style={[styles.estadoContainer, bienInfo.lugar ? styles.ocupado : styles.libre]}>
            <MaterialIcons 
              name={bienInfo.lugar ? "block" : "check-circle"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.estadoTexto}>{bienInfo.lugar ? "Ocupado" : "Libre"}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>Código de Barras: {bienInfo.codigoBarras}</Text>
            <Text style={styles.detailText}>Modelo: {bienInfo.modelo?.nombreModelo}</Text>
            <Text style={styles.detailText}>Marca: {bienInfo.marca?.nombre}</Text>
            <Text style={styles.detailText}>Responsable: {bienInfo.usuario?.nombre}</Text>
            <Text style={styles.detailText}>Lugar: {bienInfo.lugar?.lugar}</Text>
            <View style={styles.barcodeContainer}>
              {bienInfo.codigoBarras && <Barcode value={bienInfo.codigoBarras} format="CODE128" width={2} height={80} />}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1c1c1e", justifyContent: "center" },
  message: { textAlign: "center", paddingBottom: 10, color: "#fff" },
  camera: { flex: 1 },
  buttonContainer: { flex: 1, flexDirection: "row", backgroundColor: "transparent", margin: 64 },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "#6a1b9a",
    padding: 10,
    borderRadius: 10,
  },
  text: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  infoContainer: {
    backgroundColor: "#303030",
    padding: 20,
    borderRadius: 20,
    margin: 20,
    shadowColor: "#ab47bc",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  title: { fontSize: 24, color: "#fff", fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 20 },
  estadoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  ocupado: { backgroundColor: "#d50000" },
  libre: { backgroundColor: "#00c853" },
  estadoTexto: { color: "#fff", fontSize: 16, marginLeft: 5 },
  detailsContainer: { marginTop: 10 },
  detailText: { color: "#fff", fontSize: 14, marginBottom: 5 },
  barcodeContainer: { alignItems: "center", marginTop: 10 },
});
