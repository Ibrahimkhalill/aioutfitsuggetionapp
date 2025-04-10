import React, { useState, useRef } from "react";
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

export default function ForgetPasswordOtp({ route, navigation }) {
  const { email } = route.params || {}; // Get email from previous screen
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState(""); // New password state
  const [isLoading, setIsLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef([]);

  console.log('====================================');
  console.log(email);
  console.log('====================================');

  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join(""); // Combine OTP digits into a single string
    if (otpCode.length !== 6) {
      setErrorMessage("Please enter a 6-digit OTP");
      setErrorVisible(true);
      return;
    }
    

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/verify-otp/", {
        email,
        otp: otpCode,
       
      });
      if (response.status === 200) {
        Alert.alert("Success", "verify otp successfully!");
        navigation.navigate("ResetPassword", {email}); // Navigate to login screen
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to verify OTP. Please try again."
      );
      setErrorVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
     
      const response = await axiosInstance.post("/auth/password-reset/send-otp/", { email });
      if (response.status === 200) {
        Alert.alert("Success", "OTP resent successfully to your email!");
        setOtp(["", "", "", "", "", ""]); // Reset OTP inputs
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to resend OTP. Please try again."
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

        {/* Page Title */}
        <Text style={styles.title}>Email Verification</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Enter Your Code Here</Text>
        <Text style={styles.description}>
          Enter the 6-digit code that was sent to your email address
        </Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleChange(value, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
            />
          ))}
        </View>

        
        {/* Resend Code */}
        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendOtp}
          disabled={isLoading}
        >
          <Text style={styles.resendText}>Resend Code</Text>
        </TouchableOpacity>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.verifyButton, isLoading && styles.disabledButton]}
          onPress={handleVerifyOtp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify</Text>
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
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#C9A038",
    marginBottom: 5,
    marginTop: 100,
  },
  description: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
    width: "80%",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    gap: 5,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    color: "#333",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
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
  resendButton: {
    marginBottom: 20,
  },
  resendText: {
    fontSize: 14,
    color: "#C9A038",
    fontWeight: "bold",
  },
  verifyButton: {
    width: "100%",
    backgroundColor: "#C9A038",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});