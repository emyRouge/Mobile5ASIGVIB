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
  Dimensions,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

const { width } = Dimensions.get("window");

const obtenerPorcentajeOcupacion = async () => {
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

const PantallaResumenBienes = () => {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  const [datos, setDatos] = useState({ ocupados: 0, libres: 0, bienesOcupados: 0, bienesLibres: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const data = await obtenerPorcentajeOcupacion();
        setDatos(data);
      } catch (err) {
        setError("Error al obtener los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6a1b9a" />
      <View style={styles.topSection}>
        <Image source={require("../assets/logo1.png")} style={styles.logo} />
        <Text style={styles.title}>Resumen de Bienes</Text>
      </View>
  
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#ff4081" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.chartContainer}>
            <PieChart
              data={[
                { name: "Ocupados", population: datos.ocupados, color: "#d50000", legendFontColor: "#fff", legendFontSize: 15 },
                { name: "Libres", population: datos.libres, color: "#00c853", legendFontColor: "#fff", legendFontSize: 15 },
              ]}
              width={width - 40}
              height={220}
              chartConfig={{
                backgroundColor: "#303030",
                backgroundGradientFrom: "#6a1b9a",
                backgroundGradientTo: "#ab47bc",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
            <Text style={styles.info}>Bienes Ocupados: {datos.bienesOcupados}</Text>
            <Text style={styles.info}>Bienes Libres: {datos.bienesLibres}</Text>
          </View>
        )}
  
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("PantallaAdminDispositivos")}>
          <Text style={styles.buttonText}>Ver Bienes</Text>
        </TouchableOpacity>
  
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Scanner")}>
          <Text style={styles.buttonText}>Escanear Código</Text>
        </TouchableOpacity>
  
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1e",
  },
  topSection: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#6a1b9a",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#ab47bc",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    borderWidth: 2,
    borderColor: "#ff80ab",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  chartContainer: {
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: "#fff",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#ff4081",
    padding: 12,
    borderRadius: 20,
    marginTop: 20,
    width: "70%",
    alignItems: "center",
    shadowColor: "#ff80ab",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#d50000",
    padding: 12,
    borderRadius: 20,
    marginTop: 10,
    width: "70%",
    alignItems: "center",
  },
  errorText: {
    color: "#ff1744",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
});

export default PantallaResumenBienes;