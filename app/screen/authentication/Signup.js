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

export default function Signup({ navigation }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	function notifyMessage(msg) {
		if (Platform.OS === 'android') {
			ToastAndroid.showWithGravityAndOffset(
				msg,
				ToastAndroid.SHORT,
				ToastAndroid.TOP,
				25,
				160
			);
		} else {
			Alert.alert('Warning!', msg);
		}
	}

	const handleSignup = async () => {
		// Validation checks
		if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
			notifyMessage('All fields are required');
			return;
		}

		if (username.length < 3) {
			notifyMessage('Username must be at least 3 characters long');
			return;
		}

		if (password.length < 6) {
			notifyMessage('Password must be at least 6 characters long');
			return;
		}

		if (password !== confirmPassword) {
			notifyMessage("Passwords don't match");
			return;
		}

		setIsLoading(true);

		try {
			const response = await axiosInstance.post('/auth/signup/', {
				username: username.trim(),
				password: password,
			});

			// Assuming the API returns a success status or user data
			if (response.status === 201 || response.data.success) {
				Alert.alert('Success', 'Account created successfully!');
				// Clear form fields
				setUsername('');
				setPassword('');
				setConfirmPassword('');
				// Navigate to Login screen after a short delay
				setTimeout(() => {
					navigation.navigate('Login');
				}, 1000);
			}
		} catch (error) {
			// Handle different types of errors
			if (error.response) {
				// Server responded with an error status
				if (error.response.status === 400) {
					notifyMessage('Username already exists');
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
			console.error('Signup error:', error);
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

			<Text style={styles.subtitle}>CREATE YOUR ACCOUNT</Text>

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

			<View style={styles.inputContainer}>
				<Ionicons
					name="lock-closed-outline"
					size={24}
					color="#888"
					style={styles.inputIcon}
				/>
				<TextInput
					style={styles.input}
					placeholder="Confirm password"
					placeholderTextColor="#888"
					secureTextEntry={!showConfirmPassword}
					value={confirmPassword}
					onChangeText={setConfirmPassword}
				/>
				<TouchableOpacity
					style={styles.eyeIcon}
					onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
					<Ionicons
						name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
						size={24}
						color="#888"
					/>
				</TouchableOpacity>
			</View>

			<TouchableOpacity
				style={[styles.SignupButton, isLoading && styles.SignupButtonDisabled]}
				onPress={handleSignup}
				disabled={isLoading}>
				<Text style={styles.SignupButtonText}>
					{isLoading ? 'SIGNING UP...' : 'SIGN UP'}
				</Text>
			</TouchableOpacity>

			<Text style={styles.signInText}>
				Already have an account?
				<Text
					style={styles.signInLink}
					onPress={() => navigation.navigate('Login')}>
					{' '}
					Sign In
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
	},
});
