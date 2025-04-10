import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../component/BackButton";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../component/axiosInstance"; // Assuming this is your axios setup
import ErrorModal from "../component/ErrorModal"; // Assuming you have this component

export default function ResetPassword({ route, navigation }) {
  const { email } = route.params || {}; // Get email and otp from ForgetPasswordOtp
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = async () => {
    if (!newPassword) {
      setErrorMessage("Please enter a new password");
      setErrorVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/password-reset/", {
        email,
        new_password: newPassword,
      });
      if (response.status === 200) {
        Alert.alert("Success", "Password reset successfully!");
        navigation.navigate("UserLogin"); // Navigate to login screen
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to reset password. Please try again."
      );
      setErrorVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent />

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <BackButton navigation={navigation} />
        </TouchableOpacity>
        <Text style={styles.title}>Reset Password</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Generate New Password</Text>
        <Text style={styles.description}>
          Enter your new password here and make it different from the previous one
        </Text>

        {/* New Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your new password"
            placeholderTextColor="#999"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        {/* Reset Button */}
        <TouchableOpacity
          style={[styles.nextButton, isLoading && styles.disabledButton]}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.nextButtonText}>Reset</Text>
          )}
        </TouchableOpacity>

        {/* Error Modal */}
        <ErrorModal
          message={errorMessage}
          isVisible={errorVisible}
          onClose={() => setErrorVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  backButton: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#C9A038",
    marginBottom: 100,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#C9A038",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 30,
    width: "80%",
  },
  inputContainer: {
    width: "100%",
  },
  inputLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  nextButton: {
    width: "100%",
    backgroundColor: "#C9A038",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});