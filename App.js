import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, Platform } from "react-native";

import { AuthProvider, useAuth } from "./app/screen/authentication/Auth";
import Login from "./app/screen/authentication/Login";
import Signup from "./app/screen/authentication/Signup";
import ProfileScreen from "./app/screen/page/ProfileScreen";
import ChatScreen from "./app/screen/page/ChatScreen";
import DressDetailsScreen from "./app/screen/page/DressDetailsScreen";
import MyWardrobeScreen from "./app/screen/page/MyWardrobeScreen";
import Home from "./app/screen/page/Home";
import ViewDress from "./app/screen/page/ViewDress";

const Stack = createNativeStackNavigator();

function UserStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="MyWardrobeScreen" component={MyWardrobeScreen} />
      <Stack.Screen name="DressDetailsScreen" component={DressDetailsScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="ViewWearpage" component={ViewDress} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

function AppContent() {
  const { isLoggedIn } = useAuth();
  console.log("isLoggedIn", isLoggedIn);

  // Ensure we return a valid navigator based on auth state
  return isLoggedIn ? <UserStack /> : <AuthStack />;
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
        <StatusBar style="light" backgroundColor="#1E1E2F" />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#1E1E2F",
  },
});