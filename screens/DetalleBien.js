import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import Barcode from 'react-native-barcode-svg';
import { MaterialIcons } from "@expo/vector-icons";

export default function DetalleBien({ route, navigation }) {
  const { item } = route.params;
  const esOcupado = Boolean(item.lugar);

  // Función para manejar valores nulos o indefinidos
  const formatValue = (value, defaultText = "N/A") => {
    return value || defaultText;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header con título y botón de regreso */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Detalle del Bien</Text>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="qr-code-scanner" size={24} color="white" />
              <Text style={styles.backButtonText}>Escanear Otro</Text>
            </TouchableOpacity>
          </View>

          {/* Imagen del bien */}
          <Image
            source={{
              uri: item.modelo?.foto || "https://via.placeholder.com/150",
            }}
            style={styles.image}
            resizeMode="contain"
          />

          {/* Estado del bien (ocupado/libre) */}
          <View style={[
            styles.estadoContainer, 
            esOcupado ? styles.ocupado : styles.libre
          ]}>
            <MaterialIcons 
              name={esOcupado ? "block" : "check-circle"} 
              size={24} 
              color="white" 
            />
            <Text style={styles.estadoTexto}>
              {esOcupado ? "Ocupado" : "Libre"}
            </Text>
            {esOcupado && item.lugar && (
              <Text style={styles.ubicacionTexto}>
                {item.lugar.lugar}
              </Text>
            )}
          </View>

          {/* Detalles del bien */}
          <View style={styles.detailsContainer}>
            {/* Modelo */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Modelo:</Text>
              <Text style={styles.detailValue}>
                {formatValue(item.modelo?.nombreModelo)}
              </Text>
            </View>
            
            {/* Marca */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Marca:</Text>
              <Text style={styles.detailValue}>
                {formatValue(item.marca?.nombre)}
              </Text>
            </View>
            
            {/* Tipo de Bien */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tipo de Bien:</Text>
              <Text style={styles.detailValue}>
                {formatValue(item.tipoBien?.nombre)}
              </Text>
            </View>
            
            {/* Número de Serie */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Número de Serie:</Text>
              <Text style={styles.detailValue}>
                {formatValue(item.nSerie)}
              </Text>
            </View>
            
            {/* Código de Barras */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Código de Barras:</Text>
              <Text style={styles.detailValue}>
                {formatValue(item.codigoBarras)}
              </Text>
            </View>
            
            {/* Responsable */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Responsable:</Text>
              <Text style={styles.detailValue}>
                {formatValue(item.usuario?.nombre)}
              </Text>
            </View>
            
            {/* Ubicación del Usuario */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ubicación:</Text>
              <Text style={styles.detailValue}>
                {formatValue(item.usuario?.lugar?.lugar)}
              </Text>
            </View>
          </View>

          {/* Código de Barras */}
          <View style={styles.barcodeSection}>
            <Text style={styles.barcodeTitle}>Código de Barras</Text>
            <View style={styles.barcodeContainer}>
              {item.codigoBarras ? (
                <Barcode 
                  value={item.codigoBarras} 
                  format="CODE128" 
                  width={1.5} 
                  height={80} 
                  maxWidth={300}
                />
              ) : (
                <Text style={styles.noBarcodeText}>
                  No hay código de barras disponible
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(106, 27, 154, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "500",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 15,
    marginBottom: 16,
    backgroundColor: "#2c2c2c",
    borderWidth: 2,
    borderColor: "#6a1b9a",
  },
  estadoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  libre: {
    backgroundColor: "#00c853",
  },
  ocupado: {
    backgroundColor: "#d50000",
  },
  estadoTexto: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  ubicacionTexto: {
    color: "white",
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.9,
  },
  detailsContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#6a1b9a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  detailLabel: {
    width: "40%",
    fontSize: 16,
    color: "#bb86fc",
    fontWeight: "500",
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
  barcodeSection: {
    backgroundColor: "#1e1e1e",
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#6a1b9a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  barcodeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  barcodeContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "100%",
  },
  noBarcodeText: {
    color: "#757575",
    fontSize: 16,
    fontStyle: "italic",
  },
});