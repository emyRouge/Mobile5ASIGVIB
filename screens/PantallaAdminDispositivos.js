import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { obtenerTodosLosBienes } from "../api/bienesApi";

const BienItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
    <Image
      source={{ uri: item.modelo?.foto || "https://via.placeholder.com/110" }}
      style={styles.image}
    />
    <View style={styles.infoContainer}>
      <Text style={styles.deviceName}>
        {item.tipoBien?.nombre} - {item.lugar?.lugar}
      </Text>
      <Text style={styles.whiteText}>Responsable: {item.usuario?.nombre}</Text>
      <Text style={styles.whiteText}>Modelo: {item.modelo?.nombreModelo}</Text>
<Text style={styles.whiteText}>Marca: {item.marca?.nombre}</Text>

    </View>
    <View style={[styles.status, item.lugar ? styles.occupied : styles.free]}>
      <MaterialIcons
        name={item.lugar ? "block" : "check-circle"}
        size={20}
        color="white"
      />
      <Text style={styles.statusText}>{item.lugar ? "Ocupado" : "Libre"}</Text>
    </View>
  </TouchableOpacity>
);

export default function PantallaAdminDispositivos() {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const [bienes, setBienes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(null);

  const fetchBienes = async () => {
    try {
      setError(null);
      const data = await obtenerTodosLosBienes();
      setBienes(data);
    } catch (err) {
      setError("No se pudieron cargar los bienes. Intenta nuevamente.");
    }
  };

  useEffect(() => {
    fetchBienes();
  }, []);

  const filteredBienes = bienes.filter((item) => {
    const lowercasedSearchText = searchText.toLowerCase();
    return (
      item.tipoBien?.nombre?.toLowerCase().includes(lowercasedSearchText) ||
      item.lugar?.lugar?.toLowerCase().includes(lowercasedSearchText) ||
      item.usuario?.nombre?.toLowerCase().includes(lowercasedSearchText) ||
      item.modelo?.nombreModelo?.toLowerCase().includes(lowercasedSearchText) ||
      item.codigoBarras?.toLowerCase().includes(lowercasedSearchText)
    );
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#6a1b9a" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Administrador</Text>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={24} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Buscar..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.whiteContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchBienes}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredBienes}
            renderItem={({ item }) => (
              <BienItem
                item={item}
                onPress={(selectedItem) =>
                  navigation.navigate("DetalleBien", { item: selectedItem })
                }
              />
            )}
            keyExtractor={(item) => item.idBien.toString()}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1c1c1e",
  },
  header: {
    backgroundColor: "#6a1b9a",
    paddingHorizontal: 20,
    paddingVertical: 18,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#ab47bc",
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginTop: 12,
    width: "90%",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  whiteContainer: {
    flex: 1,
    backgroundColor: "#303030",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 18,
  },
  listContent: {
    paddingHorizontal: 8,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#424242",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ff80ab",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  deviceName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
  },
  responsibleText: {
    fontSize: 14,
    color: "#ccc",
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 80,
    alignSelf: "flex-start",
  },
  free: {
    backgroundColor: "#00c853",
  },
  occupied: {
    backgroundColor: "#d50000",
  },
  statusText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#ff1744",
    textAlign: "center",
    fontSize: 16,
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ff4081",
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#d50000",
    padding: 14,
    borderRadius: 20,
    width: "60%",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  whiteText: {
    color: "#fff",
  },
  
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
