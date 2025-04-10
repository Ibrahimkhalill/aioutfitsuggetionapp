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
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../component/BackButton";
import axiosInstance from "../component/axiosInstance";
import ErrorModal from "../component/ErrorModal";

export default function ForgetPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Email validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendOtp = async () => {
    if (!email) {
      setErrorMessage("Email is required");
      setErrorVisible(true);
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      setErrorVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/password-reset/send-otp/", { email });
      if (response.status === 200) {
        Alert.alert("Success", "OTP sent successfully to your email!");
        navigation.navigate("ForgetPasswordOtp", { email }); // Pass email to OTP screen
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to send OTP. Please try again."
      );
      setErrorVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <BackButton navigation={navigation} />
        </TouchableOpacity>
        <Text style={styles.title}>Forget Password</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Enter Your Mail</Text>
        <Text style={styles.description}>
          Enter your email address associated with your account
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, isLoading && styles.disabledButton]}
          onPress={handleSendOtp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.nextButtonText}>Next</Text>
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
    backgroundColor: "#A9A9A9", // Greyed out when loading
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});