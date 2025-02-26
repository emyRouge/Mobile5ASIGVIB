import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DeviceAdminScreen from "../screens/DeviceAdminScreen"
import { Feather } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const AdminNavigator = () => (
  <DeviceAdminScreen/>
);

export default AdminNavigator;