import React, { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
	Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NavigationBar from '../component/NavigationBar';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import axiosInstance from '../component/axiosInstance';
import AddNewCategoryScreen from './AddNewCategoryScreen';

export default function Home({ navigation }) {
	const insets = useSafeAreaInsets();
	const [categoryData, setCategoryData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const [modalVisible, setModalVisible] = useState(false);
	const fetchCategory = async () => {
		setIsLoading(true);
		try {
			const response = await axiosInstance.get('/get_all_categories/');
			const data = response.data;

			// Handle different possible response structures
			if (Array.isArray(data)) {
				setCategoryData(data);
			} else if (data.categories) {
				setCategoryData(data.categories);
			} else if (data.total_unread) {
				setCategoryData(data.total_unread);
			}

			setError(null);
		} catch (error) {
			console.error('Error fetching categories:', error);
			setError('Failed to load categories. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCategory();
	}, []);

	const handleDelete = async (id) => {
		// Replace window.confirm with Alert.alert for confirmation
		Alert.alert(
			'Confirm Delete', // Title
			'Are you sure you want to delete this Category?', // Message
			[
				{
					text: 'Cancel',
					style: 'cancel', // This button will cancel the action
					onPress: () => {
						return; // Simply return if cancelled
					},
				},
				{
					text: 'Delete',
					style: 'destructive', // Makes the button appear in red (iOS) or bold (Android)
					onPress: async () => {
						// Proceed with deletion when confirmed
						setError('');

						try {
							const response = await axiosInstance.delete(
								`/delete_category/${id}/`
							);

							if (response.status === 204 || response.status === 200) {
								Alert.alert('Success', '✅ Category deleted successfully');
								fetchCategory(); // Refresh the category list
							} else {
								throw new Error('Failed to delete category');
							}
						} catch (err) {
							setError(
								err.response?.data?.message ||
									'Failed to delete category. Please try again.'
							);
						}
					},
				},
			],
			{ cancelable: true } // Allows dismissing by tapping outside on Android
		);
	};

	const renderCategoryItem = ({ item, index }) => (
		<TouchableOpacity
			key={index}
			style={styles.categoryButton}
			onPress={() =>
				navigation.navigate('ViewWearpage', { category_id: item.id })
			}>
			<Text style={styles.categoryText}>{item.name || item.category_name}</Text>
			<TouchableOpacity onPress={() => handleDelete(item.id)}>
				<AntDesign name="delete" size={20} color="white" />
			</TouchableOpacity>
		</TouchableOpacity>
	);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E2F' }}>
			<ScrollView
				contentContainerStyle={[
					styles.container,
					{ paddingBottom: 80 + insets.bottom },
				]}
				showsVerticalScrollIndicator={false}>
				{/* Illustration Section */}
				<View style={styles.illustrationContainer}>
					<Image
						source={require('../../assets/logo.png')}
						style={styles.illustration}
						resizeMode="cover"
						onError={() => console.log('Failed to load illustration')}
					/>
					<Text style={{ color: '#FFF', fontSize: 30, fontWeight: 'bold' }}>
						StyleNTU
					</Text>

					<Text style={styles.welcomeText}>
						Welcome to Your Virtual Wardrobe
					</Text>
				</View>

				{/* Categories Section */}
				<Text style={styles.sectionTitle}>Outfit Categories</Text>

				{isLoading ? (
					<ActivityIndicator
						size="large"
						color="#FF5555"
						style={styles.loading}
					/>
				) : error ? (
					<View style={styles.errorContainer}>
						<Text style={styles.errorText}>{error}</Text>
						<TouchableOpacity
							style={styles.retryButton}
							onPress={fetchCategory}>
							<Text style={styles.retryButtonText}>Retry</Text>
						</TouchableOpacity>
					</View>
				) : categoryData.length > 0 ? (
					categoryData.map((item, index) => renderCategoryItem({ item, index }))
				) : (
					<Text style={styles.noDataText}>No categories available</Text>
				)}

				{/* Welcome Text */}

				{/* View Wardrobe Button */}
				<TouchableOpacity
					style={styles.addCategoryButton}
					onPress={() => setModalVisible(true)}>
					<Icon name="add" size={24} color="#FFF" style={styles.icon} />
					<Text style={styles.categoryText}>Add New Category</Text>
				</TouchableOpacity>

				{/* Add New Category Modal */}
				<AddNewCategoryScreen
					visible={modalVisible}
					onClose={() => setModalVisible(false)}
					fetchCategories={fetchCategory}
				/>
			</ScrollView>

			{/* Navigation Bar */}
			<NavigationBar navigation={navigation} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#1E1E2F',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 10,
		flexGrow: 1,
	},
	illustrationContainer: {
		width: '100%',

		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
		overflow: 'hidden',
	},
	addCategoryButton: {
		flexDirection: 'row',
		backgroundColor: '#FF5555',
		width: '100%',
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: 'center',
		marginVertical: 5,
		borderWidth: 1,
		borderColor: '#fff',
	},
	icon: {
		marginHorizontal: 10,
	},
	categoryText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
	illustration: {
		width: 200,
		height: 200,
	},
	sectionTitle: {
		fontSize: 20,
		color: '#FFF',
		alignSelf: 'flex-start',
		marginBottom: 10,
		fontWeight: 'bold',
	},
	categoryButton: {
		flexDirection: 'row',
		backgroundColor: '#FF5555',
		width: '100%',
		paddingVertical: 15,
		paddingHorizontal: 10,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'space-between',
		marginVertical: 5,
		borderWidth: 1,
		borderColor: '#fff',
	},
	icon: {
		marginHorizontal: 10,
	},
	categoryText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: 'bold',
		flex: 1, // Added to prevent text truncation
	},
	welcomeText: {
		fontSize: 24,
		color: '#FFF',
		marginVertical: 30,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	viewWardrobeButton: {
		backgroundColor: '#FF5555',
		width: '100%',
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: 'center',
		marginVertical: 20,
		borderWidth: 1,
		borderColor: '#fff',
	},
	viewWardrobeText: {
		color: '#FFF',
		fontSize: 18,
		fontWeight: 'bold',
	},
	loading: {
		marginVertical: 20,
	},
	errorContainer: {
		alignItems: 'center',
		marginVertical: 20,
	},
	errorText: {
		color: '#FF5555',
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 10,
	},
	retryButton: {
		backgroundColor: '#FF5555',
		paddingVertical: 8,
		paddingHorizontal: 20,
		borderRadius: 5,
	},
	retryButtonText: {
		color: '#FFF',
		fontSize: 14,
		fontWeight: 'bold',
	},
	noDataText: {
		color: '#FFF',
		fontSize: 16,
		textAlign: 'center',
		marginVertical: 20,
	},
});
