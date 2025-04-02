import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

// API service function
const fetchOccupationData = async () => {
  try {
    const response = await fetch("http://192.168.0.37:8080/bienes/porcentaje-ocupacion");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener los datos");
    }

    return {
      ocupados: data.porcentajeOcupados || 0,
      libres: data.porcentajeLibres || 0,
      bienesOcupados: data.bienesOcupados || 0,
      bienesLibres: data.bienesLibres || 0,
    };
  } catch (error) {
    console.error("Error al obtener porcentajes:", error);
    throw error;
  }
};

// Componente de gráfico mejorado
const EnhancedChart = ({ ocupados, libres, bienesOcupados, bienesLibres }) => {
  // Aseguramos que los valores sean números y sumen 100
  const ocupadosValue = parseFloat(ocupados) || 0;
  const libresValue = parseFloat(libres) || 0;
  const total = ocupadosValue + libresValue;
  
  // Calculamos los porcentajes reales
  const ocupadosPercent = total > 0 ? (ocupadosValue / total) * 100 : 0;
  const libresPercent = total > 0 ? (libresValue / total) * 100 : 0;
  
  return (
    <View style={styles.chartContainer}>
      {/* Título del gráfico */}
      <Text style={styles.chartTitle}>Distribución de Bienes</Text>
      
      {/* Barra de progreso horizontal que muestra la proporción */}
      <View style={styles.progressContainer}>
        <View style={styles.chartBar}>
          <View 
            style={[
              styles.chartBarOcupados, 
              { width: `${ocupadosPercent}%` }
            ]} 
          />
          <View 
            style={[
              styles.chartBarLibres, 
              { width: `${libresPercent}%` }
            ]} 
          />
        </View>
        
        {/* Leyenda de la barra */}
        <View style={styles.barLegend}>
          <Text style={styles.barLegendText}>
            {`${ocupadosPercent.toFixed(1)}%`}
          </Text>
          <Text style={styles.barLegendText}>
            {`${libresPercent.toFixed(1)}%`}
          </Text>
        </View>
      </View>
      
      {/* Círculos de representación visual */}
      <View style={styles.chartCircles}>
        <View style={styles.circleCard}>
          <View style={styles.circleOcupados}>
            <Text style={styles.circleNumber}>{bienesOcupados}</Text>
          </View>
          <View style={styles.circleInfo}>
            <Text style={styles.circleLabel}>Ocupados</Text>
            <Text style={[styles.circlePercent, styles.redText]}>
              {`${ocupadosPercent.toFixed(1)}%`}
            </Text>
          </View>
        </View>
        
        <View style={styles.circleCard}>
          <View style={styles.circleLibres}>
            <Text style={styles.circleNumber}>{bienesLibres}</Text>
          </View>
          <View style={styles.circleInfo}>
            <Text style={styles.circleLabel}>Libres</Text>
            <Text style={[styles.circlePercent, styles.greenText]}>
              {`${libresPercent.toFixed(1)}%`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Componente de botón de acción
const ActionButton = ({ icon, title, onPress, color = "#8e24aa", iconColor = "#fff" }) => (
  <TouchableOpacity 
    style={[styles.actionButton, { backgroundColor: color }]}
    onPress={onPress}
  >
    <View style={styles.actionButtonContent}>
      {icon && (
        <View style={[styles.actionButtonIcon, { backgroundColor: iconColor }]}>
          <Text style={[styles.actionButtonIconText, { color }]}>{icon}</Text>
        </View>
      )}
      <Text style={styles.actionButtonText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

// Main component
const PantallaResumenBienes = () => {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  const [datos, setDatos] = useState({
    ocupados: 0,
    libres: 0,
    bienesOcupados: 0,
    bienesLibres: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchOccupationData();
        setDatos(data);
      } catch (err) {
        setError("Error al obtener los datos");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Render different components based on state
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#9c27b0" />
          <Text style={styles.loaderText}>Cargando datos...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>!</Text>
          <Text style={styles.errorTitle}>Error de conexión</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              loadData();
            }}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <EnhancedChart 
        ocupados={datos.ocupados} 
        libres={datos.libres}
        bienesOcupados={datos.bienesOcupados}
        bienesLibres={datos.bienesLibres}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6a1b9a" />
      
      {/* Header con logo y título */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image source={require("../assets/logo1.png")} style={styles.logo} />
          <Text style={styles.title}>Resumen de Bienes</Text>
        </View>
        
        {/* Botón de cerrar sesión en el header */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Contenedor principal */}
        <View style={styles.mainContainer}>
          {/* Sección de estadísticas */}
          <View style={styles.statsSection}>
            {renderContent()}
          </View>
          
          {/* Sección de acciones */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Acciones</Text>
            
            <ActionButton 
              icon="👁️" 
              title="Ver Todos los Bienes"
              onPress={() => navigation.navigate("PantallaAdminDispositivos")}
            />
            
            <ActionButton 
              icon="📷" 
              title="Escanear Código QR"
              onPress={() => navigation.navigate("Scanner")}
              color="#673ab7"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#6a1b9a",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  logoutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  statsSection: {
    marginBottom: 25,
  },
  actionsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#bb86fc",
    marginBottom: 15,
    paddingLeft: 5,
  },
  // Estilos para el loader
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  loaderText: {
    color: "#bb86fc",
    marginTop: 15,
    fontSize: 16,
  },
  // Estilos para el error
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 23, 68, 0.1)",
    padding: 25,
    borderRadius: 15,
    marginVertical: 20,
  },
  errorIcon: {
    fontSize: 30,
    color: "#ff1744",
    fontWeight: "bold",
    marginBottom: 10,
    width: 50,
    height: 50,
    textAlign: "center",
    lineHeight: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 23, 68, 0.2)",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff1744",
    marginBottom: 10,
  },
  errorText: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#ff1744",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // Estilos para el gráfico mejorado
  chartContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#6a1b9a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  progressContainer: {
    marginBottom: 25,
  },
  chartBar: {
    flexDirection: "row",
    height: 25,
    width: "100%",
    borderRadius: 12.5,
    overflow: "hidden",
    marginBottom: 8,
  },
  chartBarOcupados: {
    height: "100%",
    backgroundColor: "#d50000",
  },
  chartBarLibres: {
    height: "100%",
    backgroundColor: "#00c853",
  },
  barLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  barLegendText: {
    color: "#bbb",
    fontSize: 12,
  },
  chartCircles: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  circleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 15,
    padding: 15,
    width: "48%",
  },
  circleOcupados: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#d50000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  circleLibres: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#00c853",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  circleNumber: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  circleInfo: {
    flex: 1,
  },
  circleLabel: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
  },
  circlePercent: {
    fontSize: 16,
    fontWeight: "bold",
  },
  redText: {
    color: "#ff5252",
  },
  greenText: {
    color: "#69f0ae",
  },
  // Estilos para los botones de acción
  actionButton: {
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#8e24aa",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    overflow: "hidden",
  },
  actionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  actionButtonIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  actionButtonIconText: {
    fontSize: 18,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default PantallaResumenBienes;