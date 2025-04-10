import React, { useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Alert,
	Platform,
	Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axiosInstance from '../component/axiosInstance';
import { useAuth } from './Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Signup({ navigation }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const { login, token } = useAuth();
	function notifyMessage(msg) {
		Alert.alert('Warning!', msg);
	}

	const handleLogin = async () => {
		// Validation checks
		if (!username.trim() || !password.trim()) {
			notifyMessage('All fields are required');
			return;
		}

		setIsLoading(true);

		try {
			const response = await axiosInstance.post('/auth/login/', {
				username: username.trim(),
				password: password,
			});

			// Assuming the API returns a success status or user data
			if (response.status === 200) {
				console.log('Login success:', response.data);

				setUsername('');
				setPassword('');
				// await AsyncStorage.setItem("refresh_token", response.data.refresh_token);
				// await AsyncStorage.setItem("token", response.data.access_token); // Save token
				login(response.data.access_token, response.data.refresh_token);
				navigation.navigate('Home');

				// Navigate to Login screen after a short delay
			}
		} catch (error) {
			console.log('Login error:', error.response.status);

			// Handle different types of errors
			if (error.response) {
				// Server responded with an error status
				if (error.response.status === 401) {
					notifyMessage('Username or password Wrong');
				} else {
					notifyMessage(
						'Signup failed: ' + (error.response.data.message || 'Unknown error')
					);
				}
			} else if (error.request) {
				// No response received
				notifyMessage('Network error. Please check your connection');
			} else {
				// Other errors
				notifyMessage('An error occurred during signup');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.gradientTextContainer}>
				<Image
					source={require('../../assets/logo.png')}
					style={{ width: 110, height: 160 }}
				/>

				<Text style={styles.title}>StyleNTU</Text>
			</View>

			<Text style={styles.subtitle}>Login to Your Account</Text>

			<View style={styles.inputContainer}>
				<Ionicons
					name="person-outline"
					size={24}
					color="#888"
					style={styles.inputIcon}
				/>
				<TextInput
					style={styles.input}
					placeholder="Username"
					placeholderTextColor="#888"
					value={username}
					onChangeText={setUsername}
					autoCapitalize="none"
				/>
			</View>

			<View style={styles.inputContainer}>
				<Ionicons
					name="lock-closed-outline"
					size={24}
					color="#888"
					style={styles.inputIcon}
				/>
				<TextInput
					style={styles.input}
					placeholder="Password"
					placeholderTextColor="#888"
					secureTextEntry={!showPassword}
					value={password}
					onChangeText={setPassword}
				/>
				<TouchableOpacity
					style={styles.eyeIcon}
					onPress={() => setShowPassword(!showPassword)}>
					<Ionicons
						name={showPassword ? 'eye-outline' : 'eye-off-outline'}
						size={24}
						color="#888"
					/>
				</TouchableOpacity>
			</View>

			<TouchableOpacity
				style={[styles.SignupButton, isLoading && styles.SignupButtonDisabled]}
				onPress={handleLogin}
				disabled={isLoading}>
				<Text style={styles.SignupButtonText}>
					{isLoading ? 'Sign In...' : 'Sign In'}
				</Text>
			</TouchableOpacity>

			<Text style={styles.signInText}>
				Don’t have an account?
				<Text
					style={styles.signInLink}
					onPress={() => navigation.navigate('Signup')}>
					{''} Sign Up
				</Text>
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#1E1E2F',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 20,
	},
	gradientTextContainer: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: 36,
		fontWeight: 'bold',
		color: '#9E01B7',
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 20,
		color: '#FFF',
		marginVertical: 20,
		fontWeight: 'bold',
	},
	inputContainer: {
		width: '100%',
		backgroundColor: '#2A2A3C',
		borderRadius: 10,
		marginVertical: 10,
		paddingHorizontal: 15,
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
	},
	input: {
		color: '#FFF',
		fontSize: 16,
		flex: 1,
		marginLeft: 10,
	},
	inputIcon: {
		marginRight: 10,
	},
	eyeIcon: {
		padding: 5,
	},
	SignupButton: {
		backgroundColor: '#FF5555',
		width: '100%',
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: 'center',
		marginVertical: 20,
		borderWidth: 1,
		borderColor: '#fff',
	},
	SignupButtonDisabled: {
		backgroundColor: '#FF8888',
		opacity: 0.7,
	},
	SignupButtonText: {
		color: '#FFF',
		fontSize: 18,
		fontWeight: 'bold',
	},
	signInText: {
		color: '#FFF',
		fontSize: 14,
	},
	signInLink: {
		color: '#00FF00',
		fontWeight: 'bold',
		marginLeft: 3,
	},
});
