/*
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";

const CustomAppBar = ({ navigation, title, isRoot }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => (isRoot ? navigation.dispatch(DrawerActions.openDrawer()) : navigation.goBack())}>
          <Ionicons name={isRoot ? "menu" : "arrow-back"} size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#6200ee",
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingTop: StatusBar.currentHeight, 
  },
  title: {
    color: "white",
    fontSize: 18,
    marginLeft: 15,
  },
});

export default CustomAppBar;

*/