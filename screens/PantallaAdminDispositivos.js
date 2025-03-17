import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { obtenerTodosLosBienes } from "../api/bienesApi";

export default function PantallaAdminDispositivos() {
  const { logout } = useContext(AuthContext);
  const [bienes, setBienes] = useState([]);
  const [filteredBienes, setFilteredBienes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBienes = async () => {
      try {
        const data = await obtenerTodosLosBienes();
        setBienes(data);
        setFilteredBienes(data);
      } catch (err) {
        setError("No se pudieron cargar los bienes");
      }
    };
    fetchBienes();
  }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredBienes(bienes);
    } else {
      const lowercasedSearchText = searchText.toLowerCase();
      const filtered = bienes.filter((item) =>
        (item.tipoBien?.nombre?.toLowerCase().includes(lowercasedSearchText)) ||
        (item.lugar?.lugar?.toLowerCase().includes(lowercasedSearchText)) ||
        (item.usuario?.nombre?.toLowerCase().includes(lowercasedSearchText)) ||
        (item.modelo?.nombreModelo?.toLowerCase().includes(lowercasedSearchText)) ||
        (item.codigoBarras?.toLowerCase().includes(lowercasedSearchText))
      );
      setFilteredBienes(filtered);
    }
  }, [searchText, bienes]);
  
  const navigation = useNavigation();
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={estilos.tarjeta}
      onPress={() => navigation.navigate('DetalleBien', { item })}
    >
      <Image
        source={{ uri: item.modelo?.foto || "https://via.placeholder.com/60" }}
        style={estilos.imagen}
      />
      <View style={estilos.contenedorInfo}>
        <Text style={estilos.nombreDispositivo}>
          {item.tipoBien?.nombre} - {item.lugar?.lugar}
        </Text>
        <Text style={estilos.responsableTexto}>Responsable: {item.usuario?.nombre}</Text>
        <Text>Modelo: {item.modelo?.nombreModelo}</Text>
        <Text>Marca: {item.marca?.nombre}</Text>
      </View>
      <View style={[estilos.estado, item.lugar ? estilos.ocupado : estilos.libre]}>
  <MaterialIcons 
    name={item.lugar ? "block" : "check-circle"} 
    size={20} 
    color="white" 
  />
  <Text style={estilos.estadoTexto}>
    {item.lugar ? "" : "Libre"}
  </Text>
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
          <TextInput
            style={estilos.barraBusqueda}
            placeholder="Buscar..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <View style={estilos.contenedorBlanco}>
        {error ? (
          <Text style={estilos.errorTexto}>{error}</Text>
        ) : (
          <FlatList
            data={filteredBienes}
            renderItem={renderItem}
            keyExtractor={(item) => item.idBien.toString()}
            contentContainerStyle={estilos.contenidoLista}
          />
        )}
      </View>

      <TouchableOpacity style={estilos.button} onPress={logout}>
        <Text style={estilos.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  estado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 90,
    alignSelf: "flex-start",
    marginTop: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  libre: {
    backgroundColor: "#4CAF50",
  },
  ocupado: {
    backgroundColor: "#E53935",
  },
  estadoTexto: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  areaSegura: {
    flex: 1,
    backgroundColor: "#7d2bd3",
  },
  encabezado: {
    backgroundColor: "#7d2bd3",
    paddingHorizontal: 25,
    paddingVertical: 18,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  etiquetaEncabezado: {
    backgroundColor: "#d9b3ff",
    paddingHorizontal: 40,
    paddingVertical: 8,
    borderRadius: 25,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  textoEncabezado: {
    color: "#3b3b3b",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  barraBusquedaContenedor: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 18,
    marginHorizontal: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconoLupa: {
    marginRight: 12,
  },
  barraBusqueda: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    paddingLeft: 10,
  },
  contenedorBlanco: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 37,
    borderTopRightRadius: 37,
    padding: 18,
    flex: 1,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  contenidoLista: {
    paddingHorizontal: 8,
  },
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  imagen: {
    width: 110,
    height: 110,
    marginRight: 16,
    borderRadius: 12,
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: "#ddd",
  },
  contenedorInfo: {
    flex: 1,
  },
  nombreDispositivo: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#333",
  },
  responsableTexto: {
    fontSize: 15,
    color: "#555",
    marginBottom: 5,
  },
  errorTexto: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#7d2bd3",
    padding: 14,
    borderRadius: 20,
    width: "55%",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 15,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

