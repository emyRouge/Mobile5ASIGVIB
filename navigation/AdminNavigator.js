import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PantallaResumenBienes from "../screens/PantallaResumenBienes";
import PantallaAdminDispositivos from "../screens/PantallaAdminDispositivos";
import DetalleBien from "../screens/DetalleBien";

const AdminStack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <AdminStack.Navigator initialRouteName="PantallaResumenBienes">
      <AdminStack.Screen
        name="PantallaResumenBienes"
        component={PantallaResumenBienes}
        options={{ title: "Resumen de Bienes" }}
      />
      <AdminStack.Screen
        name="PantallaAdminDispositivos"
        component={PantallaAdminDispositivos}
        options={{ title: "Dispositivos" }}
      />
      <AdminStack.Screen
        name="DetalleBien"
        component={DetalleBien}
        options={{ title: "Detalle del Bien" }}
      />
    </AdminStack.Navigator>
  );
}
