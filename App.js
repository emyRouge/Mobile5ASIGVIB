import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./context/AuthContext";
import MainNavigator from "./navigation/AppNavigator";
import AppNavigator from "./navigation/AppNavigator";


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <AuthProvider>
      <MainNavigator>
      <AppNavigator />
      </MainNavigator>
    </AuthProvider>
  </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
