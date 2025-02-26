import React, { useState, useContext } from "react";
import { View, Text, FlatList, Image, StyleSheet, TextInput, SafeAreaView, StatusBar, TouchableOpacity, Modal, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";

const dispositivos = [
  { id: "1", tipoBien: "Laptop", responsable: "Uxue", lugar: "M1", modelo: "23fr5t6", marca: "Azus", imagenUrl: "https://i2.wp.com/mayoresconectados.com.ar/wp-content/uploads/2018/07/computadora-de-escritorio.png?resize=302,193" },
  { id: "2", tipoBien: "Laptop", responsable: "Emy", lugar: "M2", modelo: "23fr5t6", marca: "Windows", imagenUrl: "https://i2.wp.com/mayoresconectados.com.ar/wp-content/uploads/2018/07/computadora-de-escritorio.png?resize=302,193" },
  { id: "3", tipoBien: "Laptop", responsable: "Elias", lugar: "M3", modelo: "23fr5t6", marca: "Apple", imagenUrl: "https://i2.wp.com/mayoresconectados.com.ar/wp-content/uploads/2018/07/computadora-de-escritorio.png?resize=302,193" },
];

export default function PantallaAdminDispositivos() {
  const { logout } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedDevice, setSelectedDevice] = useState(null); 

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={estilos.tarjeta}
      onPress={() => {
        setSelectedDevice(item); 
        setModalVisible(true); 
      }}
    >
      <Image
        source={{
          uri: item.imagenUrl,
        }}
        style={estilos.imagen}
      />
      <View style={estilos.contenedorInfo}>
        <Text style={estilos.nombreDispositivo}>{item.tipoBien} - {item.lugar}</Text>
        <Text>{item.responsable}</Text>
        <Text>{item.modelo}</Text>
        <View style={estilos.contenedorCodigo}>
          <Text style={estilos.textoCodigo}>{item.modelo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={estilos.areaSegura}>
      <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
      <View style={estilos.encabezado}>
        <View style={estilos.etiquetaEncabezado}>
          <Text style={estilos.textoEncabezado}>Administrador</Text>
        </View>
        <View style={estilos.barraBusquedaContenedor}>
          <Ionicons name="search" size={24} color="#888" style={estilos.iconoLupa} />
          <TextInput style={estilos.barraBusqueda} placeholderTextColor="#888" />
        </View>
        <Ionicons name="qr-code" size={24} color="white" style={estilos.iconoQR} />
      </View>
      <View style={estilos.contenedorBlanco}>
        <FlatList
          data={dispositivos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={estilos.contenidoLista}
        />
      </View>
      

      {selectedDevice && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false); 
          }}
        >
          <View style={estilos.modalOverlay}>
            <View style={estilos.modalContent}>
              <Image
                source={{
                  uri: selectedDevice.imagenUrl,
                }}
                style={estilos.modalImagen}
              />
              <Text style={estilos.modalTitle}>Detalles del Dispositivo</Text>
              <Text><strong>Tipo Bien:</strong> {selectedDevice.tipoBien}</Text>
              <Text><strong>Responsable:</strong> {selectedDevice.responsable}</Text>
              <Text><strong>Lugar:</strong> {selectedDevice.lugar}</Text>
              <Text><strong>Modelo:</strong> {selectedDevice.modelo}</Text>
              <Text><strong>Marca:</strong> {selectedDevice.marca}</Text>
              <Button title="Cerrar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
      <TouchableOpacity style={estilos.button} onPress={logout}>
        <Text style={estilos.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: "#6200ee",
  },
  encabezado: {
    backgroundColor: "#6200ee",
    padding: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    justifyContent: "space-between",
  },
  etiquetaEncabezado: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 37,
    paddingVertical: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    marginLeft: -25,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  textoEncabezado: {
    color: "black",
    fontSize: 20,
  },
  barraBusquedaContenedor: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#e0e0e0",
    borderRadius: 25,
    paddingHorizontal: 10,
    marginRight: 60,
    marginLeft: 10,
    alignSelf: 'flex-start',
    marginBottom: -30,
  },
  iconoLupa: {
    marginRight: 10,
  },
  barraBusqueda: {
    flex: 1,
    paddingVertical: 10,
  },
  iconoQR: {
    padding: 5,
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  contenedorBlanco: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 37,
    borderTopRightRadius: 37,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginTop: 10,
    padding: 16,
    flex: 1,
    elevation: 5,
  },
  contenidoLista: {
    padding: 16,
  },
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  imagen: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  contenedorInfo: {
    flex: 1,
  },
  nombreDispositivo: {
    fontWeight: "bold",
    fontSize: 16,
  },
  contenedorCodigo: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-end',
  },
  textoCodigo: {
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalImagen: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  button: { backgroundColor: '#6200ee', padding: 12, borderRadius: 11,   width: "55%", alignItems: "center", alignSelf: 'center',   position: "absolute", bottom: 0, 

  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
