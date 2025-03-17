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
    const response = await fetch("http://localhost:8080/bienes/porcentaje-ocupacion");
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
      <StatusBar barStyle="light-content" backgroundColor="#7d2bd3" />
      <View style={styles.topSection}>
        <Image source={require("../assets/logo1.png")} style={styles.logo} />
        <Text style={styles.title}>Resumen de Bienes</Text>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#7d2bd3" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.chartContainer}>
            <PieChart
              data={[
                { name: "Ocupados", population: datos.ocupados, color: "#ff6b6b", legendFontColor: "#333", legendFontSize: 15 },
                { name: "Libres", population: datos.libres, color: "#4caf50", legendFontColor: "#333", legendFontSize: 15 },
              ]}
              width={300}
              height={220}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(125, 43, 211, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(125, 43, 211, ${opacity})`,
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
    backgroundColor: "#f4f4f9",
  },
  topSection: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#7d2bd3",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    borderWidth: 2,
    borderColor: "#c084f5",
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
    color: "#333",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#c084f5",
    padding: 12,
    borderRadius: 20,
    marginTop: 20,
    width: "70%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff6b6b",
    padding: 12,
    borderRadius: 20,
    marginTop: 10,
    width: "70%",
    alignItems: "center",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
});

export default PantallaResumenBienes;
