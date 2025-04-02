import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { obtenerTodosLosBienes } from "../api/bienesApi";

const BienItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
    <Image
      source={{ uri: item.modelo?.foto || "https://via.placeholder.com/110" }}
      style={styles.image}
      resizeMode="cover"
    />
    <View style={styles.infoContainer}>
      <Text style={styles.deviceName} numberOfLines={1}>
        {item.tipoBien?.nombre || "Dispositivo"}
      </Text>
      
      <View style={styles.detailRow}>
        <MaterialIcons name="person" size={16} color="#bdbdbd" />
        <Text style={styles.detailText} numberOfLines={1}>
          {item.usuario?.nombre || "Sin asignar"}
        </Text>
      </View>
      
      <View style={styles.detailRow}>
        <MaterialIcons name="devices" size={16} color="#bdbdbd" />
        <Text style={styles.detailText} numberOfLines={1}>
          {item.modelo?.nombreModelo || "Sin modelo"}
        </Text>
      </View>
      
      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="tag-outline" size={16} color="#bdbdbd" />
        <Text style={styles.detailText} numberOfLines={1}>
          {item.marca?.nombre || "Sin marca"}
        </Text>
      </View>
      
      <View style={styles.detailRow}>
        <MaterialIcons name="location-on" size={16} color="#bdbdbd" />
        <Text style={styles.detailText} numberOfLines={1}>
          {item.lugar?.lugar || "Sin ubicación"}
        </Text>
      </View>
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBienes = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await obtenerTodosLosBienes();
      setBienes(data);
    } catch (err) {
      setError("No se pudieron cargar los dispositivos. Intenta nuevamente.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBienes();
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
      item.marca?.nombre?.toLowerCase().includes(lowercasedSearchText) ||
      item.codigoBarras?.toLowerCase().includes(lowercasedSearchText)
    );
  });

  const renderEmptyList = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="devices-other" size={64} color="#9e9e9e" />
        <Text style={styles.emptyText}>
          {searchText ? "No se encontraron dispositivos que coincidan con la búsqueda" : "No hay dispositivos disponibles"}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#6a1b9a" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerText}>Panel de Administración</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <MaterialIcons name="logout" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Buscar dispositivo, responsable, ubicación..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{bienes.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {bienes.filter(item => !item.lugar).length}
          </Text>
          <Text style={styles.statLabel}>Libres</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {bienes.filter(item => item.lugar).length}
          </Text>
          <Text style={styles.statLabel}>Ocupados</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={64} color="#ff5252" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchBienes}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {loading && !refreshing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6a1b9a" />
                <Text style={styles.loadingText}>Cargando dispositivos...</Text>
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
                ListEmptyComponent={renderEmptyList}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#6a1b9a"]}
                    tintColor="#6a1b9a"
                  />
                }
              />
            )}
          </>
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate("Scanner")}
      >
        <MaterialIcons name="qr-code-scanner" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    backgroundColor: "#6a1b9a",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
    height: 46,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: 46,
    padding: 0,
  },
  statsBar: {
    flexDirection: "row",
    backgroundColor: "#212121",
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 15,
    padding: 15,
    justifyContent: "space-around",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#9e9e9e",
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#424242",
    alignSelf: "center",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    marginTop: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra space for FAB
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#2d2d2d",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#424242",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  deviceName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#e0e0e0",
    marginLeft: 6,
    flex: 1,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    position: "absolute",
    top: 12,
    right: 12,
  },
  free: {
    backgroundColor: "#388e3c",
  },
  occupied: {
    backgroundColor: "#d32f2f",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff5252",
    textAlign: "center",
    fontSize: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    padding: 12,
    backgroundColor: "#6a1b9a",
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#9e9e9e",
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    color: "#9e9e9e",
    textAlign: "center",
    fontSize: 16,
    marginTop: 16,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#6a1b9a",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  logoutButton: {
    padding: 8,
  },
});