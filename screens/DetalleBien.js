import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Barcode from 'react-native-barcode-svg';
import { MaterialIcons } from "@expo/vector-icons";

export default function DetalleBien({ route }) {
  const { item } = route.params;
  const esOcupado = Boolean(item.lugar);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del Bien</Text>

      {/* Mostrar Foto del Bien */}
      <Image
        source={{
          uri: item.modelo?.foto || "https://via.placeholder.com/150",
        }}
        style={styles.image}
      />

      {/* Estado del Bien */}
      <View style={[styles.estadoContainer, esOcupado ? styles.ocupado : styles.libre]}>
        <MaterialIcons 
          name={esOcupado ? "block" : "check-circle"} 
          size={20} 
          color="white" 
        />
        <Text style={styles.estadoTexto}>{esOcupado ? "Ocupado" : "Libre"}</Text>
      </View>

      {/* Detalles del Bien */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Código de Barras: {item.codigoBarras}</Text>
        <Text style={styles.detailText}>Modelo: {item.modelo?.nombreModelo}</Text>
        <Text style={styles.detailText}>Marca: {item.marca?.nombre}</Text>
        <Text style={styles.detailText}>Responsable: {item.usuario?.nombre}</Text>
        <Text style={styles.detailText}>Lugar: {item.lugar?.lugar}</Text>
        
        {/* Código de Barras */}
        <View style={styles.barcodeContainer}>
          {item.codigoBarras && <Barcode value={item.codigoBarras} format="CODE128" width={2} height={80} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1e", // Nuevo fondo oscuro
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff", // Título en color púrpura brillante
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 24,
    borderRadius: 15,
    resizeMode: 'contain',
    borderWidth: 2,
    borderColor: "#6a1b9a", // Color del borde de la imagen
  },
  estadoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    minWidth: 100,
    alignSelf: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  libre: {
    backgroundColor: "#00c853", // Verde para libre
  },
  ocupado: {
    backgroundColor: "#d50000", // Rojo para ocupado
  },
  estadoTexto: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  detailsContainer: {
    backgroundColor: "#303030", // Fondo oscuro para los detalles
    padding: 20,
    borderRadius: 20,
    shadowColor: "#ab47bc", // Sombra púrpura brillante
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  detailText: {
    fontSize: 18,
    color: "#fff", // Texto blanco para visibilidad
    marginBottom: 12,
    lineHeight: 24,
  },
  barcodeContainer: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 30,
  },
});
